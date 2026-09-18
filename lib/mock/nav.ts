import type { Persona } from "./types"

export type NavIconKey =
  | "home"
  | "briefcase"
  | "file-check"
  | "alert"
  | "wallet"
  | "users"
  | "file-pen"
  | "clipboard"
  | "settings2"
  | "settings"
  | "help"
  | "sparkle"
  | "check-check"
  | "list"
  | "clock"
  | "history"
  | "user"
  | "receipt"
  | "x-circle"
  | "building"
  | "map-pin"
  | "key"
  | "user-cog"

export interface NavSubItem {
  label: string
  href: string
  description?: string
  icon?: NavIconKey
}

export interface NavItem {
  label: string
  shortLabel?: string
  href: string
  icon: NavIconKey
  badge?: number
  roles?: Persona[]
  subItems?: NavSubItem[]
}

export const primaryNav: NavItem[] = [
  {
    label: "Home",
    shortLabel: "My Dashboard",
    href: "/",
    icon: "home",
    subItems: [
      { label: "Overview", href: "/", description: "KPIs, filings and rejection trends", icon: "list" },
      { label: "Deadline board", href: "/#deadlines", description: "Statutory clocks sorted by urgency", icon: "clock" },
      { label: "Recent activity", href: "/#activity", description: "Latest actions across clients and ports", icon: "history" },
    ],
  },
  {
    label: "Jobs & Declarations",
    shortLabel: "Jobs",
    href: "/jobs",
    icon: "briefcase",
    subItems: [
      { label: "All jobs", href: "/jobs", description: "Every BE and SB in the filing workbench", icon: "list" },
      { label: "My jobs", href: "/jobs?scope=mine", description: "Jobs assigned to you", icon: "user" },
      { label: "Approvals", href: "/jobs?filter=approvals", description: "Awaiting licence holder sign-off", icon: "check-check" },
    ],
  },
  {
    label: "Approvals",
    shortLabel: "Approvals",
    href: "/jobs?filter=approvals",
    icon: "check-check",
    roles: ["Licence Holder"],
  },
  {
    label: "e-Sanchit Documents",
    shortLabel: "Documents",
    href: "/documents",
    icon: "file-check",
    subItems: [
      { label: "All documents", href: "/documents", description: "Full classification and upload pipeline", icon: "list" },
      { label: "Queued for AI", href: "/documents?stage=queued", description: "Awaiting classification", icon: "sparkle" },
      { label: "Failed / rework", href: "/documents?stage=failed", description: "Needs manual attention", icon: "alert" },
    ],
  },
  {
    label: "Query & Deadline Desk",
    shortLabel: "Queries",
    href: "/queries",
    icon: "alert",
    badge: 3,
    subItems: [
      { label: "Officer queries", href: "/queries", description: "Open queries across every job", icon: "alert" },
      { label: "Deadline board", href: "/queries#deadline-board", description: "Statutory + SLA clocks", icon: "clock" },
    ],
  },
  {
    label: "Duty & Ledger",
    shortLabel: "Duty",
    href: "/duty",
    icon: "wallet",
    subItems: [
      { label: "Ledger", href: "/duty", description: "Estimated vs assessed duty by job", icon: "wallet" },
      { label: "Overdue payments", href: "/duty?status=Overdue", description: "Requires immediate payment", icon: "alert" },
    ],
  },
  {
    label: "Client Portal",
    shortLabel: "Portal",
    href: "/portal",
    icon: "users",
    roles: ["Firm Admin", "Licence Holder", "Documentation Specialist", "Compliance Officer", "Trade Finance Manager"],
    subItems: [
      { label: "Overview", href: "/portal", description: "Client snapshot and pending approvals", icon: "users" },
      { label: "Invoices", href: "/portal?tab=invoices", description: "Broker fees and duty invoices", icon: "receipt" },
      { label: "Documents", href: "/portal?tab=documents", description: "Shared filing documents", icon: "file-check" },
    ],
  },
  {
    label: "Amendments",
    shortLabel: "Amendments",
    href: "/amendments",
    icon: "file-pen",
    subItems: [
      { label: "All requests", href: "/amendments", description: "Amendments and cancellations", icon: "list" },
      { label: "Amendments", href: "/amendments?kind=Amendment", description: "Field-level change requests", icon: "file-pen" },
      { label: "Cancellations", href: "/amendments?kind=Cancellation", description: "IRN release tracking", icon: "x-circle" },
    ],
  },
  {
    label: "Audit & Reports",
    shortLabel: "Reports",
    href: "/audit",
    icon: "clipboard",
    subItems: [
      { label: "Reports", href: "/audit", description: "Compliance analytics and trends", icon: "clipboard" },
      { label: "Audit trail", href: "/audit?tab=trail", description: "Tamper-evident action log", icon: "history" },
    ],
  },
  {
    label: "Firm Admin",
    shortLabel: "Admin",
    href: "/admin",
    icon: "settings2",
    subItems: [
      { label: "Tenant profile", href: "/admin?section=tenant", icon: "building" },
      { label: "Ports & registrations", href: "/admin?section=ports", icon: "map-pin" },
      { label: "DSC / signatory registry", href: "/admin?section=dsc", icon: "key" },
      { label: "Channels & credentials", href: "/admin?section=channels", icon: "settings" },
      { label: "Clients & KYC", href: "/admin?section=clients", icon: "users" },
      { label: "Users & roles", href: "/admin?section=users", icon: "user-cog" },
    ],
  },
]

export const secondaryNav: NavItem[] = [{ label: "Help", shortLabel: "Help", href: "#", icon: "help" }]

export const personaLanding: Record<Persona, string> = {
  "Documentation Specialist": "/jobs",
  "Licence Holder": "/jobs?filter=approvals",
  "Compliance Officer": "/queries",
  "Trade Finance Manager": "/duty",
  "Firm Admin": "/admin",
  "Client Approver": "/portal",
}

export const mobileTabs: NavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Jobs", href: "/jobs", icon: "briefcase" },
  { label: "Deadlines", href: "/queries", icon: "alert", badge: 3 },
  { label: "Duty", href: "/duty", icon: "wallet" },
]
