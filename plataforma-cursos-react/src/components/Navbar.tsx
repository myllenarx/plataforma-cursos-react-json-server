import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Plataforma de Cursos
        </Link>

        <div className="navbar-nav">
          <Link className="nav-link" to="/cursos">
            Cursos
          </Link>

          <Link className="nav-link" to="/">
            Home
          </Link>
        </div>
      </div>
    </nav>
  )
}