import type { ReactNode } from "react"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: string
  action?: ReactNode
}

export default function EmptyState({
  title,
  description,
  icon = "bi-inbox",
  action,
}: EmptyStateProps) {
  return (
    <div className="ui-empty-state">
      <div className="ui-empty-icon">
        <i className={`bi ${icon}`} />
      </div>

      <h3>{title}</h3>

      {description && (
        <p>{description}</p>
      )}

      {action && (
        <div className="ui-empty-action">
          {action}
        </div>
      )}
    </div>
  )
}