import { useEffect, useMemo, useState } from "react"
import jsPDF from "jspdf"

import {
  getUsuarios,
  type Usuario
} from "../services/usuariosService"

import { getCursos } from "../services/cursosService"

import {
  getMatriculas,
  type Matricula
} from "../services/matriculasService"

import {
  getCertificados,
  createCertificado,
  deleteCertificado,
  type Certificado
} from "../services/certificadosService"

type Curso = {
  id: string
  nome: string
}

export default function Certificados() {
  const [usuarios, setUsuarios] =
    useState<Usuario[]>([])

  const [cursos, setCursos] =
    useState<Curso[]>([])

  const [matriculas, setMatriculas] =
    useState<Matricula[]>([])

  const [
    certificados,
    setCertificados
  ] = useState<Certificado[]>([])

  const [
    idMatricula,
    setIdMatricula
  ] = useState("")

  const [
    certificadoGerado,
    setCertificadoGerado
  ] = useState<Certificado | null>(
    null
  )

  const [busca, setBusca] =
    useState("")

  const [loading, setLoading] =
    useState(true)

  // =========================================================
  // CARREGAMENTO
  // =========================================================

  function carregarDados() {
     Promise.all([
      getUsuarios(),
      getCursos(),
      getMatriculas(),
      getCertificados()
    ])
      .then(
        ([
          usuariosResponse,
          cursosResponse,
          matriculasResponse,
          certificadosResponse
        ]) => {
          setUsuarios(
            usuariosResponse.data
          )

          setCursos(
            cursosResponse.data
          )

          setMatriculas(
            matriculasResponse.data
          )

          setCertificados(
            certificadosResponse.data
          )
        }
      )
      .catch(() => {
        alert(
          "Não foi possível carregar os dados dos certificados."
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    carregarDados()
  }, [])

  // =========================================================
  // BUSCAS
  // =========================================================

  function buscarUsuario(
    id: string
  ) {
    return usuarios.find(
      (usuario) =>
        String(usuario.id) ===
        String(id)
    )
  }

  function buscarCurso(
    id: string
  ) {
    return cursos.find(
      (curso) =>
        String(curso.id) ===
        String(id)
    )
  }

  // =========================================================
  // MATRÍCULAS APTAS
  // =========================================================

  const matriculasConcluidas =
    useMemo(() => {
      return matriculas.filter(
        (matricula) =>
          Boolean(
            matricula.dataConclusao
          )
      )
    }, [matriculas])

  const matriculasDisponiveis =
    useMemo(() => {
      return matriculasConcluidas.filter(
        (matricula) =>
          !certificados.some(
            (certificado) =>
              String(
                certificado.idUsuario
              ) ===
                String(
                  matricula.idUsuario
                ) &&
              String(
                certificado.idCurso
              ) ===
                String(
                  matricula.idCurso
                )
          )
      )
    }, [
      matriculasConcluidas,
      certificados
    ])

  // =========================================================
  // CÓDIGO
  // =========================================================

  function gerarCodigo() {
    const numero =
      Math.floor(
        100000 +
          Math.random() * 900000
      )

    return `CERT-${numero}`
  }

  function gerarCodigoUnico() {
    let codigo = gerarCodigo()

    while (
      certificados.some(
        (certificado) =>
          certificado.codigo === codigo
      )
    ) {
      codigo = gerarCodigo()
    }

    return codigo
  }

  // =========================================================
  // EMISSÃO
  // =========================================================

  function gerarCertificado(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (!idMatricula) {
      alert(
        "Selecione uma conclusão de curso."
      )
      return
    }

    const matricula =
      matriculasConcluidas.find(
        (item) =>
          String(item.id) ===
          String(idMatricula)
      )

    if (!matricula) {
      alert(
        "A matrícula selecionada não está concluída."
      )
      return
    }

    const usuario =
      buscarUsuario(
        matricula.idUsuario
      )

    const curso =
      buscarCurso(
        matricula.idCurso
      )

    if (!usuario || !curso) {
      alert(
        "Não foi possível localizar o usuário ou o curso."
      )
      return
    }

    const jaExiste =
      certificados.some(
        (certificado) =>
          String(
            certificado.idUsuario
          ) ===
            String(usuario.id) &&
          String(
            certificado.idCurso
          ) ===
            String(curso.id)
      )

    if (jaExiste) {
      alert(
        "Já existe um certificado emitido para este usuário neste curso."
      )
      return
    }

    const novoCertificado = {
      idUsuario:
        String(usuario.id),

      idCurso:
        String(curso.id),

      usuario:
        usuario.nome,

      curso:
        curso.nome,

      codigo:
        gerarCodigoUnico(),

      dataEmissao:
        new Date().toLocaleDateString(
          "pt-BR"
        )
    }

    createCertificado(
      novoCertificado
    )
      .then((response) => {
        const salvo =
          response.data

        setCertificados(
          (atuais) => [
            ...atuais,
            salvo
          ]
        )

        setCertificadoGerado(
          salvo
        )

        setIdMatricula("")
      })
      .catch(() => {
        alert(
          "Não foi possível emitir o certificado."
        )
      })
  }

  // =========================================================
  // EXCLUSÃO
  // =========================================================

  function handleDelete(
    certificado: Certificado
  ) {
    if (
      !window.confirm(
        `Deseja realmente excluir o certificado ${certificado.codigo}?`
      )
    ) {
      return
    }

    deleteCertificado(
      certificado.id
    )
      .then(() => {
        setCertificados(
          (atuais) =>
            atuais.filter(
              (item) =>
                item.id !==
                certificado.id
            )
        )

        if (
          certificadoGerado?.id ===
          certificado.id
        ) {
          setCertificadoGerado(
            null
          )
        }
      })
      .catch(() => {
        alert(
          "Não foi possível excluir o certificado."
        )
      })
  }

  // =========================================================
  // PDF
  // =========================================================

  function baixarCertificado(
    certificado: Certificado
  ) {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    })

    const largura =
      pdf.internal.pageSize.getWidth()

    const altura =
      pdf.internal.pageSize.getHeight()

    // Fundo
    pdf.setFillColor(
      248,
      246,
      246
    )

    pdf.rect(
      0,
      0,
      largura,
      altura,
      "F"
    )

    // Moldura externa
    pdf.setDrawColor(
      124,
      63,
      70
    )

    pdf.setLineWidth(2)

    pdf.rect(
      10,
      10,
      largura - 20,
      altura - 20
    )

    // Moldura interna
    pdf.setLineWidth(0.5)

    pdf.rect(
      15,
      15,
      largura - 30,
      altura - 30
    )

    // Título
    pdf.setTextColor(
      90,
      45,
      51
    )

    pdf.setFont(
      "helvetica",
      "bold"
    )

    pdf.setFontSize(30)

    pdf.text(
      "CERTIFICADO",
      largura / 2,
      42,
      {
        align: "center"
      }
    )

    pdf.setFontSize(14)

    pdf.setFont(
      "helvetica",
      "normal"
    )

    pdf.text(
      "Certificado de Conclusão",
      largura / 2,
      55,
      {
        align: "center"
      }
    )

    // Texto
    pdf.setTextColor(
      45,
      45,
      45
    )

    pdf.setFontSize(12)

    pdf.text(
      "Certificamos que",
      largura / 2,
      78,
      {
        align: "center"
      }
    )

    // Nome
    pdf.setFont(
      "helvetica",
      "bold"
    )

    pdf.setFontSize(22)

    pdf.setTextColor(
      90,
      45,
      51
    )

    pdf.text(
      certificado.usuario,
      largura / 2,
      94,
      {
        align: "center"
      }
    )

    // Curso
    pdf.setFont(
      "helvetica",
      "normal"
    )

    pdf.setFontSize(12)

    pdf.setTextColor(
      45,
      45,
      45
    )

    pdf.text(
      "concluiu com êxito o curso",
      largura / 2,
      110,
      {
        align: "center"
      }
    )

    pdf.setFont(
      "helvetica",
      "bold"
    )

    pdf.setFontSize(18)

    pdf.text(
      certificado.curso,
      largura / 2,
      125,
      {
        align: "center"
      }
    )

    // Plataforma
    pdf.setFont(
      "helvetica",
      "normal"
    )

    pdf.setFontSize(11)

    pdf.text(
      "Plataforma de Cursos Online",
      largura / 2,
      145,
      {
        align: "center"
      }
    )

    // Rodapé
    pdf.setFontSize(9)

    pdf.setTextColor(
      90,
      90,
      90
    )

    pdf.text(
      `Código de verificação: ${certificado.codigo}`,
      25,
      altura - 28
    )

    pdf.text(
      `Data de emissão: ${certificado.dataEmissao}`,
      largura - 25,
      altura - 28,
      {
        align: "right"
      }
    )

    const nomeArquivo =
      certificado.usuario
        .toLowerCase()
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-|-$/g,
          ""
        )

    pdf.save(
      `certificado-${nomeArquivo}.pdf`
    )
  }

  // =========================================================
  // FILTRO DO HISTÓRICO
  // =========================================================

  const certificadosFiltrados =
    useMemo(() => {
      const termo =
        busca
          .trim()
          .toLowerCase()

      if (!termo) {
        return certificados
      }

      return certificados.filter(
        (certificado) =>
          certificado.usuario
            .toLowerCase()
            .includes(termo) ||
          certificado.curso
            .toLowerCase()
            .includes(termo) ||
          certificado.codigo
            .toLowerCase()
            .includes(termo)
      )
    }, [
      certificados,
      busca
    ])

  // =========================================================
  // INTERFACE
  // =========================================================

  return (
    <div className="container mt-4 crud-page">

      <div className="crud-page-header">
        <h2>Certificados</h2>

        <p>
          Emita e gerencie certificados
          de cursos concluídos.
        </p>
      </div>

      <div className="crud-two-column">

        {/* EMISSÃO */}
        <div className="card crud-form-card">

          <h5>
            Emitir certificado
          </h5>

          {loading ? (

            <div className="text-muted">
              Carregando...
            </div>

          ) : matriculasDisponiveis
              .length === 0 ? (

            <div
              style={{
                padding: "14px",
                border:
                  "1px solid var(--border)",
                borderRadius: "8px"
              }}
            >
              <div className="d-flex gap-2">

                <i className="bi bi-info-circle text-muted"></i>

                <div>
                  <div
                    style={{
                      fontSize: "12px"
                    }}
                  >
                    Nenhuma conclusão
                    disponível para emissão.
                  </div>

                  <small className="text-muted">
                    O aluno precisa concluir
                    todas as aulas do curso e
                    ainda não possuir um
                    certificado para ele.
                  </small>
                </div>

              </div>
            </div>

          ) : (

            <form
              onSubmit={
                gerarCertificado
              }
            >

              <div className="mb-3">

                <label className="form-label text-muted">
                  Conclusão
                </label>

                <select
                  className="form-select"
                  value={
                    idMatricula
                  }
                  onChange={(e) =>
                    setIdMatricula(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Selecione um curso concluído
                  </option>

                  {matriculasDisponiveis.map(
                    (matricula) => {

                      const usuario =
                        buscarUsuario(
                          matricula.idUsuario
                        )

                      const curso =
                        buscarCurso(
                          matricula.idCurso
                        )

                      return (
                        <option
                          key={
                            matricula.id
                          }
                          value={
                            matricula.id
                          }
                        >
                          {usuario?.nome ||
                            "Usuário"}{" "}
                          —{" "}
                          {curso?.nome ||
                            "Curso"}
                        </option>
                      )
                    }
                  )}

                </select>

              </div>

              <div className="crud-form-actions">

                <button
                  type="submit"
                  className="crud-btn crud-btn-primary"
                >
                  <i className="bi bi-award"></i>
                  Emitir certificado
                </button>

              </div>

            </form>

          )}

        </div>

        {/* HISTÓRICO */}
        <div className="card crud-list-card">

          <div className="crud-list-header">

            <div className="d-flex justify-content-between align-items-center gap-3">

              <div>
                <h5>
                  Certificados emitidos
                </h5>

                <small className="text-muted">
                  Histórico de certificações
                </small>
              </div>

              <div
                style={{
                  width: "220px",
                  maxWidth: "100%"
                }}
              >
                <div className="input-group input-group-sm">

                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>

                  <input
                    className="form-control"
                    placeholder="Buscar..."
                    value={busca}
                    onChange={(e) =>
                      setBusca(
                        e.target.value
                      )
                    }
                  />

                </div>
              </div>

            </div>

          </div>

          {loading ? (

            <div className="p-4 text-center text-muted">
              Carregando...
            </div>

          ) : certificadosFiltrados
              .length === 0 ? (

            <div className="p-4 text-center">

              <i className="bi bi-award fs-3 text-muted"></i>

              <p className="mt-2 mb-0">
                Nenhum certificado encontrado.
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

                  {certificadosFiltrados.map(
                    (certificado) => (

                      <tr
                        key={
                          certificado.id
                        }
                      >

                        <td className="ps-3">
                          <strong>
                            {
                              certificado.usuario
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            certificado.curso
                          }
                        </td>

                        <td>
                          <code>
                            {
                              certificado.codigo
                            }
                          </code>
                        </td>

                        <td>
                          {
                            certificado.dataEmissao
                          }
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
                              className="crud-btn crud-btn-secondary crud-btn-icon"
                              title="Baixar PDF"
                              onClick={() =>
                                baixarCertificado(
                                  certificado
                                )
                              }
                            >
                              <i className="bi bi-download"></i>
                            </button>

                            <button
                              type="button"
                              className="crud-btn crud-btn-delete crud-btn-icon"
                              title="Excluir certificado"
                              onClick={() =>
                                handleDelete(
                                  certificado
                                )
                              }
                            >
                              <i className="bi bi-trash3"></i>
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

      {/* PRÉ-VISUALIZAÇÃO */}
      {certificadoGerado && (

        <div
          className="card mt-4 p-4"
          style={{
            maxWidth: "900px",
            margin:
              "0 auto 30px"
          }}
        >

          <div className="d-flex justify-content-between align-items-center gap-3 mb-4">

            <div>
              <h5 className="mb-1">
                Pré-visualização
              </h5>

              <small className="text-muted">
                Certificado emitido
              </small>
            </div>

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
            style={{
              minHeight: "400px",
              border:
                "3px solid var(--wine)",
              outline:
                "1px solid var(--wine)",
              outlineOffset:
                "-9px",
              padding:
                "55px 40px",
              textAlign: "center",
              background:
                "var(--surface)"
            }}
          >

            <h2
              style={{
                letterSpacing:
                  "5px",
                color:
                  "var(--wine-light)"
              }}
            >
              CERTIFICADO
            </h2>

            <p className="text-muted">
              Certificado de Conclusão
            </p>

            <div className="mt-5">

              <small className="text-muted">
                Certificamos que
              </small>

              <h3 className="mt-2">
                {
                  certificadoGerado.usuario
                }
              </h3>

              <p className="mt-4 mb-1">
                concluiu com êxito o curso
              </p>

              <h4
                style={{
                  color:
                    "var(--wine-light)"
                }}
              >
                {
                  certificadoGerado.curso
                }
              </h4>

              <p className="text-muted mt-4">
                Plataforma de Cursos Online
              </p>

            </div>

            <div
              className="d-flex justify-content-between mt-5 pt-4"
              style={{
                borderTop:
                  "1px solid var(--border)"
              }}
            >

              <small className="text-muted">
                Código:{" "}
                {
                  certificadoGerado.codigo
                }
              </small>

              <small className="text-muted">
                Emissão:{" "}
                {
                  certificadoGerado.dataEmissao
                }
              </small>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}