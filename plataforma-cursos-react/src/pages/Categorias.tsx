import { useEffect, useState } from "react"

import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from "../services/categoriasService"

type Categoria = {
  id: number
  nome: string
  descricao: string
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")

  const [editando, setEditando] = useState<number | null>(null)
  const [editNome, setEditNome] = useState("")
  const [editDescricao, setEditDescricao] = useState("")

  function carregarCategorias() {
    getCategorias().then((res) => {
      setCategorias(res.data)
    })
  }

  useEffect(() => {
    carregarCategorias()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!nome.trim()) {
      return
    }

    createCategoria({
      nome,
      descricao
    }).then(() => {
      setNome("")
      setDescricao("")
      carregarCategorias()
    })
  }

  function handleDelete(id: number) {
    if (!window.confirm("Deseja realmente excluir esta categoria?")) {
      return
    }

    deleteCategoria(id).then(() => {
      setCategorias(
        categorias.filter((categoria) => categoria.id !== id)
      )
    })
  }

  function iniciarEdicao(categoria: Categoria) {
    setEditando(categoria.id)
    setEditNome(categoria.nome)
    setEditDescricao(categoria.descricao)
  }

  function cancelarEdicao() {
    setEditando(null)
    setEditNome("")
    setEditDescricao("")
  }

  function handleUpdate(id: number) {
    if (!editNome.trim()) {
      return
    }

    updateCategoria(id, {
      nome: editNome,
      descricao: editDescricao
    }).then(() => {
      cancelarEdicao()
      carregarCategorias()
    })
  }

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Categorias</h2>
          <p className="mb-0">
            Organize os cursos por categoria.
          </p>
        </div>

        <span className="text-muted">
          {categorias.length} categoria(s)
        </span>
      </div>

      {/* CADASTRO */}
      <div className="card p-3 mb-4">

        <h5>Cadastrar categoria</h5>

        <form onSubmit={handleSubmit}>

          <div className="row g-3">

            <div className="col-md-5">
              <label className="form-label small text-muted">
                Nome
              </label>

              <input
                className="form-control"
                placeholder="Nome da categoria"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="col-md-7">
              <label className="form-label small text-muted">
                Descrição
              </label>

              <input
                className="form-control"
                placeholder="Descrição da categoria"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

          </div>

          <div className="mt-3">
            <button
              type="submit"
              className="btn btn-rose"
            >
              <i className="bi bi-plus-lg me-2"></i>
              Cadastrar categoria
            </button>
          </div>

        </form>
      </div>

      {/* LISTAGEM */}
      <div className="card">

        <div className="p-3 border-bottom">

          <h5 className="mb-1">
            Categorias cadastradas
          </h5>

          <small className="text-muted">
            Categorias disponíveis na plataforma
          </small>

        </div>

        {categorias.length === 0 ? (

          <div className="p-5 text-center">
            <i className="bi bi-folder2-open fs-3 text-muted"></i>

            <p className="mt-2 mb-0">
              Nenhuma categoria cadastrada.
            </p>
          </div>

        ) : (

          <div className="table-responsive">

            <table className="table align-middle">

              <thead>
                <tr>
                  <th className="ps-3">Categoria</th>
                  <th>Descrição</th>
                  <th className="text-end pe-3">Ações</th>
                </tr>
              </thead>

              <tbody>

                {categorias.map((categoria) => (

                  <tr key={categoria.id}>

                    {editando === categoria.id ? (

                      <>
                        <td className="ps-3">

                          <input
                            className="form-control"
                            value={editNome}
                            onChange={(e) =>
                              setEditNome(e.target.value)
                            }
                          />

                        </td>

                        <td>

                          <input
                            className="form-control"
                            value={editDescricao}
                            onChange={(e) =>
                              setEditDescricao(e.target.value)
                            }
                          />

                        </td>

                        <td className="text-end pe-3">

                          <button
                            className="btn btn-rose btn-sm me-2"
                            onClick={() =>
                              handleUpdate(categoria.id)
                            }
                          >
                            <i className="bi bi-check-lg"></i>
                          </button>

                          <button
                            className="btn btn-dark-custom btn-sm"
                            onClick={cancelarEdicao}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>

                        </td>
                      </>

                    ) : (

                      <>
                        <td className="ps-3">

                          <div className="d-flex align-items-center gap-3">

                            <div
                              className="d-flex align-items-center justify-content-center"
                              style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "8px",
                                background: "rgba(124, 63, 70, 0.18)",
                                color: "var(--wine-light)"
                              }}
                            >
                              <i className="bi bi-folder"></i>
                            </div>

                            <strong>
                              {categoria.nome}
                            </strong>

                          </div>

                        </td>

                        <td>
                          {categoria.descricao || (
                            <span className="text-muted">
                              Sem descrição
                            </span>
                          )}
                        </td>

                        <td className="text-end pe-3">

                          <button
                            className="btn btn-dark-custom btn-sm me-2"
                            onClick={() =>
                              iniciarEdicao(categoria)
                            }
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleDelete(categoria.id)
                            }
                            title="Excluir"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>

                        </td>
                      </>

                    )}

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}