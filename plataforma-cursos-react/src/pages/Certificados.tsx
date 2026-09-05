import { useEffect, useState } from "react"
import jsPDF from "jspdf"

import { getUsuarios } from "../services/usuariosService"
import { getCursos } from "../services/cursosService"

import {
  getCertificados,
  createCertificado
} from "../services/certificadosService"

type Usuario = {
  id: string
  nome: string
}

type Curso = {
  id: string
  nome: string
}

type Certificado = {
  id: string
  usuario: string
  curso: string
  codigo: string
  dataEmissao?: string
}

export default function Certificados() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [certificados, setCertificados] = useState<Certificado[]>([])

  const [usuarioSelecionado, setUsuarioSelecionado] =
    useState<Usuario | null>(null)

  const [cursoSelecionado, setCursoSelecionado] =
    useState<Curso | null>(null)

  const [certificadoGerado, setCertificadoGerado] =
    useState<Certificado | null>(null)

  const [loading, setLoading] = useState(true)

  function carregarDados() {
    setLoading(true)

    Promise.all([
      getUsuarios(),
      getCursos(),
      getCertificados()
    ])
      .then(
        ([
          usuariosResponse,
          cursosResponse,
          certificadosResponse
        ]) => {
          setUsuarios(usuariosResponse.data)
          setCursos(cursosResponse.data)
          setCertificados(certificadosResponse.data)
        }
      )
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    carregarDados()
  }, [])

  function gerarCodigo() {
    const numero = Math.floor(
      100000 + Math.random() * 900000
    )

    return `CERT-${numero}`
  }

  function gerarCertificado() {
    if (
      !usuarioSelecionado ||
      !cursoSelecionado
    ) {
      alert("Selecione um usuário e um curso.")
      return
    }

    const novoCertificado = {
      usuario: usuarioSelecionado.nome,
      curso: cursoSelecionado.nome,
      codigo: gerarCodigo(),
      dataEmissao:
        new Date().toLocaleDateString("pt-BR")
    }

    createCertificado(novoCertificado)
      .then((res) => {
        setCertificadoGerado(res.data)

        setCertificados((atuais) => [
          ...atuais,
          res.data
        ])

        alert("Certificado gerado com sucesso!")
      })
  }

  // =========================================================
  // DOWNLOAD DO CERTIFICADO
  // =========================================================

  function baixarCertificado(
    certificado: Certificado
  ) {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    })

    const largura = pdf.internal.pageSize.getWidth()
    const altura = pdf.internal.pageSize.getHeight()

    // BORDA EXTERNA
    pdf.setDrawColor(90, 45, 51)
    pdf.setLineWidth(1.5)

    pdf.rect(
      10,
      10,
      largura - 20,
      altura - 20
    )

    // BORDA INTERNA
    pdf.setDrawColor(124, 63, 70)
    pdf.setLineWidth(0.5)

    pdf.rect(
      14,
      14,
      largura - 28,
      altura - 28
    )

    // TÍTULO
    pdf.setTextColor(90, 45, 51)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(28)

    pdf.text(
      "CERTIFICADO",
      largura / 2,
      45,
      {
        align: "center"
      }
    )

    // SUBTÍTULO
    pdf.setTextColor(80, 80, 80)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(14)

    pdf.text(
      "Certificado de Conclusão",
      largura / 2,
      57,
      {
        align: "center"
      }
    )

    // TEXTO
    pdf.setFontSize(13)

    pdf.text(
      "Certificamos que",
      largura / 2,
      80,
      {
        align: "center"
      }
    )

    // NOME
    pdf.setTextColor(40, 40, 40)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(22)

    pdf.text(
      certificado.usuario,
      largura / 2,
      98,
      {
        align: "center"
      }
    )

    // TEXTO
    pdf.setTextColor(80, 80, 80)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(13)

    pdf.text(
      "concluiu com êxito o curso",
      largura / 2,
      115,
      {
        align: "center"
      }
    )

    // CURSO
    pdf.setTextColor(90, 45, 51)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(20)

    pdf.text(
      certificado.curso,
      largura / 2,
      133,
      {
        align: "center"
      }
    )

    // TEXTO FINAL
    pdf.setTextColor(80, 80, 80)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(12)

    pdf.text(
      "com carga horária e aproveitamento satisfatórios.",
      largura / 2,
      150,
      {
        align: "center"
      }
    )

    // RODAPÉ
    pdf.setFontSize(11)

    pdf.text(
      "Plataforma de Cursos Online",
      largura / 2,
      173,
      {
        align: "center"
      }
    )

    pdf.setFontSize(9)

    pdf.text(
      `Código de Verificação: ${certificado.codigo}`,
      largura / 2,
      182,
      {
        align: "center"
      }
    )

    if (certificado.dataEmissao) {
      pdf.text(
        `Emitido em: ${certificado.dataEmissao}`,
        largura / 2,
        189,
        {
          align: "center"
        }
      )
    }

    // NOME DO ARQUIVO
    const nomeArquivo =
      `certificado-${certificado.usuario}`
        .toLowerCase()
        .replace(/\s+/g, "-")

    pdf.save(`${nomeArquivo}.pdf`)
  }

  return (
    <div className="container mt-4 crud-page">

      {/* CABEÇALHO */}
      <div className="crud-page-header">

        <h2>Certificados</h2>

        <p>
          Gere, consulte e baixe certificados emitidos pela plataforma.
        </p>

      </div>

      <div className="crud-two-column">

        {/* FORMULÁRIO */}
        <div className="card crud-form-card">

          <h5>Gerar certificado</h5>

          <div className="mb-3">

            <label className="form-label text-muted">
              Usuário
            </label>

            <select
              className="form-select"
              value={
                usuarioSelecionado?.id || ""
              }
              onChange={(e) => {
                const usuario =
                  usuarios.find(
                    (item) =>
                      String(item.id) ===
                      String(e.target.value)
                  ) || null

                setUsuarioSelecionado(usuario)
              }}
            >

              <option value="">
                Selecione um usuário
              </option>

              {usuarios.map((usuario) => (

                <option
                  key={usuario.id}
                  value={usuario.id}
                >
                  {usuario.nome}
                </option>

              ))}

            </select>

          </div>

          <div className="mb-3">

            <label className="form-label text-muted">
              Curso
            </label>

            <select
              className="form-select"
              value={
                cursoSelecionado?.id || ""
              }
              onChange={(e) => {
                const curso =
                  cursos.find(
                    (item) =>
                      String(item.id) ===
                      String(e.target.value)
                  ) || null

                setCursoSelecionado(curso)
              }}
            >

              <option value="">
                Selecione um curso
              </option>

              {cursos.map((curso) => (

                <option
                  key={curso.id}
                  value={curso.id}
                >
                  {curso.nome}
                </option>

              ))}

            </select>

          </div>

          <div className="crud-form-actions">

            <button
              type="button"
              className="crud-btn crud-btn-primary"
              onClick={gerarCertificado}
            >
              <i className="bi bi-award"></i>
              Gerar certificado
            </button>

          </div>

        </div>

        {/* HISTÓRICO */}
        <div className="card crud-list-card">

          <div className="crud-list-header">

            <h5>Certificados emitidos</h5>

            <small className="text-muted">
              Histórico de certificados gerados
            </small>

          </div>

          {loading ? (

            <div className="p-4 text-center text-muted">
              Carregando...
            </div>

          ) : certificados.length === 0 ? (

            <div className="p-4 text-center">

              <i className="bi bi-award fs-3 text-muted"></i>

              <p className="mt-2 mb-0">
                Nenhum certificado emitido.
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table crud-table align-middle">

                <thead>
                  <tr>

                    <th className="ps-3">
                      Usuário
                    </th>

                    <th>
                      Curso
                    </th>

                    <th>
                      Código
                    </th>

                    <th>
                      Emissão
                    </th>

                    <th className="text-end pe-3">
                      Ações
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {certificados.map(
                    (certificado) => (

                      <tr key={certificado.id}>

                        <td className="ps-3">
                          <strong>
                            {certificado.usuario}
                          </strong>
                        </td>

                        <td>
                          {certificado.curso}
                        </td>

                        <td>
                          <span className="badge categoria-badge">
                            {certificado.codigo}
                          </span>
                        </td>

                        <td>
                          {certificado.dataEmissao || "-"}
                        </td>

                        <td className="text-end pe-3">

                          <div className="crud-actions">

                            <button
                              type="button"
                              className="crud-btn crud-btn-secondary crud-btn-icon"
                              title="Visualizar certificado"
                              onClick={() =>
                                setCertificadoGerado(
                                  certificado
                                )
                              }
                            >
                              <i className="bi bi-eye"></i>
                            </button>

                            <button
                              type="button"
                              className="crud-btn crud-btn-primary crud-btn-icon"
                              title="Baixar certificado"
                              onClick={() =>
                                baixarCertificado(
                                  certificado
                                )
                              }
                            >
                              <i className="bi bi-download"></i>
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* PRÉVIA */}
      {certificadoGerado && (

        <>

          <div className="d-flex justify-content-end mt-4 mb-2">

            <button
              type="button"
              className="crud-btn crud-btn-primary"
              onClick={() =>
                baixarCertificado(
                  certificadoGerado
                )
              }
            >
              <i className="bi bi-download"></i>
              Baixar PDF
            </button>

          </div>

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
              {certificadoGerado.usuario}
            </h2>

            <p>
              concluiu com êxito o curso
            </p>

            <h3 className="cert-curso">
              {certificadoGerado.curso}
            </h3>

            <p className="mt-4">
              com carga horária e aproveitamento satisfatórios.
            </p>

            <div className="mt-5">

              <p>
                Plataforma de Cursos Online
              </p>

              <small>
                Código de Verificação:{" "}
                {certificadoGerado.codigo}
              </small>

              {certificadoGerado.dataEmissao && (

                <div className="mt-2">

                  <small>
                    Emitido em:{" "}
                    {certificadoGerado.dataEmissao}
                  </small>

                </div>

              )}

            </div>

          </div>

        </>

      )}

    </div>
  )
}