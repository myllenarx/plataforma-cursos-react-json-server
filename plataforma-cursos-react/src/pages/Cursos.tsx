import { useEffect, useState } from "react"
import api from "../services/api"

type Curso = {
  id: number
  nome: string
  categoria: string
}

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)

  const [nome, setNome] = useState("")
  const [categoria, setCategoria] = useState("")

  const [editando, setEditando] = useState<number | null>(null)
  const [editNome, setEditNome] = useState("")
  const [editCategoria, setEditCategoria] = useState("")

  function carregarCursos() {
    setLoading(true)

    api.get("/cursos")
      .then((res) => setCursos(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    carregarCursos()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    api.post("/cursos", {
      nome,
      categoria
    }).then(() => {
      setNome("")
      setCategoria("")
      carregarCursos()
    })
  }

  function handleDelete(id: number) {
    api.delete(`/cursos/${id}`).then(() => {
      setCursos(cursos.filter((curso) => curso.id !== id))
    })
  }

  function handleUpdate(id: number) {
    api.put(`/cursos/${id}`, {
      nome: editNome,
      categoria: editCategoria
    }).then(() => {
      setEditando(null)
      carregarCursos()
    })
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Cursos</h2>

      {/* FORM CRIAR */}
      <div className="card p-3 mb-4">
        <h5>Cadastrar Curso</h5>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            placeholder="Nome do curso"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />

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

              {/* MODO EDITAR */}
              {editando === curso.id ? (
                <>
                  <input
                    className="form-control mb-2"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                  />

                  <input
                    className="form-control mb-2"
                    value={editCategoria}
                    onChange={(e) => setEditCategoria(e.target.value)}
                  />

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
                  <p>{curso.categoria}</p>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditando(curso.id)
                      setEditNome(curso.nome)
                      setEditCategoria(curso.categoria)
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