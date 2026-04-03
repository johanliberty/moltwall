import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

// ─── Events ────────────────────────────────────────────────────────────────

export function useEvents(
  limit = 100,
  agentId?: string,
  action?: "allow" | "deny" | "sandbox" | "prompt"
) {
  // Real-time! Auto re-render tiap ada event baru masuk — zero polling needed
  return useQuery(api.events.list, { limit, agentId, action })
}

export function useEventStats() {
  return useQuery(api.events.stats, {})
}

// ─── Agents ────────────────────────────────────────────────────────────────

export function useAgents() {
  return useQuery(api.agents.list, {})
}

export function useCreateAgent() {
  return useMutation(api.agents.create)
}

export function useUpdateAgentStatus() {
  return useMutation(api.agents.updateStatus)
}

export function useRemoveAgent() {
  return useMutation(api.agents.remove)
}

// ─── Rules ─────────────────────────────────────────────────────────────────

export function useRules() {
  return useQuery(api.rules.list, {})
}

export function useCreateRule() {
  return useMutation(api.rules.create)
}

export function useToggleRule() {
  return useMutation(api.rules.toggle)
}

export function useRemoveRule() {
  return useMutation(api.rules.remove)
}
