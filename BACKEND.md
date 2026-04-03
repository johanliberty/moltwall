# MoltWall Backend — Convex Setup Guide

Gw recommend **Convex** buat MoltWall karena:
- Real-time subscriptions built-in (perfect buat Live Logs feed)
- Serverless — ga perlu manage server
- TypeScript native
- Free tier generous banget

---

## 1. Install Convex

```bash
cd app-fixed   # folder frontend lo
npm install convex
npx convex dev  # ini bakal bikin project di cloud + generate client
```

Ini bakal buka browser → login → nama project → selesai.

---

## 2. Struktur folder yang perlu dibuat

```
convex/
  schema.ts          # definisi tabel database
  events.ts          # queries & mutations untuk log events
  agents.ts          # CRUD agents
  rules.ts           # CRUD security rules
  stats.ts           # aggregate stats
```

---

## 3. Schema (convex/schema.ts)

```typescript
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  events: defineTable({
    agentId: v.string(),
    tool: v.string(),
    action: v.union(v.literal("allow"), v.literal("deny"), v.literal("sandbox"), v.literal("prompt")),
    rule: v.string(),
    riskScore: v.number(),
    latencyMs: v.number(),
    params: v.optional(v.any()),
    reason: v.optional(v.string()),
  }).index("by_agent", ["agentId"]),

  agents: defineTable({
    name: v.string(),
    type: v.string(),
    status: v.union(v.literal("active"), v.literal("idle"), v.literal("suspended")),
    model: v.string(),
    apiKey: v.string(),
  }),

  rules: defineTable({
    name: v.string(),
    tool: v.string(),
    match: v.string(),
    action: v.union(v.literal("allow"), v.literal("deny"), v.literal("sandbox"), v.literal("prompt")),
    enabled: v.boolean(),
    priority: v.number(),
    hits: v.number(),
  }).index("by_priority", ["priority"]),
})
```

---

## 4. Events (convex/events.ts)

```typescript
import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Real-time: frontend subscribe pake useQuery — auto update!
export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 100 }) => {
    return ctx.db.query("events").order("desc").take(limit)
  },
})

// Dipanggil dari proxy engine / SDK
export const ingest = mutation({
  args: {
    agentId: v.string(),
    tool: v.string(),
    action: v.union(v.literal("allow"), v.literal("deny"), v.literal("sandbox"), v.literal("prompt")),
    rule: v.string(),
    riskScore: v.number(),
    latencyMs: v.number(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("events", args)
  },
})
```

---

## 5. Connect ke frontend (src/hooks/use-events.ts)

```typescript
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

export function useEvents(limit = 100) {
  // ini real-time! auto re-render tiap ada event baru
  return useQuery(api.events.list, { limit })
}
```

---

## 6. Update Logs page untuk pakai real data

```typescript
// Di logs.tsx, ganti useState dummy dengan:
import { useEvents } from "@/hooks/use-events"

const events = useEvents(200)
// events?.map(...) — langsung real-time dari Convex
```

---

## 7. API Endpoint untuk SDK (via Convex HTTP Actions)

```typescript
// convex/http.ts
import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { api } from "./_generated/api"

const http = httpRouter()

// POST /api/v1/check — dipanggil SDK
http.route({
  path: "/api/v1/check",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const { agent_id, tool, params } = await req.json()

    // Policy engine logic di sini
    const rules = await ctx.runQuery(api.rules.list)
    let action: "allow" | "deny" | "sandbox" | "prompt" = "allow"
    let matchedRule = "default-policy"
    let riskScore = 0

    // Simple matching (expand sesuai kebutuhan)
    for (const rule of rules.filter(r => r.enabled)) {
      if (tool.match(rule.tool.replace(/\*/g, ".*"))) {
        action = rule.action
        matchedRule = rule.name
        break
      }
    }

    // Log event
    const start = Date.now()
    await ctx.runMutation(api.events.ingest, {
      agentId: agent_id,
      tool,
      action,
      rule: matchedRule,
      riskScore,
      latencyMs: Date.now() - start,
    })

    return new Response(JSON.stringify({ decision: action, risk_score: riskScore, reason: matchedRule }), {
      headers: { "Content-Type": "application/json" },
    })
  }),
})

export default http
```

---

## 8. Environment variables

```env
# .env.local
VITE_CONVEX_URL=https://your-project.convex.cloud
```

---

## Summary: Convex vs Supabase untuk MoltWall

| | Convex | Supabase |
|---|---|---|
| Real-time logs | ✅ Built-in, zero config | ✅ tapi perlu setup Realtime |
| Setup speed | ⚡ 5 menit | ~20 menit |
| TypeScript | ✅ First-class | ✅ |
| API endpoint | ✅ HTTP Actions | ✅ Edge Functions |
| Free tier | Generous | Generous |
| **Verdict** | **Pilih ini** | Overkill untuk MVP |

---

## Langkah selanjutnya setelah backend jalan

1. Ganti dummy data di `dashboard.tsx`, `logs.tsx`, `agents.tsx` dengan `useQuery` dari Convex
2. Bikin real policy engine di `convex/http.ts`
3. Publish SDK ke npm: `@moltwall/sdk` — wrapper around `/api/v1/check`
4. Update CA token di `token-section.tsx` setelah launch di Base
