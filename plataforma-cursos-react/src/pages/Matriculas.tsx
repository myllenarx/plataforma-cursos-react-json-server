import { useEffect, useState } from "react"

import { getUsuarios } from "../services/usuariosService"
import { getCursos } from "../services/cursosService"

import {
  getMatriculas,
  createMatricula,
  deleteMatricula
} from "../services/matriculasService"

export default function Matriculas() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [cursos, setCursos] = useState<any[]>([])
  const [matriculas, setMatriculas] = useState<any[]>([])

  const [idUsuario, setIdUsuario] = useState(0)
  const [idCurso, setIdCurso] = useState(0)

  function carregarDados() {
    getUsuarios().then((res) => setUsuarios(res.data))
    getCursos().then((res) => setCursos(res.data))
    getMatriculas().then((res) => setMatriculas(res.data))
  }

  useEffect(() => {
    carregarDados()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    createMatricula({
      idUsuario,
      idCurso,
      dataMatricula: new Date().toLocaleDateString()
    }).then(() => {
      carregarDados()
    })
  }

  function handleDelete(id: number) {
    deleteMatricula(id).then(() => {
      carregarDados()
    })
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        Matrículas
      </h2>

      <div className="card p-3 mb-4">
        <h5>Nova Matrícula</h5>

        <form onSubmit={handleSubmit}>

          <select
            className="form-control mb-2"
            value={idUsuario}
            onChange={(e) =>
              setIdUsuario(Number(e.target.value))
            }
          >
            <option value="">
              Selecione um usuário
            </option>

            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </select>

          <select
            className="form-control mb-2"
            value={idCurso}
            onChange={(e) =>
              setIdCurso(Number(e.target.value))
            }
          >
            <option value="">
              Selecione um curso
            </option>

            {cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>

          <button className="btn btn-rose">
            Matricular
          </button>

        </form>
      </div>

      <div className="row">

        {matriculas.map((mat) => (
          <div
            className="col-md-4 mb-3"
            key={mat.id}
          >
            <div className="card p-4 curso-card">

              <h5>
                {
                  usuarios.find(
                    (u) => u.id === mat.idUsuario
                  )?.nome
                }
              </h5>

              <p>
                Curso:
                {" "}
                {
                  cursos.find(
                    (c) => c.id === mat.idCurso
                  )?.nome
                }
              </p>

              <p>
                {mat.dataMatricula}
              </p>

              <button
                className="btn btn-dark-custom btn-sm"
                onClick={() =>
                  handleDelete(mat.id)
                }
              >
                Cancelar
              </button>

            </div>
          </div>
        ))}

      </div>

    </div>
  )
}