import { useEffect, useState } from "react"

import {
  getUsuarios,
  type Usuario,
} from "../services/usuariosService"

import {
  getCursos,
  type Curso,
  type Aula,
} from "../services/cursosService"

import {
  getMatriculas,
  createMatricula,
  updateMatricula,
  deleteMatricula,
  type Matricula,
} from "../services/matriculasService"

import {
  getProgressos,
  createProgresso,
  deleteProgresso,
  type Progresso,
} from "../services/progressosService"

import { getUsuarioLogado } from "../services/auth"

export default function Matriculas() {
  const usuarioLogado = getUsuarioLogado()
  const perfil = usuarioLogado?.perfil
  const ehAdmin = perfil === "ADMIN"

  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [progressos, setProgressos] = useState<Progresso[]>([])

  const [idUsuario, setIdUsuario] = useState("")
  const [idCurso, setIdCurso] = useState("")
  const [loading, setLoading] = useState(true)

  const [matriculaAberta, setMatriculaAberta] =
    useState<string | null>(null)

  async function carregarDados() {
    try {
      const [
        cursosResponse,
        matriculasResponse,
        progressosResponse,
      ] = await Promise.all([
        getCursos(),
        getMatriculas(),
        getProgressos(),
      ])

      setCursos(cursosResponse.data)
      setMatriculas(matriculasResponse.data)
      setProgressos(progressosResponse.data)

      if (ehAdmin) {
        const usuariosResponse = await getUsuarios()
        setUsuarios(usuariosResponse.data)
      }
    } catch (error) {
      console.error(
        "Erro ao carregar matrículas:",
        error
      )

      alert(
        "Não foi possível carregar os dados das matrículas."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  function buscarUsuario(id: string) {
    if (!ehAdmin) {
      return usuarioLogado?.email || "Aluno"
    }

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

  function obterTodasAulas(curso?: Curso) {
    if (!curso) {
      return []
    }

    return curso.modulos.flatMap(
      (modulo) => modulo.aulas
    )
  }

  function idsAulasDoCurso(cursoId: string) {
    const curso = buscarCurso(cursoId)

    return new Set(
      obterTodasAulas(curso).map(
        (aula) => String(aula.id)
      )
    )
  }

  function progressoPertenceMatricula(
    progresso: Progresso,
    matricula: Matricula
  ) {
    if (
      String(progresso.idUsuario) !==
      String(matricula.idUsuario)
    ) {
      return false
    }

    const idsAulas =
      idsAulasDoCurso(matricula.idCurso)

    return idsAulas.has(
      String(progresso.idAula)
    )
  }

  function obterProgressosMatricula(
    matricula: Matricula,
    lista = progressos
  ) {
    return lista.filter((progresso) =>
      progressoPertenceMatricula(
        progresso,
        matricula
      )
    )
  }

  function calcularProgresso(
    matricula: Matricula
  ) {
    const curso = buscarCurso(
      matricula.idCurso
    )

    const aulas = obterTodasAulas(curso)

    const concluidas =
      obterProgressosMatricula(
        matricula
      ).filter(
        (progresso) =>
          progresso.status === "CONCLUIDO"
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
      percentual,
    }
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
          String(aulaId) &&
        progresso.status === "CONCLUIDO"
    )
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    const usuarioMatricula =
      ehAdmin
        ? idUsuario
        : String(usuarioLogado?.sub ?? "")

    if (!usuarioMatricula || !idCurso) {
      alert(
        ehAdmin
          ? "Selecione um usuário e um curso."
          : "Selecione um curso."
      )
      return
    }

    const existente = matriculas.some(
      (matricula) =>
        String(matricula.idUsuario) ===
          String(usuarioMatricula) &&
        String(matricula.idCurso) ===
          String(idCurso)
    )

    if (existente) {
      alert(
        "Este usuário já está matriculado neste curso."
      )
      return
    }

    try {
      await createMatricula({
        idUsuario: usuarioMatricula,
        idCurso,
      })

      setIdUsuario("")
      setIdCurso("")

      await carregarDados()
    } catch (error) {
      console.error(
        "Erro ao realizar matrícula:",
        error
      )

      alert(
        "Não foi possível realizar a matrícula."
      )
    }
  }

  async function handleDelete(
    matricula: Matricula
  ) {
    if (!ehAdmin) {
      return
    }

    if (
      !window.confirm(
        "Deseja realmente cancelar esta matrícula? O progresso deste aluno no curso também será removido."
      )
    ) {
      return
    }

    try {
      const progressosDaMatricula =
        obterProgressosMatricula(matricula)

      for (const progresso of progressosDaMatricula) {
        await deleteProgresso(
          progresso.idUsuario,
          progresso.idAula
        )
      }

      await deleteMatricula(matricula.id)

      if (
        matriculaAberta === matricula.id
      ) {
        setMatriculaAberta(null)
      }

      await carregarDados()
    } catch (error) {
      console.error(
        "Erro ao cancelar matrícula:",
        error
      )

      alert(
        "Não foi possível cancelar a matrícula."
      )
    }
  }

  async function atualizarConclusaoMatricula(
    matricula: Matricula,
    novosProgressos: Progresso[]
  ) {
    if (!ehAdmin) {
      return
    }

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
          progressoPertenceMatricula(
            progresso,
            matricula
          ) &&
          progresso.status === "CONCLUIDO"
      ).length

    const terminou =
      aulas.length > 0 &&
      concluidas === aulas.length

    const novaDataConclusao = terminou
      ? matricula.dataConclusao ||
        new Date().toISOString()
      : null

    if (
      (matricula.dataConclusao || null) !==
      novaDataConclusao
    ) {
      await updateMatricula(
        matricula.id,
        {
          dataConclusao: novaDataConclusao,
        }
      )

      setMatriculas((atuais) =>
        atuais.map((item) =>
          item.id === matricula.id
            ? {
                ...item,
                dataConclusao:
                  novaDataConclusao,
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
        String(progresso.idAula) ===
          String(aula.id)
    )

    try {
      let novosProgressos: Progresso[]

      if (existente) {
        if (!ehAdmin) {
          alert(
            "A conclusão registrada não pode ser removida pelo aluno."
          )
          return
        }

        await deleteProgresso(
          existente.idUsuario,
          existente.idAula
        )

        novosProgressos =
          progressos.filter(
            (progresso) =>
              !(
                String(
                  progresso.idUsuario
                ) ===
                  String(
                    existente.idUsuario
                  ) &&
                String(
                  progresso.idAula
                ) ===
                  String(existente.idAula)
              )
          )
      } else {
        const response =
          await createProgresso({
            idUsuario:
              String(matricula.idUsuario),
            idAula: String(aula.id),
            dataConclusao:
              new Date().toISOString(),
            status: "CONCLUIDO",
          })

        novosProgressos = [
          ...progressos,
          response.data,
        ]
      }

      setProgressos(novosProgressos)

      await atualizarConclusaoMatricula(
        matricula,
        novosProgressos
      )
    } catch (error) {
      console.error(
        "Erro ao atualizar progresso:",
        error
      )

      alert(
        "Não foi possível atualizar o progresso desta aula."
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

    if (Number.isNaN(valor.getTime())) {
      return data
    }

    return valor.toLocaleDateString(
      "pt-BR"
    )
  }

  return (
    <div className="container mt-4 crud-page">
      <div className="crud-page-header">
        <h2>Matrículas</h2>

        <p>
          {ehAdmin
            ? "Gerencie matrículas e acompanhe o progresso dos alunos nos cursos."
            : "Acompanhe seus cursos e registre seu progresso nas aulas."}
        </p>
      </div>

      <div className="crud-two-column">
        <div className="card crud-form-card">
          <h5>
            {ehAdmin
              ? "Nova matrícula"
              : "Matricular-se em um curso"}
          </h5>

          <form onSubmit={handleSubmit}>
            {ehAdmin && (
              <div className="mb-3">
                <label className="form-label text-muted">
                  Usuário
                </label>

                <select
                  className="form-select"
                  value={idUsuario}
                  onChange={(e) =>
                    setIdUsuario(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Selecione um usuário
                  </option>

                  {usuarios.map(
                    (usuario) => (
                      <option
                        key={usuario.id}
                        value={usuario.id}
                      >
                        {usuario.nome}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

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
                <i className="bi bi-plus-lg" />
                Matricular
              </button>
            </div>
          </form>
        </div>

        <div className="card crud-list-card">
          <div className="crud-list-header">
            <h5>
              {ehAdmin
                ? "Matrículas cadastradas"
                : "Meus cursos"}
            </h5>

            <small className="text-muted">
              {matriculas.length} matrícula(s)
            </small>
          </div>

          {loading ? (
            <div className="p-4 text-center text-muted">
              Carregando...
            </div>
          ) : matriculas.length === 0 ? (
            <div className="p-4 text-center">
              <i className="bi bi-journal-bookmark fs-3 text-muted" />

              <p className="mt-2 mb-0">
                Nenhuma matrícula encontrada.
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
                        <div className="d-flex justify-content-between align-items-start gap-3">
                          <div>
                            <strong>
                              {curso?.nome ||
                                "Curso não encontrado"}
                            </strong>

                            {ehAdmin && (
                              <div className="text-muted small mt-1">
                                <i className="bi bi-person me-1" />
                                {buscarUsuario(
                                  matricula.idUsuario
                                )}
                              </div>
                            )}

                            <div className="text-muted small mt-1">
                              Matrícula:{" "}
                              {formatarData(
                                matricula.dataMatricula
                              )}
                            </div>

                            {matricula.dataConclusao && (
                              <div className="text-muted small mt-1">
                                Conclusão:{" "}
                                {formatarData(
                                  matricula.dataConclusao
                                )}
                              </div>
                            )}
                          </div>

                          <div className="crud-actions">
                            <button
                              type="button"
                              className="crud-btn crud-btn-secondary crud-btn-icon"
                              title="Ver progresso"
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
                              />
                            </button>

                            {ehAdmin && (
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
                                <i className="bi bi-trash3" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="d-flex justify-content-between small mb-1">
                            <span className="text-muted">
                              Progresso
                            </span>

                            <span>
                              {progresso.concluidas}/
                              {progresso.total} (
                              {progresso.percentual}
                              %)
                            </span>
                          </div>

                          <div
                            className="progress"
                            style={{
                              height: "7px",
                            }}
                          >
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{
                                width: `${progresso.percentual}%`,
                              }}
                              aria-valuenow={
                                progresso.percentual
                              }
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                        </div>

                        {aberta && (
                          <div className="mt-4">
                            {!curso ||
                            curso.modulos.length ===
                              0 ? (
                              <p className="text-muted small mb-0">
                                Este curso ainda não
                                possui módulos e aulas.
                              </p>
                            ) : (
                              <div className="d-flex flex-column gap-3">
                                {curso.modulos.map(
                                  (
                                    modulo,
                                    moduloIndex
                                  ) => (
                                    <div
                                      key={
                                        modulo.id
                                      }
                                    >
                                      <strong
                                        style={{
                                          fontSize:
                                            "13px",
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

                                      <div className="mt-2">
                                        {modulo.aulas
                                          .length ===
                                        0 ? (
                                          <small className="text-muted">
                                            Nenhuma
                                            aula neste
                                            módulo.
                                          </small>
                                        ) : (
                                          modulo.aulas.map(
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
                                                  className="d-flex justify-content-between align-items-center py-2 border-top"
                                                >
                                                  <div>
                                                    <span
                                                      style={{
                                                        fontSize:
                                                          "12px",
                                                      }}
                                                    >
                                                      Aula{" "}
                                                      {aulaIndex +
                                                        1}
                                                      :{" "}
                                                      {
                                                        aula.titulo
                                                      }
                                                    </span>

                                                    {concluida && (
                                                      <div className="text-muted small">
                                                        Concluída
                                                      </div>
                                                    )}
                                                  </div>

                                                  <button
                                                    type="button"
                                                    className={
                                                      concluida
                                                        ? "crud-btn crud-btn-secondary"
                                                        : "crud-btn crud-btn-primary"
                                                    }
                                                    disabled={
                                                      concluida &&
                                                      !ehAdmin
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
                                                          ? "bi-check-circle-fill"
                                                          : "bi-circle"
                                                      }`}
                                                    />

                                                    {concluida
                                                      ? " Concluída"
                                                      : " Concluir"}
                                                  </button>
                                                </div>
                                              )
                                            }
                                          )
                                        )}
                                      </div>
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