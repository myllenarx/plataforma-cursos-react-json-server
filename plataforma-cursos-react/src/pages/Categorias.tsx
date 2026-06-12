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
    deleteCategoria(id).then(() => {
      setCategorias(
        categorias.filter((cat) => cat.id !== id)
      )
    })
  }

  function handleUpdate(id: number) {
    updateCategoria(id, {
      nome: editNome,
      descricao: editDescricao
    }).then(() => {
      setEditando(null)
      carregarCategorias()
    })
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Categorias</h2>

      <div className="card p-3 mb-4">
        <h5>Cadastrar Categoria</h5>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <textarea
            className="form-control mb-2"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <button className="btn btn-rose">
            Salvar
          </button>
        </form>
      </div>

      <div className="row">
        {categorias.map((cat) => (
          <div
            className="col-md-4 mb-3"
            key={cat.id}
          >
            <div className="card p-3 shadow-sm">

              {editando === cat.id ? (
                <>
                  <input
                    className="form-control mb-2"
                    value={editNome}
                    onChange={(e) =>
                      setEditNome(e.target.value)
                    }
                  />

                  <textarea
                    className="form-control mb-2"
                    value={editDescricao}
                    onChange={(e) =>
                      setEditDescricao(e.target.value)
                    }
                  />

                  <button
                    className="btn btn-rose btn-sm"
                    onClick={() =>
                      handleUpdate(cat.id)
                    }
                  >
                    Salvar
                  </button>

                  <button
                    className="btn btn-dark-custom btn-sm"
                    onClick={() =>
                      setEditando(null)
                    }
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <h5>{cat.nome}</h5>

                  <p>{cat.descricao}</p>

                  <button
                    className="btn btn-rose btn-sm"
                    onClick={() => {
                      setEditando(cat.id)
                      setEditNome(cat.nome)
                      setEditDescricao(cat.descricao)
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-dark-custom btn-sm"
                    onClick={() =>
                      handleDelete(cat.id)
                    }
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