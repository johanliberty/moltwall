import { useState } from "react"
import { Menu, Key, Bell, Shield, Webhook, Trash2, Eye, EyeOff, Copy, Check, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { Sidebar } from "./dashboard"
import { toast } from "sonner"

const apiKeys = [
  { id: "k1", name: "Production", key: "mw_live_sk_••••••••••••••••••••••••", created: "Jan 12, 2026", last: "2 min ago" },
  { id: "k2", name: "Development", key: "mw_test_sk_••••••••••••••••••••••••", created: "Feb 3, 2026", last: "1 day ago" },
]

export default function Settings() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showKey, setShowKey] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [notifications, setNotifications] = useState({ email: true, discord: false, highRisk: true, weeklyReport: true })
  const [security, setSecurity] = useState({ killSwitch: true, injectionDetection: true, ssrfProtection: true, responseScanning: false, piiDetection: false })
  const [sensitivity, setSensitivity] = useState("medium")

  const copy = (id: string) => {
    navigator.clipboard.writeText("mw_live_sk_EXAMPLE_KEY_REPLACE_ME")
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
    toast.success("Copied to clipboard")
  }

  const save = () => toast.success("Settings saved successfully")

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
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={save}>Save Changes</Button>
            <ModeToggle />
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-3xl">
          {/* API Keys */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API keys for SDK integration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiKeys.map(k => (
                <div key={k.id} className="p-4 rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{k.name}</span>
                      <Badge variant="outline" className="text-xs">{k.id === "k1" ? "live" : "test"}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">Last used: {k.last}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-muted px-3 py-2 rounded text-xs font-mono truncate">
                      {showKey === k.id ? "mw_live_sk_EXAMPLE_KEY_REPLACE_ME" : k.key}
                    </code>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowKey(showKey === k.id ? null : k.id)}>
                      {showKey === k.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copy(k.id)}>
                      {copied === k.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><RefreshCw className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Created {k.created}</p>
                </div>
              ))}
              <Button variant="outline" className="gap-2 w-full"><Key className="h-4 w-4" />Generate New API Key</Button>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure core security modules</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "killSwitch", label: "Kill Switch", desc: "Emergency stop — halts all agent tool calls instantly" },
                { key: "injectionDetection", label: "Injection Detection", desc: "Detect and block prompt injection attacks" },
                { key: "ssrfProtection", label: "SSRF / Egress Control", desc: "Block requests to private IPs and internal endpoints" },
                { key: "responseScanning", label: "Response Scanning", desc: "Scan agent responses for secrets and sensitive data" },
                { key: "piiDetection", label: "PII Detection", desc: "Detect and redact personally identifiable information" },
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-sm">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <Switch
                    checked={security[s.key as keyof typeof security]}
                    onCheckedChange={v => setSecurity(sec => ({ ...sec, [s.key]: v }))}
                  />
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Injection Sensitivity</p>
                  <p className="text-xs text-muted-foreground">Higher = more aggressive detection</p>
                </div>
                <Select value={sensitivity} onValueChange={setSensitivity}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "email", label: "Email Alerts", desc: "Get notified via email on security events" },
                { key: "discord", label: "Discord Webhook", desc: "Send alerts to your Discord server" },
                { key: "highRisk", label: "High Risk Events Only", desc: "Only notify on risk score > 70" },
                { key: "weeklyReport", label: "Weekly Report", desc: "Receive a weekly security summary" },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-sm">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[n.key as keyof typeof notifications]}
                    onCheckedChange={v => setNotifications(prev => ({ ...prev, [n.key]: v }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Webhook */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Webhook className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Webhook</CardTitle>
                  <CardDescription>Receive real-time events via webhook</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input placeholder="https://your-server.com/webhook/moltwall" />
              </div>
              <div className="space-y-2">
                <Label>Secret (HMAC signing)</Label>
                <Input placeholder="whsec_••••••••••••••••" type="password" />
              </div>
              <Button variant="outline" size="sm">Test Webhook</Button>
            </CardContent>
          </Card>

          {/* Danger */}
          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions — proceed with caution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <p className="font-medium text-sm">Clear All Logs</p>
                  <p className="text-xs text-muted-foreground">Permanently delete all audit logs</p>
                </div>
                <Button variant="destructive" size="sm">Clear Logs</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <p className="font-medium text-sm">Reset All Rules</p>
                  <p className="text-xs text-muted-foreground">Restore default security ruleset</p>
                </div>
                <Button variant="destructive" size="sm">Reset Rules</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
