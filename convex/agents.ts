import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("agents").collect()
  },
})

export const get = query({
  args: { id: v.id("agents") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id)
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    model: v.string(),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("agents", { ...args, status: "idle" })
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id("agents"),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("suspended")
    ),
  },
  handler: async (ctx, { id, status }) => {
    return ctx.db.patch(id, { status })
  },
})

export const remove = mutation({
  args: { id: v.id("agents") },
  handler: async (ctx, { id }) => {
    return ctx.db.delete(id)
  },
})
