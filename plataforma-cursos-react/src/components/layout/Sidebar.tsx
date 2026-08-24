import { NavLink } from "react-router-dom"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  label: string
  path: string
  icon: string
}

const mainItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "bi-grid-1x2",
  },
]

const learningItems: MenuItem[] = [
  {
    label: "Cursos",
    path: "/cursos",
    icon: "bi-book",
  },
  {
    label: "Trilhas",
    path: "/trilhas",
    icon: "bi-signpost-2",
  },
  {
    label: "Categorias",
    path: "/categorias",
    icon: "bi-collection",
  },
]

const userItems: MenuItem[] = [
  {
    label: "Matrículas",
    path: "/matriculas",
    icon: "bi-person-check",
  },
  {
    label: "Certificados",
    path: "/certificados",
    icon: "bi-award",
  },
]

const administrationItems: MenuItem[] = [
  {
    label: "Usuários",
    path: "/usuarios",
    icon: "bi-people",
  },
]

function MenuSection({
  title,
  items,
  onClose,
}: {
  title: string
  items: MenuItem[]
  onClose: () => void
}) {
  return (
    <div className="sidebar-section">
      <span className="sidebar-section-title">{title}</span>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <i className={`bi ${item.icon}`} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <NavLink
          to="/dashboard"
          className="sidebar-brand"
          onClick={onClose}
        >
          <span className="brand-mark">
            <i className="bi bi-mortarboard-fill" />
          </span>

          <span className="brand-text">
            <strong>Academia</strong>
            <small>Plataforma de Cursos</small>
          </span>
        </NavLink>

        <button
          type="button"
          className="sidebar-close"
          aria-label="Fechar menu"
          onClick={onClose}
        >
          <i className="bi bi-x-lg" />
        </button>
      </div>

      <div className="sidebar-content">
        <MenuSection
          title="Principal"
          items={mainItems}
          onClose={onClose}
        />

        <MenuSection
          title="Aprendizado"
          items={learningItems}
          onClose={onClose}
        />

        <MenuSection
          title="Minha área"
          items={userItems}
          onClose={onClose}
        />

        <MenuSection
          title="Administração"
          items={administrationItems}
          onClose={onClose}
        />
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            M
          </div>

          <div className="user-info">
            <strong>Myllena</strong>
            <span>Administradora</span>
          </div>

          <button
            type="button"
            className="user-menu-button"
            aria-label="Opções do usuário"
          >
            <i className="bi bi-three-dots-vertical" />
          </button>
        </div>
      </div>
    </aside>
  )
}