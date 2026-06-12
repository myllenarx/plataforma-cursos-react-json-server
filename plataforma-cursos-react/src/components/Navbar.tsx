import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg px-4 py-3"
      style={{
        backgroundColor: "#1E1E1E",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
      }}
    >
      <Link
        className="navbar-brand fw-bold"
        to="/"
        style={{
          color: "#D8A7B1",
          fontSize: "1.4rem"
        }}
      >
        Plataforma de Cursos
      </Link>

      <div className="navbar-nav ms-auto">

        <Link className="nav-link nav-custom" to="/">
          Home
        </Link>

        <Link className="nav-link nav-custom" to="/cursos">
          Cursos
        </Link>

        <Link className="nav-link nav-custom" to="/categorias">
          Categorias
        </Link>

        <Link className="nav-link nav-custom" to="/usuarios">
          Usuários
        </Link>

        <Link
          className="nav-link nav-custom"
          to="/matriculas"
        >
          Matrículas
        </Link>

        <Link
          className="nav-link nav-custom"
          to="/certificados"
        >
          Certificados
        </Link>

      </div>
    </nav>
  )
}