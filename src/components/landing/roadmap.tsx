import { motion } from "framer-motion"
import { Check, Circle, Rocket, Zap } from "lucide-react"

// Updated: Q2 2026 — $MOLTWALL token launch sedang berlangsung
const phases = [
  {
    quarter: "Q3 2025",
    title: "Foundation",
    status: "completed",
    items: [
      "Core firewall engine",
      "Basic policy system",
      "Python SDK",
      "Documentation",
    ],
  },
  {
    quarter: "Q4 2025",
    title: "Expansion",
    status: "completed",
    items: [
      "TypeScript SDK",
      "Go SDK",
      "Dashboard v1",
      "Real-time logs (Convex)",
    ],
  },
  {
    quarter: "Q1 2026",
    title: "Enterprise Ready",
    status: "completed",
    items: [
      "Multi-tenant support",
      "Advanced analytics",
      "SSO integration",
      "SLA guarantees",
    ],
  },
  {
    quarter: "Q2 2026",
    title: "Token Launch",
    status: "in-progress",
    items: [
      "$MOLTWALL token launch on Base",
      "Staking rewards live",
      "DAO governance bootstrap",
      "AI agent policy marketplace",
    ],
  },
  {
    quarter: "Q3–Q4 2026",
    title: "Decentralization",
    status: "upcoming",
    items: [
      "Validator network",
      "On-chain rule registry",
      "Cross-chain support",
      "Enterprise marketplace",
    ],
  },
  {
    quarter: "2027+",
    title: "The Future",
    status: "upcoming",
    items: [
      "AI-powered threat detection",
      "MoltWall Protocol v2",
      "Global expansion",
      "Agentic security standard",
    ],
  },
]

const statusConfig = {
  completed: {
    badge: "bg-green-500/10 text-green-500",
    dot: "bg-green-500",
    icon: Check,
    pulse: false,
  },
  "in-progress": {
    badge: "bg-primary/10 text-primary",
    dot: "bg-primary",
    icon: Rocket,
    pulse: true,
  },
  upcoming: {
    badge: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/30",
    icon: Circle,
    pulse: false,
  },
}

export function Roadmap() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">$MOLTWALL Token Launch — Live Q2 2026</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Roadmap
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Building the future of AI agent security, one milestone at a time.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

            {phases.map((phase, index) => {
              const cfg = statusConfig[phase.status as keyof typeof statusConfig]
              const Icon = cfg.icon

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-start gap-8 mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full border-2 border-background md:-translate-x-2 z-10">
                    <div
                      className={`w-full h-full rounded-full ${cfg.dot} flex items-center justify-center ${
                        cfg.pulse ? "animate-pulse" : ""
                      }`}
                    >
                      <Icon className="h-2.5 w-2.5 text-white" />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={`ml-20 md:ml-0 md:w-[calc(50%-2rem)] ${
                      index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3 ${cfg.badge}`}
                    >
                      <Icon className="h-3 w-3" />
                      {phase.quarter}
                      {phase.status === "in-progress" && (
                        <span className="ml-1 text-xs font-semibold uppercase tracking-wider opacity-80">
                          NOW
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{phase.title}</h3>
                    <ul className="space-y-2">
                      {phase.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className={`flex items-center gap-2 text-muted-foreground ${
                            index % 2 === 0 ? "md:flex-row-reverse" : ""
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
