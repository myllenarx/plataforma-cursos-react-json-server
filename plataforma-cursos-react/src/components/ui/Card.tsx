import type { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
}

export default function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  return (
    <section
      className={`ui-card ui-card-padding-${padding} ${className}`}
    >
      {children}
    </section>
  )
}