import { useEffect, useState } from "react"
import { getCursos } from "../services/cursosService"
import { getCategorias } from "../services/categoriasService"
import { getUsuarios } from "../services/usuariosService"
import { getMatriculas } from "../services/matriculasService"

export default function Home() {
  const [totalCursos, setTotalCursos] = useState(0)
  const [totalCategorias, setTotalCategorias] = useState(0)
  const [totalUsuarios, setTotalUsuarios] = useState(0)
  const [totalMatriculas, setTotalMatriculas] = useState(0)

  useEffect(() => {
    getCursos().then((res) => {
      setTotalCursos(res.data.length)
    })

    getCategorias().then((res) => {
      setTotalCategorias(res.data.length)
    })

    getUsuarios().then((res) => {
      setTotalUsuarios(res.data.length)
    })

    getMatriculas().then((res) => {
      setTotalMatriculas(res.data.length)
    })
  }, [])

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Plataforma de Cursos Online</h1>

      <div className="row">

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card text-center p-4">
            <i className="bi bi-journal-bookmark dashboard-icon"></i>
            <h5 className="mt-3">Cursos</h5>
            <div className="dashboard-number">
              {totalCursos}
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card text-center p-4">
            <i className="bi bi-grid dashboard-icon"></i>
            <h5 className="mt-3">Categorias</h5>
            <div className="dashboard-number">
              {totalCategorias}
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card text-center p-4">
            <i className="bi bi-people dashboard-icon"></i>
            <h5 className="mt-3">Usuários</h5>
            <div className="dashboard-number">
              {totalUsuarios}
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card dashboard-card text-center p-4">
            <i className="bi bi-person-check dashboard-icon"></i>
            <h5 className="mt-3">Matrículas</h5>
            <div className="dashboard-number">
              {totalMatriculas}
            </div>
          </div>
        </div>

        <div className="card shadow-sm p-4 mt-4">
          <h4>Bem-vinda à Plataforma</h4>

          <p>
            Sistema desenvolvido em React + TypeScript + Bootstrap + JSON Server
            para gerenciamento de cursos online.
          </p>
        </div>

      </div>
    </div>
  )
}