import { useEffect, useState } from "react"
import { getCursos } from "../services/cursosService"
import { getCategorias } from "../services/categoriasService"
import { getUsuarios } from "../services/usuariosService"

export default function Home() {
  const [totalCursos, setTotalCursos] = useState(0)
  const [totalCategorias, setTotalCategorias] = useState(0)
  const [totalUsuarios, setTotalUsuarios] = useState(0)

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
  }, [])

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Plataforma de Cursos Online</h1>

      <div className="row">

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm text-center p-4">
            <h5>Total de Cursos</h5>
            <h2>{totalCursos}</h2>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm text-center p-4">
            <h5>Total de Categorias</h5>
            <h2>{totalCategorias}</h2>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm text-center p-4">
            <h5>Total de Usuários</h5>
            <h2>{totalUsuarios}</h2>
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
  )
}