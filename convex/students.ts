import { internalMutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createStudent = internalMutation({
  args: {
    tokenIdentifier: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("students", {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
    });
  },
});

export const addOrgIdToStudent = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const student = await ctx.db
      .query("students")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .first();

    if (!student) {
      throw new ConvexError("Student not found");
    }

    await ctx.db.patch(student._id, {
      orgIds: [...student.orgIds, args.orgId],
    });
  },
});
