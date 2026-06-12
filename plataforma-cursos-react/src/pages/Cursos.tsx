import { useEffect, useState } from "react"
import { getCategorias } from "../services/categoriasService"

import {
  getCursos,
  createCurso,
  updateCurso,
  deleteCurso
} from "../services/cursosService"

type Curso = {
  id: number
  nome: string
  idCategoria: number
}

type Categoria = {
  id: number
  nome: string
}

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  // CREATE
  const [nome, setNome] = useState("")
  const [idCategoria, setIdCategoria] = useState<number>(0)

  // EDIT
  const [editando, setEditando] = useState<number | null>(null)
  const [editNome, setEditNome] = useState("")
  const [editCategoria, setEditCategoria] = useState<number>(0)

  function carregarCursos() {
    setLoading(true)

    getCursos()
      .then((res) => setCursos(res.data))
      .finally(() => setLoading(false))
  }

  function carregarCategorias() {
    getCategorias().then((res) => setCategorias(res.data))
  }

  useEffect(() => {
    carregarCursos()
    carregarCategorias()
  }, [])

  // CREATE
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    createCurso({
      nome,
      idCategoria
    }).then(() => {
      setNome("")
      setIdCategoria(0)
      carregarCursos()
    })
  }

  // DELETE
  function handleDelete(id: number) {
    deleteCurso(id).then(() => {
      setCursos(cursos.filter((c) => c.id !== id))
    })
  }

  // UPDATE
  function handleUpdate(id: number) {
    updateCurso(id, {
      nome: editNome,
      idCategoria: editCategoria
    }).then(() => {
      setEditando(null)
      carregarCursos()
    })
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Cursos</h2>

      {/* FORMULÁRIO CREATE */}
      <div className="card p-3 mb-4">
        <h5>Cadastrar Curso</h5>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            placeholder="Nome do curso"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <select
            className="form-control mb-2"
            value={idCategoria}
            onChange={(e) => setIdCategoria(Number(e.target.value))}
          >
            <option value={0}>Selecione uma categoria</option>

            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>

          <button className="btn btn-rose">
            Salvar
          </button>
        </form>
      </div>

      {/* LOADING */}
      {loading && <div>Carregando...</div>}

      {/* LISTA */}
      <div className="row">
        {cursos.map((curso) => (
          <div className="col-md-4 mb-3" key={curso.id}>
            <div className="card shadow-sm p-3">

              {/* EDIT MODE */}
              {editando === curso.id ? (
                <>
                  <input
                    className="form-control mb-2"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                  />

                  <select
                    className="form-control mb-2"
                    value={editCategoria}
                    onChange={(e) =>
                      setEditCategoria(Number(e.target.value))
                    }
                  >
                    <option value={0}>Selecione uma categoria</option>

                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>

                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleUpdate(curso.id)}
                  >
                    Salvar
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditando(null)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <h5>{curso.nome}</h5>

                  <p>
                    Categoria:{" "}
                    {
                      categorias.find(
                        (c) => c.id === curso.idCategoria
                      )?.nome
                    }
                  </p>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditando(curso.id)
                      setEditNome(curso.nome)
                      setEditCategoria(curso.idCategoria)
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(curso.id)}
                  >
                    Excluir
                  </button>
                </>
              )}

            </div>
          </div>
        ))}
      </div>

    </div>
  )
}