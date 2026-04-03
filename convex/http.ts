import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { api } from "./_generated/api"

const http = httpRouter()

// POST /api/v1/check — endpoint yang dipanggil SDK
// curl -X POST $CONVEX_URL/api/v1/check \
//   -H "Content-Type: application/json" \
//   -d '{"agent_id":"agent-1","tool":"bash","params":{"cmd":"ls"}}'
http.route({
  path: "/api/v1/check",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const start = Date.now()

    let body: { agent_id: string; tool: string; params?: Record<string, unknown> }
    try {
      body = await req.json()
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { agent_id, tool, params } = body
    if (!agent_id || !tool) {
      return new Response(
        JSON.stringify({ error: "agent_id and tool are required" }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      )
    }

    // Load rules sorted by priority
    const rules = await ctx.runQuery(api.rules.list)
    const activeRules = rules.filter((r) => r.enabled)

    type Action = "allow" | "deny" | "sandbox" | "prompt"
    let action: Action = "allow"
    let matchedRule = "default-policy"
    let riskScore = 0
    let matchedRuleId: string | null = null

    // Pattern matching — rule.tool supports glob-style * wildcard
    for (const rule of activeRules) {
      const pattern = rule.tool.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")
      if (new RegExp(`^${pattern}$`, "i").test(tool)) {
        action = rule.action as Action
        matchedRule = rule.name
        matchedRuleId = rule._id
        // Assign risk score based on action
        riskScore = action === "deny" ? 90 : action === "sandbox" ? 60 : action === "prompt" ? 30 : 5
        break
      }
    }

    // Log the event
    await ctx.runMutation(api.events.ingest, {
      agentId: agent_id,
      tool,
      action,
      rule: matchedRule,
      riskScore,
      latencyMs: Date.now() - start,
      params,
    })

    // Increment hit counter on matched rule
    if (matchedRuleId) {
      await ctx.runMutation(api.rules.incrementHits, { id: matchedRuleId as never })
    }

    const response = {
      decision: action,
      risk_score: riskScore,
      rule: matchedRule,
      latency_ms: Date.now() - start,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }),
})

// Handle preflight CORS
http.route({
  path: "/api/v1/check",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  }),
})

export default http
