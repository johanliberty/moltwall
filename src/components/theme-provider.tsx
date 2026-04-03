import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Safe localStorage (Kimi preview / sandboxed iframe bisa throw SecurityError)
function safeGetStorage(key: string): string | null {
  try { return localStorage.getItem(key) } catch { return null }
}
function safeSetStorage(key: string, value: string): void {
  try { localStorage.setItem(key, value) } catch { /* ignore */ }
}

function applyTheme(theme: Theme) {
  const root = window.document.documentElement
  root.classList.remove("light", "dark")
  if (theme === "system") {
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    root.classList.add(sys)
  } else {
    root.classList.add(theme)
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "moltwall-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = safeGetStorage(storageKey) as Theme | null
    return stored || defaultTheme
  })

  // Apply on mount + whenever theme changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    safeSetStorage(storageKey, newTheme)
    applyTheme(newTheme)   // immediate — don't wait for next render cycle
    setThemeState(newTheme)
  }

  return (
    <ThemeProviderContext.Provider {...props} value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
