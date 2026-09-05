import { useEffect, useState } from "react"

import { getUsuarios } from "../services/usuariosService"
import { getCursos } from "../services/cursosService"

import {
  getMatriculas,
  createMatricula,
  updateMatricula,
  deleteMatricula,
  type Matricula
} from "../services/matriculasService"

import {
  getProgressos,
  createProgresso,
  deleteProgresso,
  type Progresso
} from "../services/progressosService"

type Usuario = {
  id: string
  nome: string
}

type Aula = {
  id: string
  titulo: string
}

type Modulo = {
  id: string
  titulo: string
  aulas: Aula[]
}

type Curso = {
  id: string
  nome: string
  modulos?: Modulo[]
}

export default function Matriculas() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [progressos, setProgressos] = useState<Progresso[]>([])

  const [idUsuario, setIdUsuario] = useState("")
  const [idCurso, setIdCurso] = useState("")

  const [loading, setLoading] = useState(true)

  const [matriculaAberta, setMatriculaAberta] =
    useState<string | null>(null)

  function carregarDados() {
    
    Promise.all([
      getUsuarios(),
      getCursos(),
      getMatriculas(),
      getProgressos()
    ])
      .then(
        ([
          usuariosResponse,
          cursosResponse,
          matriculasResponse,
          progressosResponse
        ]) => {
          setUsuarios(usuariosResponse.data)
          setCursos(cursosResponse.data)
          setMatriculas(matriculasResponse.data)
          setProgressos(progressosResponse.data)
        }
      )
      .catch(() => {
        alert(
          "Não foi possível carregar os dados das matrículas."
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
  // MATRÍCULA
  // =========================================================

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!idUsuario || !idCurso) {
      alert("Selecione um usuário e um curso.")
      return
    }

    const matriculaExistente = matriculas.some(
      (matricula) =>
        String(matricula.idUsuario) ===
          String(idUsuario) &&
        String(matricula.idCurso) ===
          String(idCurso)
    )

    if (matriculaExistente) {
      alert(
        "Este usuário já está matriculado neste curso."
      )
      return
    }

    createMatricula({
      idUsuario,
      idCurso,
      dataMatricula:
        new Date().toLocaleDateString("pt-BR"),
      dataConclusao: null
    })
      .then(() => {
        setIdUsuario("")
        setIdCurso("")
        carregarDados()
      })
      .catch(() => {
        alert("Não foi possível realizar a matrícula.")
      })
  }

  async function handleDelete(
    matricula: Matricula
  ) {
    if (
      !window.confirm(
        "Deseja realmente cancelar esta matrícula? O progresso do aluno neste curso também será removido."
      )
    ) {
      return
    }

    try {
      const progressosDaMatricula =
        progressos.filter(
          (progresso) =>
            String(progresso.idUsuario) ===
              String(matricula.idUsuario) &&
            String(progresso.idCurso) ===
              String(matricula.idCurso)
        )

      await Promise.all(
        progressosDaMatricula.map((progresso) =>
          deleteProgresso(progresso.id)
        )
      )

      await deleteMatricula(matricula.id)

      setProgressos((atuais) =>
        atuais.filter(
          (progresso) =>
            !(
              String(progresso.idUsuario) ===
                String(matricula.idUsuario) &&
              String(progresso.idCurso) ===
                String(matricula.idCurso)
            )
        )
      )

      setMatriculas((atuais) =>
        atuais.filter(
          (item) => item.id !== matricula.id
        )
      )

      if (matriculaAberta === matricula.id) {
        setMatriculaAberta(null)
      }
    } catch {
      alert(
        "Não foi possível cancelar a matrícula."
      )
    }
  }

  // =========================================================
  // BUSCAS
  // =========================================================

  function buscarUsuario(id: string) {
    return (
      usuarios.find(
        (usuario) =>
          String(usuario.id) === String(id)
      )?.nome || "Usuário não encontrado"
    )
  }

  function buscarCurso(id: string) {
    return cursos.find(
      (curso) =>
        String(curso.id) === String(id)
    )
  }

  // =========================================================
  // PROGRESSO
  // =========================================================

  function obterTodasAulas(curso: Curso) {
    return (curso.modulos || []).flatMap(
      (modulo) => modulo.aulas || []
    )
  }

  function obterProgressosMatricula(
    matricula: Matricula
  ) {
    return progressos.filter(
      (progresso) =>
        String(progresso.idUsuario) ===
          String(matricula.idUsuario) &&
        String(progresso.idCurso) ===
          String(matricula.idCurso)
    )
  }

  function aulaConcluida(
    matricula: Matricula,
    aulaId: string
  ) {
    return obterProgressosMatricula(
      matricula
    ).some(
      (progresso) =>
        String(progresso.idAula) ===
        String(aulaId)
    )
  }

  function calcularProgresso(
    matricula: Matricula
  ) {
    const curso = buscarCurso(
      matricula.idCurso
    )

    if (!curso) {
      return {
        total: 0,
        concluidas: 0,
        percentual: 0
      }
    }

    const aulas = obterTodasAulas(curso)

    const concluidas =
      obterProgressosMatricula(
        matricula
      ).filter((progresso) =>
        aulas.some(
          (aula) =>
            String(aula.id) ===
            String(progresso.idAula)
        )
      ).length

    const percentual =
      aulas.length === 0
        ? 0
        : Math.round(
            (concluidas / aulas.length) * 100
          )

    return {
      total: aulas.length,
      concluidas,
      percentual
    }
  }

  async function atualizarConclusaoMatricula(
    matricula: Matricula,
    novosProgressos: Progresso[]
  ) {
    const curso = buscarCurso(
      matricula.idCurso
    )

    if (!curso) {
      return
    }

    const aulas = obterTodasAulas(curso)

    const concluidas =
      novosProgressos.filter(
        (progresso) =>
          String(progresso.idUsuario) ===
            String(matricula.idUsuario) &&
          String(progresso.idCurso) ===
            String(matricula.idCurso) &&
          aulas.some(
            (aula) =>
              String(aula.id) ===
              String(progresso.idAula)
          )
      ).length

    const terminou =
      aulas.length > 0 &&
      concluidas === aulas.length

    const novaDataConclusao = terminou
      ? matricula.dataConclusao ||
        new Date().toLocaleDateString("pt-BR")
      : null

    if (
      (matricula.dataConclusao || null) !==
      novaDataConclusao
    ) {
      await updateMatricula(
        matricula.id,
        {
          dataConclusao: novaDataConclusao
        }
      )

      setMatriculas((atuais) =>
        atuais.map((item) =>
          item.id === matricula.id
            ? {
                ...item,
                dataConclusao:
                  novaDataConclusao
              }
            : item
        )
      )
    }
  }

  async function alternarAula(
    matricula: Matricula,
    aula: Aula
  ) {
    const existente = progressos.find(
      (progresso) =>
        String(progresso.idUsuario) ===
          String(matricula.idUsuario) &&
        String(progresso.idCurso) ===
          String(matricula.idCurso) &&
        String(progresso.idAula) ===
          String(aula.id)
    )

    try {
      let novosProgressos: Progresso[]

      if (existente) {
        await deleteProgresso(
          existente.id
        )

        novosProgressos =
          progressos.filter(
            (progresso) =>
              progresso.id !== existente.id
          )
      } else {
        const response =
          await createProgresso({
            idUsuario:
              String(matricula.idUsuario),
            idCurso:
              String(matricula.idCurso),
            idAula: String(aula.id),
            dataConclusao:
              new Date().toLocaleDateString(
                "pt-BR"
              )
          })

        novosProgressos = [
          ...progressos,
          response.data
        ]
      }

      setProgressos(novosProgressos)

      await atualizarConclusaoMatricula(
        matricula,
        novosProgressos
      )
    } catch {
      alert(
        "Não foi possível atualizar o progresso desta aula."
      )
    }
  }

  // =========================================================
  // INTERFACE
  // =========================================================

  return (
    <div className="container mt-4 crud-page">

      <div className="crud-page-header">
        <h2>Matrículas</h2>

        <p>
          Gerencie matrículas e acompanhe o
          progresso dos alunos nos cursos.
        </p>
      </div>

      <div className="crud-two-column">

        {/* FORMULÁRIO */}
        <div className="card crud-form-card">

          <h5>Nova matrícula</h5>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <label className="form-label text-muted">
                Usuário
              </label>

              <select
                className="form-select"
                value={idUsuario}
                onChange={(e) =>
                  setIdUsuario(e.target.value)
                }
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
                value={idCurso}
                onChange={(e) =>
                  setIdCurso(e.target.value)
                }
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
                type="submit"
                className="crud-btn crud-btn-primary"
              >
                <i className="bi bi-plus-lg"></i>
                Cadastrar matrícula
              </button>

            </div>

          </form>

        </div>

        {/* LISTAGEM */}
        <div className="card crud-list-card">

          <div className="crud-list-header">

            <h5>Matrículas cadastradas</h5>

            <small className="text-muted">
              Acompanhe cursos e progresso dos
              alunos
            </small>

          </div>

          {loading ? (

            <div className="p-4 text-center text-muted">
              Carregando...
            </div>

          ) : matriculas.length === 0 ? (

            <div className="p-4 text-center">

              <i className="bi bi-person-check fs-3 text-muted"></i>

              <p className="mt-2 mb-0">
                Nenhuma matrícula cadastrada.
              </p>

            </div>

          ) : (

            <div className="p-3">

              <div className="d-flex flex-column gap-3">

                {matriculas.map(
                  (matricula) => {

                    const curso =
                      buscarCurso(
                        matricula.idCurso
                      )

                    const progresso =
                      calcularProgresso(
                        matricula
                      )

                    const aberta =
                      matriculaAberta ===
                      matricula.id

                    return (
                      <div
                        key={matricula.id}
                        className="card p-3"
                      >

                        {/* RESUMO */}
                        <div className="d-flex justify-content-between align-items-start gap-3">

                          <div className="flex-grow-1">

                            <div className="d-flex align-items-center gap-2 mb-1">

                              <div
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "8px",
                                  background:
                                    "rgba(124, 63, 70, 0.18)",
                                  color:
                                    "var(--wine-light)"
                                }}
                              >
                                <i className="bi bi-person"></i>
                              </div>

                              <div>
                                <strong>
                                  {buscarUsuario(
                                    matricula.idUsuario
                                  )}
                                </strong>

                                <div className="text-muted small">
                                  {curso?.nome ||
                                    "Curso não encontrado"}
                                </div>
                              </div>

                            </div>

                            <div className="mt-3">

                              <div className="d-flex justify-content-between mb-1">

                                <small className="text-muted">
                                  Progresso
                                </small>

                                <small>
                                  {
                                    progresso.concluidas
                                  }
                                  /
                                  {progresso.total} aulas
                                  ·{" "}
                                  <strong>
                                    {
                                      progresso.percentual
                                    }
                                    %
                                  </strong>
                                </small>

                              </div>

                              <div
                                className="progress"
                                style={{
                                  height: "7px",
                                  background:
                                    "var(--surface-3)"
                                }}
                              >
                                <div
                                  className="progress-bar"
                                  style={{
                                    width: `${progresso.percentual}%`,
                                    background:
                                      "var(--wine-light)"
                                  }}
                                />
                              </div>

                              <div className="d-flex gap-3 mt-2">

                                <small className="text-muted">
                                  Matrícula:{" "}
                                  {
                                    matricula.dataMatricula
                                  }
                                </small>

                                {matricula.dataConclusao && (
                                  <small
                                    style={{
                                      color:
                                        "var(--color-success)"
                                    }}
                                  >
                                    <i className="bi bi-check-circle me-1"></i>
                                    Concluído em{" "}
                                    {
                                      matricula.dataConclusao
                                    }
                                  </small>
                                )}

                              </div>

                            </div>

                          </div>

                          <div className="crud-actions">

                            <button
                              type="button"
                              className="crud-btn crud-btn-secondary crud-btn-icon"
                              title={
                                aberta
                                  ? "Fechar progresso"
                                  : "Ver progresso"
                              }
                              onClick={() =>
                                setMatriculaAberta(
                                  aberta
                                    ? null
                                    : matricula.id
                                )
                              }
                            >
                              <i
                                className={`bi ${
                                  aberta
                                    ? "bi-chevron-up"
                                    : "bi-chevron-down"
                                }`}
                              ></i>
                            </button>

                            <button
                              type="button"
                              className="crud-btn crud-btn-delete crud-btn-icon"
                              title="Cancelar matrícula"
                              onClick={() =>
                                handleDelete(
                                  matricula
                                )
                              }
                            >
                              <i className="bi bi-trash3"></i>
                            </button>

                          </div>

                        </div>

                        {/* DETALHAMENTO */}
                        {aberta && (

                          <div
                            className="mt-4 pt-3"
                            style={{
                              borderTop:
                                "1px solid var(--border)"
                            }}
                          >

                            {!curso ? (

                              <p className="text-muted mb-0">
                                Curso não encontrado.
                              </p>

                            ) : (
                              curso.modulos || []
                            ).length === 0 ? (

                              <div className="text-center py-3">

                                <i className="bi bi-journal-x fs-4 text-muted"></i>

                                <p className="text-muted mt-2 mb-0">
                                  Este curso ainda não
                                  possui módulos e aulas.
                                </p>

                              </div>

                            ) : (

                              <div className="d-flex flex-column gap-3">

                                {(curso.modulos || []).map(
                                  (
                                    modulo,
                                    moduloIndex
                                  ) => (

                                    <div
                                      key={
                                        modulo.id
                                      }
                                    >

                                      <div className="mb-2">

                                        <strong
                                          style={{
                                            fontSize:
                                              "13px"
                                          }}
                                        >
                                          Módulo{" "}
                                          {moduloIndex +
                                            1}
                                          :{" "}
                                          {
                                            modulo.titulo
                                          }
                                        </strong>

                                      </div>

                                      {(modulo.aulas ||
                                        []).length ===
                                      0 ? (

                                        <small className="text-muted">
                                          Nenhuma aula
                                          cadastrada neste
                                          módulo.
                                        </small>

                                      ) : (

                                        <div className="d-flex flex-column gap-2">

                                          {modulo.aulas.map(
                                            (
                                              aula,
                                              aulaIndex
                                            ) => {

                                              const concluida =
                                                aulaConcluida(
                                                  matricula,
                                                  aula.id
                                                )

                                              return (
                                                <div
                                                  key={
                                                    aula.id
                                                  }
                                                  className="d-flex justify-content-between align-items-center gap-3"
                                                  style={{
                                                    padding:
                                                      "10px 12px",
                                                    border:
                                                      "1px solid var(--border)",
                                                    borderRadius:
                                                      "8px",
                                                    background:
                                                      concluida
                                                        ? "rgba(124, 63, 70, 0.10)"
                                                        : "var(--surface)"
                                                  }}
                                                >

                                                  <div className="d-flex align-items-center gap-2">

                                                    <i
                                                      className={`bi ${
                                                        concluida
                                                          ? "bi-check-circle-fill"
                                                          : "bi-play-circle"
                                                      }`}
                                                      style={{
                                                        color:
                                                          concluida
                                                            ? "var(--wine-light)"
                                                            : "var(--text-muted)"
                                                      }}
                                                    ></i>

                                                    <div>

                                                      <div
                                                        style={{
                                                          fontSize:
                                                            "12px"
                                                        }}
                                                      >
                                                        Aula{" "}
                                                        {aulaIndex +
                                                          1}
                                                        :{" "}
                                                        {
                                                          aula.titulo
                                                        }
                                                      </div>

                                                      <small className="text-muted">
                                                        {concluida
                                                          ? "Aula concluída"
                                                          : "Pendente"}
                                                      </small>

                                                    </div>

                                                  </div>

                                                  <button
                                                    type="button"
                                                    className={
                                                      concluida
                                                        ? "crud-btn crud-btn-secondary"
                                                        : "crud-btn crud-btn-primary"
                                                    }
                                                    onClick={() =>
                                                      alternarAula(
                                                        matricula,
                                                        aula
                                                      )
                                                    }
                                                  >
                                                    <i
                                                      className={`bi ${
                                                        concluida
                                                          ? "bi-arrow-counterclockwise"
                                                          : "bi-check-lg"
                                                      }`}
                                                    ></i>

                                                    {concluida
                                                      ? "Desmarcar"
                                                      : "Concluir"}
                                                  </button>

                                                </div>
                                              )
                                            }
                                          )}

                                        </div>

                                      )}

                                    </div>

                                  )
                                )}

                              </div>

                            )}

                          </div>

                        )}

                      </div>
                    )
                  }
                )}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}