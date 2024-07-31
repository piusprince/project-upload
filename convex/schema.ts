import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileTypes = v.union(
  v.literal("pdf"),
  v.literal("doc"),
  v.literal("docx"),
  v.literal("zip")
);

export const projectStatus = v.union(
  v.literal("draft"),
  v.literal("submitted"),
  v.literal("approved"),
  v.literal("rejected")
);

export const roles = v.union(
  v.literal("admin"),
  v.literal("supervisor"),
  v.literal("student")
);

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    description: v.string(),
    type: fileTypes,
    fileId: v.id("_storage"),
    status: projectStatus,
    studentId: v.id("students"),
    supervisorId: v.optional(v.id("students")),
    submissionDate: v.optional(v.string()),
    department: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    orgId: v.string(),
    shouldDelete: v.optional(v.boolean()),
  })
    .index("by_orgId", ["orgId"])
    .index("by_studentId", ["studentId"])
    .index("by_status", ["status"])
    .index("by_shouldDelete", ["shouldDelete"]),

  favorites: defineTable({
    projectId: v.id("projects"),
    orgId: v.string(),
    userId: v.id("students"),
  })
    .index("by_userId_orgId_projectId", ["userId", "orgId", "projectId"])
    .index("by_orgId_projectId", ["orgId", "projectId"]),

  students: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    department: v.optional(v.string()),
    graduationYear: v.optional(v.number()),
    orgIds: v.array(
      v.object({
        orgId: v.string(),
        role: roles,
      })
    ),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
