import { ConvexError, v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  query,
} from "./_generated/server";
import { roles } from "./schema";

export async function getStudent(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) {
  const student = await ctx.db
    .query("students")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier)
    )
    .first();
  if (!student) {
    throw new ConvexError("Expected student to be defined");
  }
  return student;
}

export const createStudent = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  async handler(ctx, args) {
    await ctx.db.insert("students", {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
      name: args.name,
      // email: args.email,
      image: args.image,
      // department: "",
      // graduationYear: null,
    });
  },
});

export const updateStudent = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    department: v.optional(v.string()),
    graduationYear: v.optional(v.number()),
  },
  async handler(ctx, args) {
    const student = await ctx.db
      .query("students")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .first();
    if (!student) {
      throw new ConvexError("No student with this token found");
    }
    await ctx.db.patch(student._id, {
      name: args.name,
      email: args.email,
      image: args.image,
      department: args.department,
      graduationYear: args.graduationYear,
    });
  },
});

export const addOrgIdToStudent = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  async handler(ctx, args) {
    const student = await getStudent(ctx, args.tokenIdentifier);
    await ctx.db.patch(student._id, {
      orgIds: [...student.orgIds, { orgId: args.orgId, role: args.role }],
    });
  },
});

export const updateRoleInOrgForStudent = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  async handler(ctx, args) {
    const student = await getStudent(ctx, args.tokenIdentifier);
    const org = student.orgIds.find((org) => org.orgId === args.orgId);
    if (!org) {
      throw new ConvexError(
        "Expected an org on the student but was not found when updating"
      );
    }
    org.role = args.role;
    await ctx.db.patch(student._id, {
      orgIds: student.orgIds,
    });
  },
});

export const getStudentProfile = query({
  args: { studentId: v.id("students") },
  async handler(ctx, args) {
    const student = await ctx.db.get(args.studentId);
    return {
      name: student?.name,
      email: student?.email,
      image: student?.image,
      department: student?.department,
      graduationYear: student?.graduationYear,
    };
  },
});

export const getMe = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const student = await getStudent(ctx, identity.tokenIdentifier);
    if (!student) {
      return null;
    }
    return student;
  },
});
