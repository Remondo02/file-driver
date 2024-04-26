import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createFile = mutation({
  args: { name: v.string() },
  async handler(ctx, args) {
    await ctx.db.insert("files", { name: args.name })
  },
})

export const getFiles = query({
  args: {},
  async handler(ctx, args) {
    return ctx.db.query("files").collect()
  },
})
