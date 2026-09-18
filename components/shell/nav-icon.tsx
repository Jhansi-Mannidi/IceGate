import {
  AlertTriangle,
  Briefcase,
  Building2,
  CheckCheck,
  ClipboardList,
  Clock,
  FileCheck2,
  FilePenLine,
  HelpCircle,
  History,
  Home,
  KeyRound,
  List,
  MapPin,
  Receipt,
  Settings,
  Settings2,
  Sparkles,
  User,
  UserCog,
  Users,
  Wallet,
  XCircle,
  type LucideProps,
} from "lucide-react"
import type { NavIconKey } from "@/lib/mock/nav"

const ICONS: Record<NavIconKey, React.ComponentType<LucideProps>> = {
  home: Home,
  briefcase: Briefcase,
  "file-check": FileCheck2,
  alert: AlertTriangle,
  wallet: Wallet,
  users: Users,
  "file-pen": FilePenLine,
  clipboard: ClipboardList,
  settings2: Settings2,
  settings: Settings,
  help: HelpCircle,
  sparkle: Sparkles,
  "check-check": CheckCheck,
  list: List,
  clock: Clock,
  history: History,
  user: User,
  receipt: Receipt,
  "x-circle": XCircle,
  building: Building2,
  "map-pin": MapPin,
  key: KeyRound,
  "user-cog": UserCog,
}

export function NavIcon({ icon, ...props }: { icon: NavIconKey } & LucideProps) {
  const Icon = ICONS[icon]
  return <Icon {...props} />
}
