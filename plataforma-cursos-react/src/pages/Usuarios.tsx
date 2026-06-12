import { useEffect, useState } from "react"

import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from "../services/usuariosService"

type Usuario = {
  id: number
  nome: string
  email: string
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")

  const [editando, setEditando] = useState<number | null>(null)
  const [editNome, setEditNome] = useState("")
  const [editEmail, setEditEmail] = useState("")

  function carregarUsuarios() {
    getUsuarios().then((res) => {
      setUsuarios(res.data)
    })
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    createUsuario({
      nome,
      email
    }).then(() => {
      setNome("")
      setEmail("")
      carregarUsuarios()
    })
  }

  function handleDelete(id: number) {
    deleteUsuario(id).then(() => {
      setUsuarios(
        usuarios.filter((user) => user.id !== id)
      )
    })
  }

  function handleUpdate(id: number) {
    updateUsuario(id, {
      nome: editNome,
      email: editEmail
    }).then(() => {
      setEditando(null)
      carregarUsuarios()
    })
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Usuários</h2>

      <div className="card p-3 mb-4">
        <h5>Cadastrar Usuário</h5>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="btn btn-rose">
            Salvar
          </button>
        </form>
      </div>

      <div className="row">
        {usuarios.map((user) => (
          <div
            className="col-md-4 mb-3"
            key={user.id}
          >
            <div className="card shadow-sm p-4 h-100 curso-card">

              {editando === user.id ? (
                <>
                  <input
                    className="form-control mb-2"
                    value={editNome}
                    onChange={(e) =>
                      setEditNome(e.target.value)
                    }
                  />

                  <input
                    className="form-control mb-2"
                    value={editEmail}
                    onChange={(e) =>
                      setEditEmail(e.target.value)
                    }
                  />

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-rose btn-sm"
                      onClick={() =>
                        handleUpdate(user.id)
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
                  </div>
                </>
              ) : (
                <>
                  <h5 className="mb-3 fw-bold">
                    {user.nome}
                  </h5>

                  <p className="mb-3">
                    {user.email}
                  </p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-rose btn-sm"
                      onClick={() => {
                        setEditando(user.id)
                        setEditNome(user.nome)
                        setEditEmail(user.email)
                      }}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-dark-custom btn-sm"
                      onClick={() =>
                        handleDelete(user.id)
                      }
                    >
                      Excluir
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        ))}
      </div>

    </div>
  )
}