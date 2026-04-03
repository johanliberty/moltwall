import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Plus, ToggleLeft, ToggleRight, Trash2, GripVertical, ChevronDown, Menu } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sidebar } from "./dashboard"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Rule = {
  id: string
  name: string
  tool: string
  match: string
  action: "allow" | "deny" | "sandbox" | "prompt"
  enabled: boolean
  hits: number
  priority: number
}

const initialRules: Rule[] = [
  { id: "r1", name: "Block SSH Key Access", tool: "*", match: "path: **/.ssh/**", action: "deny", enabled: true, hits: 234, priority: 1 },
  { id: "r2", name: "Block Curl Exfil", tool: "shell_exec|run_command|execute_command", match: "command: *curl *", action: "deny", enabled: true, hits: 89, priority: 2 },
  { id: "r3", name: "Approve Shell Exec", tool: "shell_exec|bash", match: "*", action: "prompt", enabled: true, hits: 1203, priority: 3 },
  { id: "r4", name: "Allow Read File", tool: "read_file|get_file_contents", match: "*", action: "allow", enabled: true, hits: 9821, priority: 4 },
  { id: "r5", name: "Sandbox Code Exec", tool: "code.exec|python.run", match: "*", action: "sandbox", enabled: false, hits: 42, priority: 5 },
  { id: "r6", name: "Block Private IPs", tool: "http.request|api.call", match: "url: *192.168.*", action: "deny", enabled: true, hits: 17, priority: 6 },
]

const actionConfig: Record<string, { label: string; variant: "default" | "destructive" | "secondary" | "outline"; color: string }> = {
  allow: { label: "Allow", variant: "default", color: "text-green-500 bg-green-500/10 border-green-500/20" },
  deny: { label: "Deny", variant: "destructive", color: "text-red-500 bg-red-500/10 border-red-500/20" },
  sandbox: { label: "Sandbox", variant: "secondary", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  prompt: { label: "Prompt", variant: "outline", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
}

export default function Rules() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [rules, setRules] = useState<Rule[]>(initialRules)
  const [addOpen, setAddOpen] = useState(false)
  const [newRule, setNewRule] = useState({ name: "", tool: "", match: "", action: "deny" as Rule["action"] })

  const toggleRule = (id: string) => setRules(r => r.map(rule => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))
  const deleteRule = (id: string) => setRules(r => r.filter(rule => rule.id !== id))

  const addRule = () => {
    if (!newRule.name) return
    const rule: Rule = { id: `r${Date.now()}`, ...newRule, enabled: true, hits: 0, priority: rules.length + 1 }
    setRules(r => [...r, rule])
    setAddOpen(false)
    setNewRule({ name: "", tool: "", match: "", action: "deny" })
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
            <h1 className="text-xl font-semibold">Security Rules</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="gap-2" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" /> Add Rule
            </Button>
            <ModeToggle />
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Rules", value: rules.length },
              { label: "Active", value: rules.filter(r => r.enabled).length },
              { label: "Total Hits", value: rules.reduce((a, r) => a + r.hits, 0).toLocaleString() },
              { label: "Deny Rules", value: rules.filter(r => r.action === "deny").length },
            ].map((s, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Policy Rules</CardTitle>
              <CardDescription>First match wins. Drag to reorder priority.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rules.map((rule, i) => {
                  const ac = actionConfig[rule.action]
                  return (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${rule.enabled ? "bg-card" : "bg-muted/30 opacity-60"}`}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab" />
                      <span className="w-6 text-xs text-muted-foreground font-mono shrink-0">#{rule.priority}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{rule.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ac.color}`}>{ac.label}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <code className="bg-muted px-1.5 py-0.5 rounded">{rule.tool}</code>
                          <span className="hidden sm:inline truncate max-w-[200px]">{rule.match}</span>
                          <span className="text-muted-foreground">{rule.hits.toLocaleString()} hits</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRule(rule.id)}>
                          {rule.enabled ? <ToggleRight className="h-5 w-5 text-primary" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-500" onClick={() => deleteRule(rule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Default action */}
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Default Action</p>
                <p className="text-xs text-muted-foreground">Applied when no rule matches</p>
              </div>
              <Select defaultValue="prompt">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="deny">Deny</SelectItem>
                  <SelectItem value="prompt">Prompt</SelectItem>
                  <SelectItem value="sandbox">Sandbox</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Security Rule</DialogTitle>
            <DialogDescription>Define a new policy rule. First match wins.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Rule Name</Label>
              <Input placeholder="e.g. Block SSH Key Access" value={newRule.name} onChange={e => setNewRule(r => ({ ...r, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Tool Pattern</Label>
              <Input placeholder="e.g. file.write or * for all" value={newRule.tool} onChange={e => setNewRule(r => ({ ...r, tool: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Match Condition</Label>
              <Input placeholder="e.g. path: **/.ssh/**" value={newRule.match} onChange={e => setNewRule(r => ({ ...r, match: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={newRule.action} onValueChange={v => setNewRule(r => ({ ...r, action: v as Rule["action"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="deny">Deny</SelectItem>
                  <SelectItem value="sandbox">Sandbox</SelectItem>
                  <SelectItem value="prompt">Require Confirmation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={addRule}>Add Rule</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
