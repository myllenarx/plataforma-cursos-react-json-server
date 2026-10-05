import { NavLink, useNavigate } from "react-router-dom"
import {
  getUsuarioLogado,
  logout,
  type PerfilUsuario,
} from "../../services/auth"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  label: string
  path: string
  icon: string
  perfis?: PerfilUsuario[]
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
    perfis: ["ADMIN"],
  },
  {
    label: "Avaliações",
    path: "/avaliacoes",
    icon: "bi-star",
  },
]

const userItems: MenuItem[] = [
  {
    label: "Matrículas",
    path: "/matriculas",
    icon: "bi-person-check",
    perfis: ["ALUNO", "ADMIN"],
  },
  {
    label: "Certificados",
    path: "/certificados",
    icon: "bi-award",
    perfis: ["ALUNO", "ADMIN"],
  },
  {
    label: "Planos e Assinaturas",
    path: "/planos",
    icon: "bi-credit-card",
    perfis: ["ALUNO", "ADMIN"],
  },
]

const administrationItems: MenuItem[] = [
  {
    label: "Usuários",
    path: "/usuarios",
    icon: "bi-people",
    perfis: ["ADMIN"],
  },
]

function filtrarItens(
  items: MenuItem[],
  perfil?: PerfilUsuario,
) {
  return items.filter(
    (item) =>
      !item.perfis ||
      (perfil !== undefined && item.perfis.includes(perfil)),
  )
}

function nomePerfil(perfil?: PerfilUsuario) {
  switch (perfil) {
    case "ADMIN":
      return "Administrador"
    case "PROFESSOR":
      return "Professor"
    case "ALUNO":
      return "Aluno"
    default:
      return "Usuário"
  }
}

function MenuSection({
  title,
  items,
  onClose,
}: {
  title: string
  items: MenuItem[]
  onClose: () => void
}) {
  if (items.length === 0) {
    return null
  }

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
  const usuario = getUsuarioLogado()
  const perfil = usuario?.perfil

  const itensPrincipais = filtrarItens(mainItems, perfil)
  const itensAprendizado = filtrarItens(learningItems, perfil)
  const itensUsuario = filtrarItens(userItems, perfil)
  const itensAdministracao = filtrarItens(
    administrationItems,
    perfil,
  )

  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }
  const inicial =
    usuario?.email?.charAt(0).toUpperCase() ?? "U"

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
          items={itensPrincipais}
          onClose={onClose}
        />

        <MenuSection
          title="Aprendizado"
          items={itensAprendizado}
          onClose={onClose}
        />

        <MenuSection
          title="Minha área"
          items={itensUsuario}
          onClose={onClose}
        />

        <MenuSection
          title="Administração"
          items={itensAdministracao}
          onClose={onClose}
        />
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {inicial}
          </div>

          <div className="user-info">
            <strong>{usuario?.email ?? "Usuário"}</strong>
            <span>{nomePerfil(perfil)}</span>
          </div>

          <button
            type="button"
            className="user-menu-button"
            aria-label="Sair"
            title="Sair"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right" />
          </button>
        </div>
      </div>
    </aside>
  )
}