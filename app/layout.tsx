import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Noto_Sans } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { MockProvider } from '@/lib/mock/providers'
import { BreadcrumbProvider } from '@/lib/mock/breadcrumb-context'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })
// Self-hosted fallback with full currency-symbol coverage (e.g. the Indian Rupee sign, U+20B9),
// which the Inter/JetBrains Mono "latin" subsets omit.
const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-noto-sans' })

export const metadata: Metadata = {
  title: 'VoltusFreight — ICEGATE Suite',
  description:
    'Customs declaration filing, e-Sanchit document management, query desk, duty ledger, and compliance operations for customs brokers and importer/exporters filing to ICEGATE/ICES.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F6F8' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1220' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${notoSans.variable} bg-background`}
    >
      <body className="antialiased">
        <MockProvider>
          <BreadcrumbProvider>
            <TooltipProvider delayDuration={200}>
              {children}
              <Toaster position="top-right" />
            </TooltipProvider>
          </BreadcrumbProvider>
        </MockProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
