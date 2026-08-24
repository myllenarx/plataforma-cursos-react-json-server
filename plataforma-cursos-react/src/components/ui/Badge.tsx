import type { ReactNode } from "react"

interface BadgeProps {
  children: ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "wine"
}

export default function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  return (
    <span className={`ui-badge ui-badge-${variant}`}>
      {children}
    </span>
  )
}