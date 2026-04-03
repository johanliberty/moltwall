import { motion } from "framer-motion"
import { Shield, Zap, Lock, Eye, Code, Globe, Cpu, Fingerprint } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  { icon: Shield, title: "Real-time Threat Detection", description: "Every tool call is evaluated in real-time using advanced heuristics and ML models." },
  { icon: Zap, title: "Sub-10ms Latency", description: "Lightning-fast security decisions with our optimized engine." },
  { icon: Lock, title: "Policy Enforcement", description: "Define granular security policies with allow, deny, sandbox, and require_confirmation actions." },
  { icon: Eye, title: "Complete Audit Trail", description: "Every decision is logged with full context. Track what your AI agents are doing." },
  { icon: Code, title: "Developer First", description: "Simple SDKs for Python, TypeScript, and Go. Integrate in minutes." },
  { icon: Globe, title: "Multi-tenant Architecture", description: "Built for scale with multi-tenant support. Perfect for SaaS platforms." },
  { icon: Cpu, title: "AI Agent Native", description: "Designed specifically for AI agents and LLM applications." },
  { icon: Fingerprint, title: "Source Provenance", description: "Verify the origin of every tool call with cryptographic signatures." },
]

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built for <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Security</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade protection designed specifically for AI agents.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
