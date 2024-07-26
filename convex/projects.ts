import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createProject = mutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be logged in to create a project");
    }

    await ctx.db.insert("projects", {
      name: args.name,
    });
  },
});

export const getProjects = query({
  args: {},
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    return ctx.db.query("projects").collect();
  },
});
