import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Real-time log feed — frontend subscribe pake useQuery, auto update tiap ada event baru
export const list = query({
  args: {
    limit: v.optional(v.number()),
    agentId: v.optional(v.string()),
    action: v.optional(
      v.union(
        v.literal("allow"),
        v.literal("deny"),
        v.literal("sandbox"),
        v.literal("prompt")
      )
    ),
  },
  handler: async (ctx, { limit = 100, agentId, action }) => {
    let q = ctx.db.query("events").order("desc")

    if (agentId) {
      q = ctx.db.query("events").withIndex("by_agent", (q) => q.eq("agentId", agentId)).order("desc")
    }

    const results = await q.take(limit * 2) // over-fetch for client-side filter
    if (action) return results.filter((e) => e.action === action).slice(0, limit)
    return results.slice(0, limit)
  },
})

// Stats aggregate buat dashboard
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("events").order("desc").take(1000)
    const total = all.length
    const blocked = all.filter((e) => e.action === "deny").length
    const sandboxed = all.filter((e) => e.action === "sandbox").length
    const avgRisk =
      total > 0 ? all.reduce((sum, e) => sum + e.riskScore, 0) / total : 0
    const avgLatency =
      total > 0 ? all.reduce((sum, e) => sum + e.latencyMs, 0) / total : 0

    return { total, blocked, sandboxed, avgRisk, avgLatency }
  },
})

// Dipanggil dari SDK / proxy engine
export const ingest = mutation({
  args: {
    agentId: v.string(),
    tool: v.string(),
    action: v.union(
      v.literal("allow"),
      v.literal("deny"),
      v.literal("sandbox"),
      v.literal("prompt")
    ),
    rule: v.string(),
    riskScore: v.number(),
    latencyMs: v.number(),
    params: v.optional(v.any()),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("events", args)
  },
})
