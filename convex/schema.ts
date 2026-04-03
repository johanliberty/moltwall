import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  events: defineTable({
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
  })
    .index("by_agent", ["agentId"])
    .index("by_action", ["action"]),

  agents: defineTable({
    name: v.string(),
    type: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("suspended")
    ),
    model: v.string(),
    apiKey: v.string(),
  }),

  rules: defineTable({
    name: v.string(),
    tool: v.string(),
    match: v.string(),
    action: v.union(
      v.literal("allow"),
      v.literal("deny"),
      v.literal("sandbox"),
      v.literal("prompt")
    ),
    enabled: v.boolean(),
    priority: v.number(),
    hits: v.number(),
  }).index("by_priority", ["priority"]),
})
