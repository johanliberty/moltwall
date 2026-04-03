import { motion } from "framer-motion"
import { Code, Shield, Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

const codeExamples = {
  python: `from moltwall import MoltWallClient

client = MoltWallClient(api_key="your-api-key")

result = client.check(
    agent_id="agent-123",
    tool="file.write",
    params={"path": "/tmp/test.txt", "content": "Hello"}
)

print(result.decision)`,
  typescript: `import { MoltWallClient } from '@moltwall/sdk';

const client = new MoltWallClient({ apiKey: 'your-api-key' });

const result = await client.check({
  agentId: 'agent-123',
  tool: 'file.write',
  params: { path: '/tmp/test.txt', content: 'Hello' }
});

console.log(result.decision);`,
}

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Docs() {
  const [copiedLang, setCopiedLang] = useState<string | null>(null)

  const copyCode = (lang: string) => {
    navigator.clipboard.writeText(codeExamples[lang as keyof typeof codeExamples])
    setCopiedLang(lang)
    setTimeout(() => setCopiedLang(null), 2000)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-8">
          <motion.div variants={itemVariants} className="space-y-4 pt-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold">MoltWall Documentation</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Welcome to the MoltWall documentation. Learn how to secure your AI agents with our production-grade firewall.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary"><Code className="h-3 w-3 mr-1" />REST API</Badge>
              <Badge variant="secondary">Python</Badge>
              <Badge variant="secondary">TypeScript</Badge>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold">Quick Start</h2>
            <p className="text-muted-foreground">Get started with MoltWall in minutes:</p>
            <div className="grid gap-6">
              {[{ lang: "python", label: "Python" }, { lang: "typescript", label: "TypeScript" }].map(({ lang, label }) => (
                <Card key={lang}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{label}</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => copyCode(lang)}>
                        {copiedLang === lang ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{codeExamples[lang as keyof typeof codeExamples]}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[{ step: 1, title: "Intercept", desc: "Agent makes a tool call" }, { step: 2, title: "Analyze", desc: "MoltWall evaluates the request" }, { step: 3, title: "Decide", desc: "Apply security policies" }, { step: 4, title: "Execute", desc: "Allow, deny, or sandbox" }].map((item) => (
                <Card key={item.step} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 font-bold">{item.step}</div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold">Security Policies</h2>
            <p className="text-muted-foreground">MoltWall supports four types of security decisions:</p>
            <div className="grid gap-4">
              {[{ decision: "Allow", desc: "Permit the tool call to execute normally", color: "bg-green-500/10 text-green-500" }, { decision: "Deny", desc: "Block the tool call and return an error", color: "bg-red-500/10 text-red-500" }, { decision: "Sandbox", desc: "Execute in an isolated environment", color: "bg-yellow-500/10 text-yellow-500" }, { decision: "Require Confirmation", desc: "Ask for user approval before executing", color: "bg-blue-500/10 text-blue-500" }].map((item) => (
                <div key={item.decision} className="flex items-center gap-4 p-4 rounded-lg border">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${item.color}`}>{item.decision}</div>
                  <span className="text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold">API Reference</h2>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500">POST</Badge>
                  <code className="text-sm">/api/v1/check</code>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Request Body</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`{
  "agent_id": "string",
  "tool": "string",
  "params": object
}`}</code>
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Response</h4>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`{
  "decision": "allow" | "deny" | "sandbox" | "require_confirmation",
  "risk_score": number,
  "reason": "string"
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
