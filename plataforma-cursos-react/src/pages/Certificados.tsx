import { useEffect, useMemo, useState } from "react"
import jsPDF from "jspdf"

import {
  createCertificado,
  deleteCertificado,
  getCertificados,
  type Certificado,
} from "../services/certificadosService"

import {
  getMatriculas,
  type Matricula,
} from "../services/matriculasService"

import {
  getCursos,
  type Curso,
} from "../services/cursosService"

import {
  getUsuarios,
  type Usuario,
} from "../services/usuariosService"

import {
  getUsuarioLogado,
} from "../services/auth"

export default function Certificados() {
  const usuarioLogado =
    getUsuarioLogado()

  const ehAdmin =
    usuarioLogado?.perfil === "ADMIN"

  const [certificados, setCertificados] =
    useState<Certificado[]>([])

  const [matriculas, setMatriculas] =
    useState<Matricula[]>([])

  const [cursos, setCursos] =
    useState<Curso[]>([])

  const [usuarios, setUsuarios] =
    useState<Usuario[]>([])

  const [
    matriculaSelecionada,
    setMatriculaSelecionada,
  ] = useState("")

  const [loading, setLoading] =
    useState(true)

  const [emitindo, setEmitindo] =
    useState(false)

  async function carregarDados() {
    try {
      setLoading(true)

      if (ehAdmin) {
        const [
          certificadosResponse,
          matriculasResponse,
          cursosResponse,
          usuariosResponse,
        ] = await Promise.all([
          getCertificados(),
          getMatriculas(),
          getCursos(),
          getUsuarios(),
        ])

        setCertificados(
          certificadosResponse.data
        )

        setMatriculas(
          matriculasResponse.data
        )

        setCursos(
          cursosResponse.data
        )

        setUsuarios(
          usuariosResponse.data
        )
      } else {
        const certificadosResponse =
          await getCertificados()

        setCertificados(
          certificadosResponse.data
        )

        setMatriculas([])
        setCursos([])
        setUsuarios([])
      }
    } catch (error) {
      console.error(
        "Erro ao carregar certificados:",
        error
      )

      alert(
        "Não foi possível carregar os certificados."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  function buscarCurso(
    idCurso: string
  ) {
    return cursos.find(
      (curso) =>
        String(curso.id) ===
        String(idCurso)
    )
  }

  function buscarUsuario(
    idUsuario: string
  ) {
    return usuarios.find(
      (usuario) =>
        String(usuario.id) ===
        String(idUsuario)
    )
  }

  const matriculasElegiveis =
    useMemo(() => {
      if (!ehAdmin) {
        return []
      }

      return matriculas.filter(
        (matricula) => {
          if (
            !matricula.dataConclusao
          ) {
            return false
          }

          const jaPossuiCertificado =
            certificados.some(
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

          return !jaPossuiCertificado
        }
      )
    }, [
      ehAdmin,
      matriculas,
      certificados,
    ])

  async function emitirCertificado() {
    if (!ehAdmin) {
      return
    }

    if (!matriculaSelecionada) {
      alert(
        "Selecione uma matrícula concluída."
      )
      return
    }

    const matricula =
      matriculasElegiveis.find(
        (item) =>
          String(item.id) ===
          String(
            matriculaSelecionada
          )
      )

    if (!matricula) {
      alert(
        "Matrícula concluída não encontrada."
      )
      return
    }

    try {
      setEmitindo(true)

      await createCertificado({
        idUsuario:
          matricula.idUsuario,

        idCurso:
          matricula.idCurso,
      })

      setMatriculaSelecionada("")

      await carregarDados()
    } catch (error) {
      console.error(
        "Erro ao emitir certificado:",
        error
      )

      alert(
        "Não foi possível emitir o certificado. Confirme se o curso está concluído e se já não existe um certificado para esta matrícula."
      )
    } finally {
      setEmitindo(false)
    }
  }

  async function excluirCertificado(
    certificado: Certificado
  ) {
    if (!ehAdmin) {
      return
    }

    const confirmar =
      window.confirm(
        `Deseja realmente excluir o certificado ${certificado.codigo}?`
      )

    if (!confirmar) {
      return
    }

    try {
      await deleteCertificado(
        certificado.id
      )

      await carregarDados()
    } catch (error) {
      console.error(
        "Erro ao excluir certificado:",
        error
      )

      alert(
        "Não foi possível excluir o certificado."
      )
    }
  }

  function formatarData(
    data?: string | null
  ) {
    if (!data) {
      return "-"
    }

    const valor = new Date(data)

    if (
      Number.isNaN(
        valor.getTime()
      )
    ) {
      return data
    }

    return valor.toLocaleDateString(
      "pt-BR"
    )
  }

  function gerarPDF(
    certificado: Certificado
  ) {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    const largura =
      pdf.internal.pageSize.getWidth()

    const altura =
      pdf.internal.pageSize.getHeight()

    pdf.setDrawColor(
      117,
      62,
      74
    )

    pdf.setLineWidth(2)

    pdf.rect(
      10,
      10,
      largura - 20,
      altura - 20
    )

    pdf.setDrawColor(
      180,
      180,
      180
    )

    pdf.setLineWidth(0.5)

    pdf.rect(
      14,
      14,
      largura - 28,
      altura - 28
    )

    pdf.setFont(
      "helvetica",
      "bold"
    )

    pdf.setFontSize(13)

    pdf.text(
      "ACADEMIA",
      largura / 2,
      30,
      {
        align: "center",
      }
    )

    pdf.setFontSize(28)

    pdf.text(
      "CERTIFICADO",
      largura / 2,
      53,
      {
        align: "center",
      }
    )

    pdf.setFont(
      "helvetica",
      "normal"
    )

    pdf.setFontSize(13)

    pdf.text(
      "Certificamos que",
      largura / 2,
      72,
      {
        align: "center",
      }
    )

    pdf.setFont(
      "helvetica",
      "bold"
    )

    pdf.setFontSize(22)

    pdf.text(
      certificado.usuario,
      largura / 2,
      88,
      {
        align: "center",
      }
    )

    pdf.setFont(
      "helvetica",
      "normal"
    )

    pdf.setFontSize(13)

    pdf.text(
      "concluiu com êxito o curso",
      largura / 2,
      103,
      {
        align: "center",
      }
    )

    pdf.setFont(
      "helvetica",
      "bold"
    )

    pdf.setFontSize(19)

    const tituloCurso =
      pdf.splitTextToSize(
        certificado.curso,
        largura - 80
      )

    pdf.text(
      tituloCurso,
      largura / 2,
      119,
      {
        align: "center",
      }
    )

    pdf.setFont(
      "helvetica",
      "normal"
    )

    pdf.setFontSize(11)

    pdf.text(
      `Certificado emitido em ${formatarData(
        certificado.dataEmissao
      )}`,
      largura / 2,
      148,
      {
        align: "center",
      }
    )

    pdf.setFontSize(10)

    pdf.text(
      "Código de verificação",
      largura / 2,
      168,
      {
        align: "center",
      }
    )

    pdf.setFont(
      "courier",
      "bold"
    )

    pdf.setFontSize(12)

    pdf.text(
      certificado.codigo,
      largura / 2,
      176,
      {
        align: "center",
      }
    )

    pdf.setFont(
      "helvetica",
      "normal"
    )

    pdf.setFontSize(8)

    pdf.text(
      "Este documento foi emitido eletronicamente pela Plataforma Academia.",
      largura / 2,
      altura - 20,
      {
        align: "center",
      }
    )

    const nomeArquivo =
      certificado.curso
        .replace(
          /[^a-zA-Z0-9À-ÿ]+/g,
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

  return (
    <div className="container mt-4 crud-page">
      <div className="crud-page-header">
        <h2>
          Certificados
        </h2>

        <p>
          Consulte os certificados
          emitidos pela plataforma.
        </p>
      </div>

      <div
        className={
          ehAdmin
            ? "crud-two-column"
            : ""
        }
      >
        {ehAdmin && (
          <div className="card crud-form-card">
            <h5>
              Emitir certificado
            </h5>

            <p className="text-muted small">
              Apenas matrículas com
              curso concluído podem
              receber certificado.
            </p>

            <div className="mb-3">
              <label className="form-label text-muted">
                Matrícula concluída
              </label>

              <select
                className="form-select"
                value={
                  matriculaSelecionada
                }
                onChange={(e) =>
                  setMatriculaSelecionada(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Selecione uma
                  matrícula
                </option>

                {matriculasElegiveis.map(
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
                        {usuario?.nome ??
                          `Usuário ${matricula.idUsuario}`}{" "}
                        -{" "}
                        {curso?.nome ??
                          `Curso ${matricula.idCurso}`}
                      </option>
                    )
                  }
                )}
              </select>
            </div>

            {matriculasElegiveis.length ===
              0 && (
              <div
                className="alert alert-secondary"
                style={{
                  fontSize:
                    "12px",
                }}
              >
                Não há matrículas
                concluídas aguardando
                emissão de
                certificado.
              </div>
            )}

            <div className="crud-form-actions">
              <button
                type="button"
                className="crud-btn crud-btn-primary"
                onClick={
                  emitirCertificado
                }
                disabled={
                  !matriculaSelecionada ||
                  emitindo
                }
              >
                <i className="bi bi-award" />

                {emitindo
                  ? " Emitindo..."
                  : " Emitir certificado"}
              </button>
            </div>
          </div>
        )}

        <div className="card crud-list-card">
          <div className="crud-list-header">
            <div>
              <h5>
                {ehAdmin
                  ? "Certificados emitidos"
                  : "Meus certificados"}
              </h5>

              <small className="text-muted">
                {certificados.length}{" "}
                certificado(s)
              </small>
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-muted">
              Carregando...
            </div>
          ) : certificados.length ===
            0 ? (
            <div className="p-4 text-center">
              <i className="bi bi-award fs-3 text-muted" />

              <p className="mt-2 mb-1">
                Nenhum certificado
                encontrado.
              </p>

              {!ehAdmin && (
                <small className="text-muted">
                  Seus certificados
                  aparecerão aqui após
                  a conclusão dos
                  cursos e a emissão.
                </small>
              )}
            </div>
          ) : (
            <div className="p-3">
              <div className="d-flex flex-column gap-3">
                {certificados.map(
                  (certificado) => (
                    <div
                      key={
                        certificado.id
                      }
                      className="card crud-item-card"
                    >
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <i className="bi bi-award" />

                            <strong>
                              {
                                certificado.curso
                              }
                            </strong>
                          </div>

                          {ehAdmin && (
                            <div className="text-muted small mb-1">
                              Aluno:{" "}
                              {
                                certificado.usuario
                              }
                            </div>
                          )}

                          {certificado.trilha && (
                            <div className="text-muted small mb-1">
                              Trilha:{" "}
                              {
                                certificado.trilha
                              }
                            </div>
                          )}

                          <div className="text-muted small mb-1">
                            Emissão:{" "}
                            {formatarData(
                              certificado.dataEmissao
                            )}
                          </div>

                          <div className="mt-2">
                            <small className="text-muted">
                              Código de
                              verificação
                            </small>

                            <div>
                              <code>
                                {
                                  certificado.codigo
                                }
                              </code>
                            </div>
                          </div>
                        </div>

                        <div className="crud-actions">
                          <button
                            type="button"
                            className="crud-btn crud-btn-primary crud-btn-icon"
                            title="Baixar certificado em PDF"
                            onClick={() =>
                              gerarPDF(
                                certificado
                              )
                            }
                          >
                            <i className="bi bi-file-earmark-pdf" />
                          </button>

                          {ehAdmin && (
                            <button
                              type="button"
                              className="crud-btn crud-btn-delete crud-btn-icon"
                              title="Excluir certificado"
                              onClick={() =>
                                excluirCertificado(
                                  certificado
                                )
                              }
                            >
                              <i className="bi bi-trash3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}