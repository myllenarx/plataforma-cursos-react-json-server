import { useEffect, useState } from "react"
import { getUsuarios } from "../services/usuariosService"

type Usuario = {
  id: number
  nome: string
  email: string
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])

  useEffect(() => {
    getUsuarios().then((res) => {
      setUsuarios(res.data)
    })
  }, [])

  return (
    <div className="container mt-4">
      <h2>Usuários</h2>

      <div className="row">
        {usuarios.map((user) => (
          <div className="col-md-4 mb-3" key={user.id}>
            <div className="card p-3">
              <h5>{user.nome}</h5>
              <p>{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}