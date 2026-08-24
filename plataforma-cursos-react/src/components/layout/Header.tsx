import { useLocation } from "react-router-dom"

interface HeaderProps {
  onMenuClick: () => void
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/cursos": "Cursos",
  "/trilhas": "Trilhas",
  "/categorias": "Categorias",
  "/matriculas": "Matrículas",
  "/certificados": "Certificados",
  "/usuarios": "Usuários",
}

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()

  const title =
    pageTitles[location.pathname] ?? "Plataforma de Cursos"

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-button"
          aria-label="Abrir menu"
          onClick={onMenuClick}
        >
          <i className="bi bi-list" />
        </button>

        <div>
          <span className="header-eyebrow">
            Plataforma de Cursos
          </span>

          <h1 className="header-title">
            {title}
          </h1>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="header-icon-button"
          aria-label="Notificações"
        >
          <i className="bi bi-bell" />
        </button>

        <div className="header-user">
          <div className="header-avatar">
            M
          </div>

          <div className="header-user-info">
            <strong>Myllena</strong>
            <span>Administradora</span>
          </div>
        </div>
      </div>
    </header>
  )
}