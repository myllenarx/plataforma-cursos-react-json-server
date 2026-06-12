import { useEffect, useState } from "react"

import { getUsuarios } from "../services/usuariosService"
import { getCursos } from "../services/cursosService"

import {
  createCertificado
} from "../services/certificadosService"

export default function Certificados() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [cursos, setCursos] = useState<any[]>([])

  const [usuario, setUsuario] = useState<any>(null)
  const [curso, setCurso] = useState<any>(null)

  useEffect(() => {
    getUsuarios().then((res) => {
      setUsuarios(res.data)
    })

    getCursos().then((res) => {
      setCursos(res.data)
    })
  }, [])

  function gerarCertificado() {

    const codigo =
      "CERT-" +
      Math.floor(Math.random() * 100000)

    createCertificado({
      usuario: usuario.nome,
      curso: curso.nome,
      codigo
    })

    alert("Certificado gerado!")
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        Certificados
      </h2>

      <div className="card p-4 mb-4">

        <select
          className="form-control mb-2"
          onChange={(e) =>
            setUsuario(
              usuarios.find(
                (u) =>
                  u.id === Number(e.target.value)
              )
            )
          }
        >
          <option>
            Selecione um usuário
          </option>

          {usuarios.map((u) => (
            <option
              key={u.id}
              value={u.id}
            >
              {u.nome}
            </option>
          ))}
        </select>

        <select
          className="form-control mb-3"
          onChange={(e) =>
            setCurso(
              cursos.find(
                (c) =>
                  c.id === Number(e.target.value)
              )
            )
          }
        >
          <option>
            Selecione um curso
          </option>

          {cursos.map((c) => (
            <option
              key={c.id}
              value={c.id}
            >
              {c.nome}
            </option>
          ))}
        </select>

        <button
          className="btn btn-rose"
          onClick={gerarCertificado}
        >
          Gerar Certificado
        </button>

      </div>

      {usuario && curso && (
        <div
          className="card p-5 text-center shadow-sm"
        >
          <h2>
            Certificado de Conclusão
          </h2>

          <p className="mt-4">
            Certificamos que
          </p>

          <h3>
            {usuario.nome}
          </h3>

          <p>
            concluiu com sucesso o curso
          </p>

          <h4>
            {curso.nome}
          </h4>

          <p className="mt-4">
            Plataforma de Cursos Online
          </p>
        </div>
      )}

    </div>
  )
}