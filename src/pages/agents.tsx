import { useState } from "react"
import { motion } from "framer-motion"
import { Bot, Plus, MoreVertical, Activity, Shield, Clock, CheckCircle2, XCircle, AlertCircle, Trash2, Settings2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu } from "lucide-react"
import { Sidebar } from "./dashboard"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const agents = [
  { id: "agent-a1", name: "Agent-A1", type: "File System Agent", status: "active", requests: 12453, blocked: 34, lastSeen: "Just now", risk: "low", model: "claude-3-sonnet" },
  { id: "agent-b2", name: "Agent-B2", type: "API Gateway Agent", status: "active", requests: 8921, blocked: 12, lastSeen: "2 min ago", risk: "medium", model: "gpt-4o" },
  { id: "agent-c3", name: "Agent-C3", type: "Database Agent", status: "idle", requests: 3201, blocked: 2, lastSeen: "15 min ago", risk: "low", model: "claude-3-haiku" },
  { id: "agent-d4", name: "Agent-D4", type: "Shell Agent", status: "suspended", requests: 551, blocked: 89, lastSeen: "1 hour ago", risk: "high", model: "gpt-4-turbo" },
  { id: "agent-e5", name: "Agent-E5", type: "Web Scraper", status: "active", requests: 44112, blocked: 5, lastSeen: "30 sec ago", risk: "low", model: "claude-3-opus" },
]

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: "Active", color: "text-green-500", icon: CheckCircle2 },
  idle: { label: "Idle", color: "text-yellow-500", icon: AlertCircle },
  suspended: { label: "Suspended", color: "text-red-500", icon: XCircle },
}

const riskVariant: Record<string, "default" | "secondary" | "destructive"> = {
  low: "default",
  medium: "secondary",
  high: "destructive",
}

export default function Agents() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [agentName, setAgentName] = useState("")

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
            <h1 className="text-xl font-semibold">Agents</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="gap-2" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" /> Add Agent
            </Button>
            <ModeToggle />
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Agents", value: agents.length, icon: Bot, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Active", value: agents.filter(a => a.status === "active").length, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
              { label: "Idle", value: agents.filter(a => a.status === "idle").length, icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
              { label: "Suspended", value: agents.filter(a => a.status === "suspended").length, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
            ].map((s, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${s.bg}`}><s.icon className={`h-5 w-5 ${s.color}`} /></div>
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Agent List */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Agents</CardTitle>
              <CardDescription>All AI agents protected by MoltWall</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agents.map((agent, i) => {
                  const sc = statusConfig[agent.status]
                  const StatusIcon = sc.icon
                  return (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{agent.name}</span>
                          <Badge variant="outline" className="text-xs">{agent.type}</Badge>
                          <Badge variant={riskVariant[agent.risk]} className="text-xs">{agent.risk} risk</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Activity className="h-3 w-3" />{agent.requests.toLocaleString()} reqs</span>
                          <span className="flex items-center gap-1"><Shield className="h-3 w-3" />{agent.blocked} blocked</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{agent.lastSeen}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className={`flex items-center gap-1.5 text-sm ${sc.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="hidden sm:inline">{sc.label}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2"><Settings2 className="h-4 w-4" />Configure</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-500"><Trash2 className="h-4 w-4" />Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
            <DialogDescription>Register a new AI agent to protect with MoltWall.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Agent Name</Label>
              <Input placeholder="e.g. My File Agent" value={agentName} onChange={e => setAgentName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Agent Type</Label>
              <Input placeholder="e.g. File System Agent" />
            </div>
            <div className="space-y-2">
              <Label>API Key (auto-generated)</Label>
              <Input value="mw_live_••••••••••••••••" readOnly className="font-mono text-sm" />
            </div>
            <Button className="w-full" onClick={() => setAddOpen(false)}>Register Agent</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
