import { Github, Twitter, MessageCircle, Mail } from "lucide-react"
import { Link } from "react-router-dom"

const footerLinks = {
  Product: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }, { label: "Changelog", href: "#changelog" }, { label: "Roadmap", href: "#roadmap" }],
  Developers: [{ label: "Documentation", href: "/docs" }, { label: "API Reference", href: "/docs" }, { label: "SDKs", href: "/docs" }, { label: "GitHub", href: "https://github.com/moltwall" }],
  Company: [{ label: "About", href: "#about" }, { label: "Blog", href: "#blog" }, { label: "Careers", href: "#careers" }, { label: "Contact", href: "#contact" }],
  Legal: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: "Security", href: "/security" }],
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="MoltWall" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-bold text-xl">MoltWall</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Production-grade security firewall for AI agents.
            </p>
            <div className="flex gap-3">
              {[{icon: Github, href: "https://github.com/moltwall"}, {icon: Twitter, href: "https://x.com/moltwallfun?s=21"}, {icon: MessageCircle, href: "https://discord.gg/moltwall"}, {icon: Mail, href: "mailto:hello@moltwall.xyz"}].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors">
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MoltWall. All rights reserved.</p>
          <span className="text-sm text-muted-foreground">Made with ❤️ for the AI community</span>
        </div>
      </div>
    </footer>
  )
}
