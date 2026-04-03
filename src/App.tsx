import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import Home from "@/pages/home"
import Dashboard from "@/pages/dashboard"
import Docs from "@/pages/docs"
import Agents from "@/pages/agents"
import Rules from "@/pages/rules"
import Logs from "@/pages/logs"
import Settings from "@/pages/settings"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="moltwall-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
