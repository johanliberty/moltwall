import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("rules")
      .withIndex("by_priority")
      .order("asc")
      .collect()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    tool: v.string(),
    match: v.string(),
    action: v.union(
      v.literal("allow"),
      v.literal("deny"),
      v.literal("sandbox"),
      v.literal("prompt")
    ),
    priority: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("rules", { ...args, enabled: true, hits: 0 })
  },
})

export const toggle = mutation({
  args: { id: v.id("rules"), enabled: v.boolean() },
  handler: async (ctx, { id, enabled }) => {
    return ctx.db.patch(id, { enabled })
  },
})

export const incrementHits = mutation({
  args: { id: v.id("rules") },
  handler: async (ctx, { id }) => {
    const rule = await ctx.db.get(id)
    if (rule) return ctx.db.patch(id, { hits: rule.hits + 1 })
  },
})

export const remove = mutation({
  args: { id: v.id("rules") },
  handler: async (ctx, { id }) => {
    return ctx.db.delete(id)
  },
})
