import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  createAvaliacao,
  deleteAvaliacao,
  getAvaliacoes,
  updateAvaliacao,
  type Avaliacao,
} from "../services/avaliacoesService"

import {
  getMatriculas,
  type Matricula,
} from "../services/matriculasService"

import {
  getCursos,
  type Curso,
} from "../services/cursosService"

import {
  getUsuarioLogado,
} from "../services/auth"

export default function Avaliacoes() {
  const usuario = getUsuarioLogado()

  const ehAluno =
    usuario?.perfil === "ALUNO"

  const ehProfessor =
    usuario?.perfil === "PROFESSOR"

  const ehAdmin =
    usuario?.perfil === "ADMIN"

  const [avaliacoes, setAvaliacoes] =
    useState<Avaliacao[]>([])

  const [matriculas, setMatriculas] =
    useState<Matricula[]>([])

  const [cursos, setCursos] =
    useState<Curso[]>([])

  const [idCurso, setIdCurso] =
    useState("")

  const [nota, setNota] =
    useState("5")

  const [comentario, setComentario] =
    useState("")

  const [editando, setEditando] =
    useState<Avaliacao | null>(null)

  const [erro, setErro] =
    useState("")

  const [carregando, setCarregando] =
    useState(true)

  async function carregarDados() {
    try {
      setCarregando(true)
      setErro("")

      if (ehAluno) {
        const [
          avaliacoesResponse,
          matriculasResponse,
          cursosResponse,
        ] = await Promise.all([
          getAvaliacoes(),
          getMatriculas(),
          getCursos(),
        ])

        setAvaliacoes(
          avaliacoesResponse.data,
        )

        setMatriculas(
          matriculasResponse.data,
        )

        setCursos(
          cursosResponse.data,
        )

        return
      }

      const avaliacoesResponse =
        await getAvaliacoes()

      setAvaliacoes(
        avaliacoesResponse.data,
      )
    } catch (error) {
      console.error(error)

      setErro(
        "Não foi possível carregar as avaliações.",
      )
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    void carregarDados()
  }, [])

  const cursosDisponiveis =
    useMemo(() => {
      if (!ehAluno || !usuario) {
        return []
      }

      const idsAvaliados = new Set(
        avaliacoes.map(
          (avaliacao) =>
            avaliacao.idCurso,
        ),
      )

      const idsMatriculados =
        new Set(
          matriculas
            .filter(
              (matricula) =>
                matricula.idUsuario ===
                String(usuario.sub),
            )
            .map(
              (matricula) =>
                matricula.idCurso,
            ),
        )

      return cursos.filter(
        (curso) =>
          idsMatriculados.has(
            curso.id,
          ) &&
          !idsAvaliados.has(
            curso.id,
          ),
      )
    }, [
      avaliacoes,
      cursos,
      ehAluno,
      matriculas,
      usuario,
    ])

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault()

    if (!usuario || !ehAluno) {
      return
    }

    try {
      setErro("")

      if (editando) {
        await updateAvaliacao(
          editando.id,
          {
            nota: Number(nota),
            comentario,
          },
        )
      } else {
        if (!idCurso) {
          setErro(
            "Selecione um curso.",
          )
          return
        }

        await createAvaliacao({
          idUsuario: String(
            usuario.sub,
          ),
          idCurso,
          nota: Number(nota),
          comentario,
        })
      }

      limparFormulario()

      await carregarDados()
    } catch (error) {
      console.error(error)

      setErro(
        "Não foi possível salvar a avaliação.",
      )
    }
  }

  function iniciarEdicao(
    avaliacao: Avaliacao,
  ) {
    setEditando(avaliacao)
    setIdCurso(avaliacao.idCurso)
    setNota(String(avaliacao.nota))
    setComentario(
      avaliacao.comentario,
    )
  }

  function limparFormulario() {
    setEditando(null)
    setIdCurso("")
    setNota("5")
    setComentario("")
  }

  async function handleExcluir(
    avaliacao: Avaliacao,
  ) {
    if (
      !window.confirm(
        "Deseja realmente excluir esta avaliação?",
      )
    ) {
      return
    }

    try {
      setErro("")

      await deleteAvaliacao(
        avaliacao.id,
      )

      if (
        editando?.id === avaliacao.id
      ) {
        limparFormulario()
      }

      await carregarDados()
    } catch (error) {
      console.error(error)

      setErro(
        "Não foi possível excluir a avaliação.",
      )
    }
  }

  function estrelas(nota: number) {
    return Array.from(
      { length: 5 },
      (_, indice) =>
        indice < nota ? "★" : "☆",
    ).join("")
  }

  if (carregando) {
    return (
      <div className="crud-page">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="crud-page">
      <div className="crud-page-header">
        <div>
          <h1>Avaliações</h1>

          <p>
            {ehAluno &&
              "Avalie os cursos em que você está matriculado."}

            {ehProfessor &&
              "Veja as avaliações recebidas nos seus cursos."}

            {ehAdmin &&
              "Acompanhe as avaliações da plataforma."}
          </p>
        </div>
      </div>

      {erro && (
        <div className="alert alert-danger">
          {erro}
        </div>
      )}

      <div
        className={
          ehAluno
            ? "crud-two-column"
            : ""
        }
      >
        {ehAluno && (
          <div className="crud-form-card">
            <h2>
              {editando
                ? "Editar avaliação"
                : "Nova avaliação"}
            </h2>

            <form
              onSubmit={handleSubmit}
            >
              <div className="mb-3">
                <label className="form-label">
                  Curso
                </label>

                {editando ? (
                  <input
                    className="form-control"
                    value={
                      editando.curso
                    }
                    disabled
                  />
                ) : (
                  <select
                    className="form-select"
                    value={idCurso}
                    onChange={(e) =>
                      setIdCurso(
                        e.target.value,
                      )
                    }
                    required
                  >
                    <option value="">
                      Selecione
                    </option>

                    {cursosDisponiveis.map(
                      (curso) => (
                        <option
                          key={curso.id}
                          value={curso.id}
                        >
                          {curso.nome}
                        </option>
                      ),
                    )}
                  </select>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Nota
                </label>

                <select
                  className="form-select"
                  value={nota}
                  onChange={(e) =>
                    setNota(
                      e.target.value,
                    )
                  }
                >
                  <option value="5">
                    5 - Excelente
                  </option>
                  <option value="4">
                    4 - Muito bom
                  </option>
                  <option value="3">
                    3 - Bom
                  </option>
                  <option value="2">
                    2 - Regular
                  </option>
                  <option value="1">
                    1 - Ruim
                  </option>
                  <option value="0">
                    0 - Péssimo
                  </option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Comentário
                </label>

                <textarea
                  className="form-control"
                  rows={4}
                  value={comentario}
                  onChange={(e) =>
                    setComentario(
                      e.target.value,
                    )
                  }
                  placeholder="Conte como foi sua experiência..."
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="crud-btn"
                >
                  {editando
                    ? "Salvar alterações"
                    : "Avaliar curso"}
                </button>

                {editando && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={
                      limparFormulario
                    }
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="crud-list-card">
          <h2>
            {ehAluno
              ? "Minhas avaliações"
              : "Avaliações recebidas"}
          </h2>

          {avaliacoes.length === 0 ? (
            <p>
              Nenhuma avaliação encontrada.
            </p>
          ) : (
            avaliacoes.map(
              (avaliacao) => (
                <div
                  key={avaliacao.id}
                  className="card mb-3"
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between gap-3">
                      <div>
                        <h3 className="h5 mb-1">
                          {avaliacao.curso}
                        </h3>

                        {!ehAluno && (
                          <small>
                            Avaliado por:{" "}
                            {
                              avaliacao.usuario
                            }
                          </small>
                        )}
                      </div>

                      <strong
                        title={`${avaliacao.nota}/5`}
                      >
                        {estrelas(
                          avaliacao.nota,
                        )}
                      </strong>
                    </div>

                    {avaliacao.comentario && (
                      <p className="mt-3 mb-2">
                        {
                          avaliacao.comentario
                        }
                      </p>
                    )}

                    <small>
                      {new Date(
                        avaliacao.dataAvaliacao,
                      ).toLocaleDateString(
                        "pt-BR",
                      )}
                    </small>

                    {(ehAluno ||
                      ehAdmin) && (
                      <div className="d-flex gap-2 mt-3">
                        {ehAluno && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                              iniciarEdicao(
                                avaliacao,
                              )
                            }
                          >
                            Editar
                          </button>
                        )}

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() =>
                            handleExcluir(
                              avaliacao,
                            )
                          }
                        >
                          Excluir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ),
            )
          )}
        </div>
      </div>
    </div>
  )
}