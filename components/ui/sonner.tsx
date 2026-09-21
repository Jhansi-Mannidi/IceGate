"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg": "var(--status-success-bg)",
          "--success-text": "var(--status-success)",
          "--success-border": "color-mix(in srgb, var(--status-success) 35%, transparent)",
          "--error-bg": "var(--status-danger-bg)",
          "--error-text": "var(--status-danger)",
          "--error-border": "color-mix(in srgb, var(--status-danger) 35%, transparent)",
          "--warning-bg": "var(--status-warning-bg)",
          "--warning-text": "var(--status-warning)",
          "--warning-border": "color-mix(in srgb, var(--status-warning) 35%, transparent)",
          "--info-bg": "var(--status-info-ai-bg)",
          "--info-text": "var(--status-info-ai)",
          "--info-border": "color-mix(in srgb, var(--status-info-ai) 35%, transparent)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
