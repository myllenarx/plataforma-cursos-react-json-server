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

    if (!usuario || !curso) {
      alert("Selecione um usuário e um curso.")
      return
    }

    const codigo =
      "CERT-" +
      Math.floor(Math.random() * 100000)

    createCertificado({
      usuario: usuario.nome,
      curso: curso.nome,
      codigo
    }).then(() => {
      alert("Certificado gerado!")
    })
  }

  console.log("USUARIOS", usuarios)
  console.log("CURSO 1", cursos[0])

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
                  String(u.id) === e.target.value
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
                  String(c.id) === e.target.value
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
          className="certificado shadow-sm"
        >
          <h1 className="cert-titulo">
            CERTIFICADO
          </h1>

          <p className="cert-subtitulo">
            Certificado de Conclusão
          </p>

          <p className="mt-4">
            Certificamos que
          </p>

          <h2 className="cert-nome">
            {usuario.nome}
          </h2>

          <p>
            concluiu com êxito o curso
          </p>

          <h3 className="cert-curso">
            {curso.nome}
          </h3>

          <p className="mt-4">
            com carga horária e aproveitamento satisfatórios.
          </p>

          <div className="mt-5">
            <p>
              Plataforma de Cursos Online
            </p>

            <small>
              Código de Verificação:
              {" "}
              {Math.floor(Math.random() * 100000)}
            </small>
          </div>
        </div>
      )}

    </div>
  )
}