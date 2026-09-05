import { useEffect, useState } from "react"

import { getUsuarios } from "../services/usuariosService"
import { getCursos } from "../services/cursosService"

import {
  getMatriculas,
  createMatricula,
  deleteMatricula
} from "../services/matriculasService"

type Usuario = {
  id: number | string
  nome: string
}

type Curso = {
  id: number | string
  nome: string
}

type Matricula = {
  id: number
  idUsuario: number | string
  idCurso: number | string
  dataMatricula: string
}

export default function Matriculas() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [matriculas, setMatriculas] = useState<Matricula[]>([])

  const [idUsuario, setIdUsuario] = useState("")
  const [idCurso, setIdCurso] = useState("")

  const [loading, setLoading] = useState(true)

  function carregarDados() {
    setLoading(true)

    Promise.all([
      getUsuarios(),
      getCursos(),
      getMatriculas()
    ])
      .then(([usuariosResponse, cursosResponse, matriculasResponse]) => {
        setUsuarios(usuariosResponse.data)
        setCursos(cursosResponse.data)
        setMatriculas(matriculasResponse.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    carregarDados()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!idUsuario || !idCurso) {
      alert("Selecione um usuário e um curso.")
      return
    }

    createMatricula({
      idUsuario,
      idCurso,
      dataMatricula: new Date().toLocaleDateString("pt-BR")
    }).then(() => {
      setIdUsuario("")
      setIdCurso("")
      carregarDados()
    })
  }

  function handleDelete(id: number) {
    if (!window.confirm("Deseja realmente cancelar esta matrícula?")) {
      return
    }

    deleteMatricula(id).then(() => {
      setMatriculas((matriculasAtuais) =>
        matriculasAtuais.filter((matricula) => matricula.id !== id)
      )
    })
  }

  function buscarUsuario(id: number | string) {
    return (
      usuarios.find(
        (usuario) => String(usuario.id) === String(id)
      )?.nome || "Usuário não encontrado"
    )
  }

  function buscarCurso(id: number | string) {
    return (
      cursos.find(
        (curso) => String(curso.id) === String(id)
      )?.nome || "Curso não encontrado"
    )
  }

  return (
    <div className="container mt-4 crud-page">

      {/* CABEÇALHO */}
      <div className="crud-page-header">
        <h2>Matrículas</h2>
        <p>Gerencie as matrículas dos alunos nos cursos.</p>
      </div>

      {/* LAYOUT PRINCIPAL */}
      <div className="crud-two-column">

        {/* FORMULÁRIO */}
        <div className="card crud-form-card">

          <h5>Nova matrícula</h5>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label text-muted">
                Usuário
              </label>

              <select
                className="form-select"
                value={idUsuario}
                onChange={(e) => setIdUsuario(e.target.value)}
              >
                <option value="">
                  Selecione um usuário
                </option>

                {usuarios.map((usuario) => (
                  <option
                    key={usuario.id}
                    value={usuario.id}
                  >
                    {usuario.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted">
                Curso
              </label>

              <select
                className="form-select"
                value={idCurso}
                onChange={(e) => setIdCurso(e.target.value)}
              >
                <option value="">
                  Selecione um curso
                </option>

                {cursos.map((curso) => (
                  <option
                    key={curso.id}
                    value={curso.id}
                  >
                    {curso.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="crud-form-actions">
              <button
                type="submit"
                className="crud-btn crud-btn-primary"
              >
                <i className="bi bi-plus-lg"></i>
                Cadastrar matrícula
              </button>
            </div>

          </form>

        </div>

        {/* LISTAGEM */}
        <div className="card crud-list-card">

          <div className="crud-list-header">
            <h5>Matrículas cadastradas</h5>
            <small className="text-muted">
              Alunos vinculados aos cursos da plataforma
            </small>
          </div>

          {loading ? (

            <div className="p-4 text-center text-muted">
              Carregando...
            </div>

          ) : matriculas.length === 0 ? (

            <div className="p-4 text-center">
              <i className="bi bi-person-check fs-3 text-muted"></i>

              <p className="mt-2 mb-0">
                Nenhuma matrícula cadastrada.
              </p>
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table crud-table align-middle">

                <thead>
                  <tr>
                    <th className="ps-3">
                      Usuário
                    </th>

                    <th>
                      Curso
                    </th>

                    <th>
                      Data
                    </th>

                    <th className="text-end pe-3">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {matriculas.map((matricula) => (

                    <tr key={matricula.id}>

                      <td className="ps-3">
                        <div className="d-flex align-items-center gap-2">

                          <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              background: "rgba(124, 63, 70, 0.18)",
                              color: "var(--wine-light)"
                            }}
                          >
                            <i className="bi bi-person"></i>
                          </div>

                          <strong>
                            {buscarUsuario(matricula.idUsuario)}
                          </strong>

                        </div>
                      </td>

                      <td>
                        {buscarCurso(matricula.idCurso)}
                      </td>

                      <td>
                        {matricula.dataMatricula}
                      </td>

                      <td className="text-end pe-3">

                        <div className="crud-actions">

                          <button
                            type="button"
                            className="crud-btn crud-btn-delete crud-btn-icon"
                            onClick={() =>
                              handleDelete(matricula.id)
                            }
                            title="Cancelar matrícula"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}