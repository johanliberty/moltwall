# MoltWall — Convex Backend Setup

## File yang perlu lo copy ke project

```
convex/
  schema.ts       → copy ke root/convex/schema.ts
  events.ts       → copy ke root/convex/events.ts
  agents.ts       → copy ke root/convex/agents.ts
  rules.ts        → copy ke root/convex/rules.ts
  http.ts         → copy ke root/convex/http.ts

src/hooks/
  use-convex.ts   → copy ke src/hooks/use-convex.ts

src/
  main.tsx        → REPLACE src/main.tsx yang lama

src/components/landing/
  roadmap.tsx     → REPLACE roadmap yang lama
```

---

## Steps setup Convex (5 menit)

### 1. Install

```bash
npm install convex
```

### 2. Init project Convex

```bash
npx convex dev
```

Ini bakal:
- Buka browser → login/signup di dashboard.convex.dev
- Minta nama project (e.g. "moltwall")
- Generate folder `convex/_generated/` secara otomatis
- Kasih lo `VITE_CONVEX_URL` di `.env.local`

### 3. Copy file-file di atas ke project

### 4. Jalanin dev server

```bash
# Terminal 1 — Convex (keep running)
npx convex dev

# Terminal 2 — Frontend
npm run dev
```

---

## Cara pakai di pages

### Logs page (real-time!)

```tsx
// src/pages/logs.tsx
import { useEvents } from "@/hooks/use-convex"

export default function Logs() {
  const events = useEvents(200)   // auto update tanpa polling!

  return (
    <div>
      {events?.map((event) => (
        <div key={event._id}>
          {event.tool} → {event.action} | risk: {event.riskScore}
        </div>
      ))}
    </div>
  )
}
```

### Dashboard (stats)

```tsx
import { useEventStats } from "@/hooks/use-convex"

const stats = useEventStats()
// stats?.total, stats?.blocked, stats?.avgRisk
```

### Agents page

```tsx
import { useAgents, useCreateAgent, useUpdateAgentStatus } from "@/hooks/use-convex"

const agents = useAgents()
const createAgent = useCreateAgent()
const updateStatus = useUpdateAgentStatus()

// Create
await createAgent({ name: "My Agent", type: "coding", model: "claude-opus-4", apiKey: "sk-..." })

// Suspend
await updateStatus({ id: agent._id, status: "suspended" })
```

---

## SDK endpoint

Setelah `npx convex dev` jalan, lo bakal dapet URL kayak:
`https://your-project.convex.cloud`

SDK lo bisa hit:

```
POST https://your-project.convex.cloud/api/v1/check
Content-Type: application/json

{
  "agent_id": "agent-abc",
  "tool": "bash",
  "params": { "cmd": "rm -rf /" }
}
```

Response:
```json
{
  "decision": "deny",
  "risk_score": 90,
  "rule": "block-destructive-bash",
  "latency_ms": 12
}
```

---

## Roadmap changes

Roadmap di-update ke timeline 2025–2026+:
- Q3 2025: Foundation (completed)
- Q4 2025: Expansion (completed)
- Q1 2026: Enterprise Ready (completed)
- **Q2 2026: Token Launch ← NOW (in-progress)**
- Q3–Q4 2026: Decentralization (upcoming)
- 2027+: The Future (upcoming)

Ada banner "NOW" di milestone aktif + Zap icon pulsing di bagian atas section.
