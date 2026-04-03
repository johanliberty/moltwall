import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, Search, Filter, Download, CheckCircle2, XCircle, AlertCircle, Shield, RefreshCw, Pause, Play } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModeToggle } from "@/components/mode-toggle"
import { Sidebar } from "./dashboard"

type LogEntry = {
  id: string
  ts: string
  agent: string
  tool: string
  action: "allow" | "deny" | "sandbox" | "prompt"
  rule: string
  riskScore: number
  latency: number
}

const tools = ["file.write", "file.read", "shell.exec", "api.request", "db.query", "code.exec", "http.get", "fs.delete"]
const agents = ["Agent-A1", "Agent-B2", "Agent-C3", "Agent-E5"]
const rules = ["block-ssh-keys", "allow-read-file", "approve-shell", "default-policy", "block-curl-exfil", "rate-limit"]
const actions: LogEntry["action"][] = ["allow", "allow", "allow", "allow", "allow", "deny", "sandbox", "prompt"]

function makeLog(): LogEntry {
  return {
    id: Math.random().toString(36).slice(2),
    ts: new Date().toISOString(),
    agent: agents[Math.floor(Math.random() * agents.length)],
    tool: tools[Math.floor(Math.random() * tools.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    rule: rules[Math.floor(Math.random() * rules.length)],
    riskScore: Math.floor(Math.random() * 80),
    latency: Math.floor(Math.random() * 20) + 2,
  }
}

const actionConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  allow: { icon: CheckCircle2, color: "text-green-500", label: "Allow" },
  deny: { icon: XCircle, color: "text-red-500", label: "Deny" },
  sandbox: { icon: Shield, color: "text-yellow-500", label: "Sandbox" },
  prompt: { icon: AlertCircle, color: "text-blue-500", label: "Prompt" },
}

function formatTs(ts: string) {
  return new Date(ts).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function Logs() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>(() => Array.from({ length: 20 }, makeLog).reverse())
  const [live, setLive] = useState(true)
  const [search, setSearch] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!live) return
    const t = setInterval(() => {
      setLogs(prev => [makeLog(), ...prev].slice(0, 200))
    }, 1200)
    return () => clearInterval(t)
  }, [live])

  const filtered = logs.filter(l => {
    if (filterAction !== "all" && l.action !== filterAction) return false
    if (search && !l.tool.includes(search) && !l.agent.toLowerCase().includes(search.toLowerCase()) && !l.rule.includes(search)) return false
    return true
  })

  const exportLogs = () => {
    const csv = ["timestamp,agent,tool,action,rule,risk_score,latency_ms",
      ...filtered.map(l => `${l.ts},${l.agent},${l.tool},${l.action},${l.rule},${l.riskScore},${l.latency}`)
    ].join("\n")
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    a.download = "moltwall-logs.csv"
    a.click()
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block"><Sidebar /></div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 z-10"><Sidebar mobile onClose={() => setMobileOpen(false)} /></div>
        </div>
      )}
      <main className="flex-1 md:ml-64">
        <header className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></Button>
            <h1 className="text-xl font-semibold">Security Logs</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${live ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
              <span className="text-xs text-muted-foreground hidden sm:inline">{live ? "Live" : "Paused"}</span>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setLive(l => !l)}>
              {live ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {live ? "Pause" : "Resume"}
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={exportLogs}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <ModeToggle />
          </div>
        </header>

        <div className="p-6 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search by agent, tool, rule..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="allow">Allow</SelectItem>
                <SelectItem value="deny">Deny</SelectItem>
                <SelectItem value="sandbox">Sandbox</SelectItem>
                <SelectItem value="prompt">Prompt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-3">
            {(["allow", "deny", "sandbox", "prompt"] as const).map(a => {
              const c = actionConfig[a]
              const count = filtered.filter(l => l.action === a).length
              return (
                <Card key={a} className="cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setFilterAction(filterAction === a ? "all" : a)}>
                  <CardContent className="p-3 flex items-center gap-2">
                    <c.icon className={`h-4 w-4 ${c.color} shrink-0`} />
                    <div>
                      <p className="text-lg font-bold leading-none">{count}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Log Table */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Event Feed</CardTitle>
                  <CardDescription>{filtered.length} events</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setLogs(Array.from({ length: 20 }, makeLog).reverse())}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Time</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Agent</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Tool</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Action</th>
                      <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground hidden md:table-cell">Rule</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground hidden sm:table-cell">Risk</th>
                      <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground hidden lg:table-cell">Latency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {filtered.slice(0, 100).map((log) => {
                        const ac = actionConfig[log.action]
                        const Icon = ac.icon
                        return (
                          <motion.tr
                            key={log.id}
                            initial={{ opacity: 0, backgroundColor: "hsl(var(--primary) / 0.08)" }}
                            animate={{ opacity: 1, backgroundColor: "transparent" }}
                            transition={{ duration: 0.6 }}
                            className="border-b hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-4 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap">{formatTs(log.ts)}</td>
                            <td className="px-4 py-2 font-medium whitespace-nowrap">{log.agent}</td>
                            <td className="px-4 py-2"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{log.tool}</code></td>
                            <td className="px-4 py-2">
                              <div className={`flex items-center gap-1.5 ${ac.color}`}>
                                <Icon className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">{ac.label}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-xs text-muted-foreground hidden md:table-cell">{log.rule}</td>
                            <td className="px-4 py-2 text-right hidden sm:table-cell">
                              <span className={`text-xs font-medium ${log.riskScore > 50 ? "text-red-500" : log.riskScore > 25 ? "text-yellow-500" : "text-green-500"}`}>{log.riskScore}</span>
                            </td>
                            <td className="px-4 py-2 text-right text-xs text-muted-foreground hidden lg:table-cell">{log.latency}ms</td>
                          </motion.tr>
                        )
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <div ref={endRef} />
        </div>
      </main>
    </div>
  )
}
