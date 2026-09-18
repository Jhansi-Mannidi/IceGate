"use client"

import { Laptop, Moon, Smartphone, Sun, Tablet } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMock } from "@/lib/mock/providers"
import type { Persona } from "@/lib/mock/types"
import { personaLanding } from "@/lib/mock/nav"
import { useRouter } from "next/navigation"

const PERSONAS: Persona[] = [
  "Documentation Specialist",
  "Licence Holder",
  "Compliance Officer",
  "Trade Finance Manager",
  "Firm Admin",
  "Client Approver",
]

const DEVICES = [
  { key: "desktop" as const, icon: Laptop, label: "Desktop" },
  { key: "tablet" as const, icon: Tablet, label: "Tablet" },
  { key: "mobile" as const, icon: Smartphone, label: "Mobile" },
]

export function MockControlBar() {
  const { theme, setTheme, device, setDevice, persona, setPersona } = useMock()
  const router = useRouter()

  function handlePersonaChange(next: Persona) {
    setPersona(next)
    if (next === "Client Approver") {
      router.push("/portal")
    } else {
      router.push(personaLanding[next])
    }
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-10 items-center gap-3 border-b border-border-strong bg-brand-navy px-3 text-xs text-white dark:bg-black">
      <span className="hidden shrink-0 font-semibold tracking-wide text-white/70 sm:inline">
        MOCK CONTROLS
      </span>

      <div className="flex items-center gap-0.5 rounded-md bg-white/10 p-0.5">
        {DEVICES.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setDevice(key)}
            title={label}
            className={cn(
              "flex items-center gap-1.5 rounded-[5px] px-2 py-1 text-white/70 transition-colors hover:text-white",
              device === key && "bg-white/20 text-white",
            )}
          >
            <Icon className="size-3.5" />
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1 text-white/70 hover:text-white"
      >
        {theme === "dark" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
        <span className="hidden md:inline">{theme === "dark" ? "Dark" : "Light"}</span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-white/60 sm:inline">Viewing as</span>
        <select
          value={persona}
          onChange={(e) => handlePersonaChange(e.target.value as Persona)}
          className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-white outline-none"
        >
          {PERSONAS.map((p) => (
            <option key={p} value={p} className="text-foreground">
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
