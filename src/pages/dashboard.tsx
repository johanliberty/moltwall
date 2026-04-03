import { useState } from "react"
import { motion } from "framer-motion"
import { Activity, TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle, Shield, LayoutDashboard, Bot, FileText, Settings, Menu, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Bot, label: "Agents", href: "/agents" },
  { icon: Shield, label: "Security Rules", href: "/rules" },
  { icon: FileText, label: "Logs", href: "/logs" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

const stats = [
  { title: "Total Requests", value: "1,234,567", change: "+12.5%", trend: "up", icon: Activity, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { title: "Threats Blocked", value: "8,942", change: "+5.2%", trend: "up", icon: Shield, color: "text-green-500", bgColor: "bg-green-500/10" },
  { title: "Active Agents", value: "24", change: "+3", trend: "up", icon: CheckCircle, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  { title: "Avg Response Time", value: "8.2ms", change: "-1.2ms", trend: "down", icon: Clock, color: "text-orange-500", bgColor: "bg-orange-500/10" },
]

const riskScores = [
  { name: "Overall Risk", score: 12, status: "low" },
  { name: "API Security", score: 8, status: "low" },
  { name: "Data Protection", score: 15, status: "low" },
  { name: "Access Control", score: 22, status: "medium" },
]

const recentActivity = [
  { id: 1, agent: "Agent-A1", action: "Tool call blocked", tool: "file.write", risk: "high", time: "2 min ago" },
  { id: 2, agent: "Agent-B2", action: "Policy enforced", tool: "api.request", risk: "medium", time: "5 min ago" },
  { id: 3, agent: "Agent-C3", action: "Request allowed", tool: "db.query", risk: "low", time: "12 min ago" },
  { id: 4, agent: "Agent-A1", action: "Sandbox execution", tool: "code.exec", risk: "medium", time: "18 min ago" },
]

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const location = useLocation()
  return (
    <aside className={`${mobile ? "w-full" : "w-64 border-r fixed left-0 top-0 bottom-0"} bg-card flex flex-col`}>
      <div className="h-16 flex items-center px-4 border-b justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="MoltWall" className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-bold text-lg">MoltWall</span>
        </Link>
        {mobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
        )}
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {sidebarItems.map((item) => {
          const active = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">MW</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">MoltWall Admin</p>
            <p className="text-xs text-muted-foreground truncate">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false)
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
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <ModeToggle />
        </header>
        <div className="p-6">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                          <div className="flex items-center gap-1 mt-2">
                            {stat.trend === "up" ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-green-500" />}
                            <span className="text-sm text-green-500">{stat.change}</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}><stat.icon className={`h-5 w-5 ${stat.color}`} /></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                    <CardDescription>Current security risk scores by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {riskScores.map((risk, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{risk.name}</span>
                            <Badge variant={risk.status === "low" ? "default" : "secondary"}>{risk.status}</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <Progress value={risk.score} className="flex-1" />
                            <span className="text-sm font-medium w-12 text-right">{risk.score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                    <CardDescription>Today's activity overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[{label: "Allowed", value: "98.2%", icon: CheckCircle, color: "text-green-500"}, {label: "Blocked", value: "1.8%", icon: AlertTriangle, color: "text-red-500"}, {label: "Sandbox", value: "42", icon: Shield, color: "text-yellow-500"}].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <div className="flex items-center gap-3">
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                          <p className="font-medium">{stat.label}</p>
                        </div>
                        <span className="text-xl font-bold">{stat.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest security events and decisions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                        <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary text-sm">{activity.agent.slice(0, 2)}</AvatarFallback></Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{activity.agent}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{activity.action}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{activity.tool}</code>
                            <span className="text-muted-foreground">{activity.time}</span>
                          </div>
                        </div>
                        <Badge variant={activity.risk === "high" ? "destructive" : activity.risk === "medium" ? "secondary" : "default"}>{activity.risk}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
