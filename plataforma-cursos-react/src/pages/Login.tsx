import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { estaAutenticado } from "../services/auth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [erro, setErro] = useState("")
  const navigate = useNavigate()
  
  useEffect(() => {
    if (estaAutenticado()) {
      navigate("/dashboard", { replace: true })
    }
  }, [navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro("")

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      })

      localStorage.setItem(
        "access_token",
        response.data.access_token
      )

      navigate("/dashboard")
    } catch {
      setErro("E-mail ou senha inválidos.")
    }
  }

  return (
    <div className="container mt-5">
      <div
        className="card p-4 mx-auto"
        style={{ maxWidth: "450px" }}
      >
        <h2 className="mb-1">Entrar</h2>

        <p className="text-muted mb-4">
          Acesse a Plataforma de Cursos
        </p>

        {erro && (
          <div className="alert alert-danger">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              E-mail
            </label>

            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">
              Senha
            </label>

            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-rose w-100"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}