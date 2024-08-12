import { ConvexError, v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { getStudent } from "./students";
import { fileTypes, projectStatus } from "./schema";
import { Doc, Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("You must be logged in to upload a project file");
  }

  return await ctx.storage.generateUploadUrl();
});

export async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  const identity = await ctx.auth.getUserIdentity();

  console.log({ identity });

  if (!identity) {
    return null;
  }

  const student = await ctx.db
    .query("students")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first();

  console.log({ student });

  if (!student) {
    return null;
  }

  const hasAccess = student.orgIds.some((item) => item.orgId === orgId);

  if (!hasAccess) {
    return null;
  }

  return { student };
}

export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type: fileTypes,
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    console.log({ hasAccess, args });

    if (!hasAccess) {
      throw new ConvexError("You do not have access to this organization");
    }

    await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
      orgId: args.orgId,
      fileId: args.fileId,
      type: args.type,
      studentId: hasAccess.student._id,
      status: "draft",
      submissionDate: new Date().toISOString(),
      department: "",
    });
  },
});

export const getProjects = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    status: v.optional(projectStatus),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      return [];
    }

    let projects = await ctx.db
      .query("projects")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    const query = args.query;

    if (query) {
      projects = projects.filter((project) =>
        project.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (args.status) {
      projects = projects.filter((project) => project.status === args.status);
    }

    const projectsWithUrl = await Promise.all(
      projects.map(async (project) => ({
        ...project,
        fileUrl: await ctx.storage.getUrl(project.fileId),
      }))
    );

    return projectsWithUrl;
  },
});

function assertCanModifyProject(
  student: Doc<"students">,
  project: Doc<"projects">
) {
  const canModify =
    project.studentId === student._id ||
    student.orgIds.find((org) => org.orgId === project.orgId)?.role === "admin";

  if (!canModify) {
    throw new ConvexError("You do not have permission to modify this project");
  }
}

export const updateProjectStatus = mutation({
  args: { projectId: v.id("projects"), status: projectStatus },
  async handler(ctx, args) {
    const access = await hasAccessToProject(ctx, args.projectId);

    if (!access) {
      throw new ConvexError("No access to project");
    }

    assertCanModifyProject(access.student, access.project);

    await ctx.db.patch(args.projectId, {
      status: args.status,
    });
  },
});

async function hasAccessToProject(
  ctx: QueryCtx | MutationCtx,
  projectId: Id<"projects">
) {
  const project = await ctx.db.get(projectId);

  if (!project) {
    return null;
  }

  const hasAccess = await hasAccessToOrg(ctx, project.orgId);

  if (!hasAccess) {
    return null;
  }

  return { student: hasAccess.student, project };
}

export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  async handler(ctx, args) {
    const access = await hasAccessToProject(ctx, args.projectId);

    if (!access) {
      throw new ConvexError("No access to project");
    }

    assertCanModifyProject(access.student, access.project);

    await ctx.storage.delete(access.project.fileId);
    await ctx.db.delete(args.projectId);
  },
});
