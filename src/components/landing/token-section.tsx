import { motion } from "framer-motion"
import { Coins, ExternalLink, Copy, Check, TrendingUp, Users, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

// Dummy CA on Base — update when live
const TOKEN_ADDRESS = "0x06e70fB88Ca11002aea04dC6ADCD2320df124d13"
const BASESCAN_URL = `https://basescan.org/token/${TOKEN_ADDRESS}`
const DEXSCREENER_URL = "https://flaunch.gg/base/coins/0x06e70fB88Ca11002aea04dC6ADCD2320df124d13"

const distribution = [
  { label: "Community & Rewards", pct: 40, color: "bg-primary" },
  { label: "Ecosystem Fund", pct: 25, color: "bg-blue-500" },
  { label: "Team (2yr vesting)", pct: 20, color: "bg-purple-500" },
  { label: "Liquidity", pct: 15, color: "bg-orange-500" },
]

export function TokenSection() {
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(TOKEN_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Coins className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Token on Base</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Powered by <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">$MOLTWALL</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Native token of the MoltWall ecosystem — deployed on Base for fast, cheap, secure transactions.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="gap-1.5 text-blue-400 border-blue-400/30 bg-blue-400/5">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              Base Network
            </Badge>
            <Badge variant="outline" className="gap-1.5 text-orange-400 border-orange-400/30 bg-orange-400/5">
              <Flame className="h-3 w-3" /> Coming Soon
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Token Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Token Info</CardTitle>
                <CardDescription>Key information about $MOLTWALL</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Token Name", value: "MoltWall Token" },
                  { label: "Symbol", value: "$MOLTWALL" },
                  { label: "Network", value: "Base (L2)" },
                  { label: "Standard", value: "ERC-20" },
                  { label: "Total Supply", value: "100000,000,000" },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-muted-foreground text-sm">{row.label}</span>
                    <span className="font-medium text-sm">{row.value}</span>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <span className="text-muted-foreground text-sm">Contract Address (Base)</span>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 bg-muted px-3 py-2 rounded text-xs font-mono truncate">{TOKEN_ADDRESS}</code>
                    <Button variant="outline" size="icon" onClick={copyAddress} className="shrink-0">
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <a
                    href={BASESCAN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
                  >
                    View on Basescan <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tokenomics */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Tokenomics</CardTitle>
                <CardDescription>Token distribution breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {distribution.map((d, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{d.label}</span>
                      <span className="font-medium">{d.pct}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className={`${d.color} h-2 rounded-full`} style={{ width: `${d.pct}%` }} />
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t space-y-2">
                  {[
                    { label: "Market Cap", value: "17k" },
                    { label: "Launch Price", value: "TBA" },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-medium">{row.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Card className="h-full bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle>Get $MOLTWALL</CardTitle>
                <CardDescription>Join the MoltWall ecosystem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {[
                    { icon: TrendingUp, text: "Stake to earn protocol revenue" },
                    { icon: Users, text: "Participate in DAO governance" },
                    { icon: Flame, text: "Token burns on every transaction" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <a href={DEXSCREENER_URL} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full gap-2" size="lg">
                      Buy on Base <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                  <a href={BASESCAN_URL} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full" size="lg">
                      View on Basescan
                    </Button>
                  </a>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
