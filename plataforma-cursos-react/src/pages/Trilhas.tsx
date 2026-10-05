import { useEffect, useState } from "react"

import {
  getCursos,
  type Curso,
} from "../services/cursosService"

import {
  getCategorias,
  type Categoria,
} from "../services/categoriasService"

import {
  createTrilha,
  deleteTrilha,
  getTrilhas,
  updateTrilha,
  type Trilha,
} from "../services/trilhasService"

import {
  createTrilhaCurso,
  deleteTrilhaCurso,
  updateTrilhaCurso,
} from "../services/trilhasCursosService"

import { getUsuarioLogado } from "../services/auth"

export default function Trilhas() {
  const usuarioLogado =
    getUsuarioLogado()

  const ehAdmin =
    usuarioLogado?.perfil === "ADMIN"

  const [trilhas, setTrilhas] =
    useState<Trilha[]>([])

  const [cursos, setCursos] =
    useState<Curso[]>([])

  const [categorias, setCategorias] =
    useState<Categoria[]>([])

  const [loading, setLoading] =
    useState(true)

  const [titulo, setTitulo] =
    useState("")

  const [descricao, setDescricao] =
    useState("")

  const [idCategoria, setIdCategoria] =
    useState("")

  const [
    cursosSelecionados,
    setCursosSelecionados,
  ] = useState<string[]>([])

  const [editando, setEditando] =
    useState<string | null>(null)

  const [editTitulo, setEditTitulo] =
    useState("")

  const [
    editDescricao,
    setEditDescricao,
  ] = useState("")

  const [
    editCategoria,
    setEditCategoria,
  ] = useState("")

  const [editCursos, setEditCursos] =
    useState<string[]>([])

  async function carregarDados() {
    try {
      setLoading(true)

      const [
        trilhasResponse,
        cursosResponse,
        categoriasResponse,
      ] = await Promise.all([
        getTrilhas(),
        getCursos(),
        getCategorias(),
      ])

      setTrilhas(
        trilhasResponse.data
      )

      setCursos(
        cursosResponse.data
      )

      setCategorias(
        categoriasResponse.data
      )
    } catch (error) {
      console.error(
        "Erro ao carregar trilhas:",
        error
      )

      alert(
        "Não foi possível carregar as trilhas."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  function toggleCurso(
    idCurso: string
  ) {
    setCursosSelecionados(
      (atuais) => {
        if (
          atuais.includes(idCurso)
        ) {
          return atuais.filter(
            (id) => id !== idCurso
          )
        }

        return [
          ...atuais,
          idCurso,
        ]
      }
    )
  }

  function toggleCursoEdicao(
    idCurso: string
  ) {
    setEditCursos((atuais) => {
      if (
        atuais.includes(idCurso)
      ) {
        return atuais.filter(
          (id) => id !== idCurso
        )
      }

      return [...atuais, idCurso]
    })
  }

  function moverCurso(
    indice: number,
    direcao: "CIMA" | "BAIXO"
  ) {
    setEditCursos((atuais) => {
      const novaLista = [...atuais]

      const novoIndice =
        direcao === "CIMA"
          ? indice - 1
          : indice + 1

      if (
        novoIndice < 0 ||
        novoIndice >=
          novaLista.length
      ) {
        return atuais
      }

      const temporario =
        novaLista[indice]

      novaLista[indice] =
        novaLista[novoIndice]

      novaLista[novoIndice] =
        temporario

      return novaLista
    })
  }

  function buscarNomeCurso(
    idCurso: string
  ) {
    return (
      cursos.find(
        (curso) =>
          String(curso.id) ===
          String(idCurso)
      )?.nome ??
      "Curso não encontrado"
    )
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (!ehAdmin) {
      return
    }

    if (!titulo.trim()) {
      alert(
        "Informe o título da trilha."
      )
      return
    }

    if (!idCategoria) {
      alert(
        "Selecione a categoria da trilha."
      )
      return
    }

    try {
      const response =
        await createTrilha({
          titulo: titulo.trim(),
          descricao:
            descricao.trim(),
          idCategoria,
        })

      const idNovaTrilha =
        response.data.id

      for (
        let i = 0;
        i <
        cursosSelecionados.length;
        i++
      ) {
        await createTrilhaCurso(
          idNovaTrilha,
          cursosSelecionados[i],
          i + 1
        )
      }

      setTitulo("")
      setDescricao("")
      setIdCategoria("")
      setCursosSelecionados([])

      await carregarDados()
    } catch (error) {
      console.error(
        "Erro ao cadastrar trilha:",
        error
      )

      alert(
        "Não foi possível cadastrar a trilha."
      )
    }
  }

  function iniciarEdicao(
    trilha: Trilha
  ) {
    setEditando(trilha.id)

    setEditTitulo(
      trilha.titulo
    )

    setEditDescricao(
      trilha.descricao
    )

    setEditCategoria(
      trilha.idCategoria
    )

    setEditCursos(
      trilha.cursos
        .sort(
          (a, b) =>
            a.ordem - b.ordem
        )
        .map(
          (item) =>
            item.idCurso
        )
    )
  }

  function cancelarEdicao() {
    setEditando(null)
    setEditTitulo("")
    setEditDescricao("")
    setEditCategoria("")
    setEditCursos([])
  }

  async function sincronizarCursos(
    trilha: Trilha
  ) {
    const antigos =
      trilha.cursos.map(
        (item) => item.idCurso
      )

    const removidos =
      antigos.filter(
        (idCurso) =>
          !editCursos.includes(
            idCurso
          )
      )

    for (
      const idCurso of removidos
    ) {
      await deleteTrilhaCurso(
        trilha.id,
        idCurso
      )
    }

    for (
      let indice = 0;
      indice < editCursos.length;
      indice++
    ) {
      const idCurso =
        editCursos[indice]

      const ordem =
        indice + 1

      const jaExistia =
        antigos.includes(
          idCurso
        )

      if (jaExistia) {
        await updateTrilhaCurso(
          trilha.id,
          idCurso,
          ordem
        )
      } else {
        await createTrilhaCurso(
          trilha.id,
          idCurso,
          ordem
        )
      }
    }
  }

  async function handleUpdate(
    trilha: Trilha
  ) {
    if (!editTitulo.trim()) {
      alert(
        "Informe o título da trilha."
      )
      return
    }

    if (!editCategoria) {
      alert(
        "Selecione a categoria."
      )
      return
    }

    try {
      await updateTrilha(
        trilha.id,
        {
          titulo:
            editTitulo.trim(),
          descricao:
            editDescricao.trim(),
          idCategoria:
            editCategoria,
        }
      )

      await sincronizarCursos(
        trilha
      )

      cancelarEdicao()

      await carregarDados()
    } catch (error) {
      console.error(
        "Erro ao atualizar trilha:",
        error
      )

      alert(
        "Não foi possível atualizar a trilha."
      )
    }
  }

  async function handleDelete(
    trilha: Trilha
  ) {
    if (!ehAdmin) {
      return
    }

    const confirmar =
      window.confirm(
        `Deseja realmente excluir a trilha "${trilha.titulo}"?`
      )

    if (!confirmar) {
      return
    }

    try {
      await deleteTrilha(
        trilha.id
      )

      if (
        editando === trilha.id
      ) {
        cancelarEdicao()
      }

      await carregarDados()
    } catch (error) {
      console.error(
        "Erro ao excluir trilha:",
        error
      )

      alert(
        "Não foi possível excluir a trilha. Verifique se existem certificados vinculados a ela."
      )
    }
  }

  return (
    <div className="container mt-4 crud-page">
      <div className="crud-page-header">
        <h2>Trilhas</h2>

        <p>
          Trilhas organizam cursos
          em uma sequência de
          aprendizagem.
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
              Cadastrar trilha
            </h5>

            <form
              onSubmit={
                handleSubmit
              }
            >
              <div className="mb-3">
                <label className="form-label text-muted">
                  Título
                </label>

                <input
                  className="form-control"
                  value={titulo}
                  onChange={(e) =>
                    setTitulo(
                      e.target.value
                    )
                  }
                  placeholder="Nome da trilha"
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">
                  Descrição
                </label>

                <textarea
                  className="form-control"
                  value={descricao}
                  onChange={(e) =>
                    setDescricao(
                      e.target.value
                    )
                  }
                  placeholder="Descrição da trilha"
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">
                  Categoria
                </label>

                <select
                  className="form-select"
                  value={
                    idCategoria
                  }
                  onChange={(e) =>
                    setIdCategoria(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Selecione uma
                    categoria
                  </option>

                  {categorias.map(
                    (categoria) => (
                      <option
                        key={
                          categoria.id
                        }
                        value={
                          categoria.id
                        }
                      >
                        {
                          categoria.nome
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">
                  Cursos da trilha
                </label>

                {cursos.length ===
                0 ? (
                  <p className="text-muted small">
                    Nenhum curso
                    cadastrado.
                  </p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {cursos.map(
                      (curso) => (
                        <label
                          key={
                            curso.id
                          }
                          className="d-flex align-items-center gap-2"
                          style={{
                            fontSize:
                              "12px",
                            cursor:
                              "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={cursosSelecionados.includes(
                              curso.id
                            )}
                            onChange={() =>
                              toggleCurso(
                                curso.id
                              )
                            }
                          />

                          {curso.nome}
                        </label>
                      )
                    )}
                  </div>
                )}
              </div>

              {cursosSelecionados.length >
                0 && (
                <div className="mb-3">
                  <small className="text-muted">
                    Ordem da trilha
                  </small>

                  <ol className="mt-2 mb-0">
                    {cursosSelecionados.map(
                      (id) => (
                        <li key={id}>
                          {buscarNomeCurso(
                            id
                          )}
                        </li>
                      )
                    )}
                  </ol>
                </div>
              )}

              <div className="crud-form-actions">
                <button
                  type="submit"
                  className="crud-btn crud-btn-primary"
                >
                  <i className="bi bi-plus-lg" />
                  Cadastrar trilha
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card crud-list-card">
          <div className="crud-list-header">
            <div>
              <h5>
                Trilhas cadastradas
              </h5>

              <small className="text-muted">
                {trilhas.length}{" "}
                trilha(s)
              </small>
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-muted">
              Carregando...
            </div>
          ) : trilhas.length ===
            0 ? (
            <div className="p-4 text-center">
              <i className="bi bi-signpost-split fs-3 text-muted" />

              <p className="mt-2 mb-0">
                Nenhuma trilha
                cadastrada.
              </p>
            </div>
          ) : (
            <div className="p-3">
              <div className="d-flex flex-column gap-3">
                {trilhas.map(
                  (trilha) => (
                    <div
                      className="card crud-item-card"
                      key={
                        trilha.id
                      }
                    >
                      {editando ===
                      trilha.id ? (
                        <>
                          <div className="mb-2">
                            <label className="form-label text-muted">
                              Título
                            </label>

                            <input
                              className="form-control"
                              value={
                                editTitulo
                              }
                              onChange={(
                                e
                              ) =>
                                setEditTitulo(
                                  e.target
                                    .value
                                )
                              }
                            />
                          </div>

                          <div className="mb-2">
                            <label className="form-label text-muted">
                              Descrição
                            </label>

                            <textarea
                              className="form-control"
                              value={
                                editDescricao
                              }
                              onChange={(
                                e
                              ) =>
                                setEditDescricao(
                                  e.target
                                    .value
                                )
                              }
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label text-muted">
                              Categoria
                            </label>

                            <select
                              className="form-select"
                              value={
                                editCategoria
                              }
                              onChange={(
                                e
                              ) =>
                                setEditCategoria(
                                  e.target
                                    .value
                                )
                              }
                            >
                              {categorias.map(
                                (
                                  categoria
                                ) => (
                                  <option
                                    key={
                                      categoria.id
                                    }
                                    value={
                                      categoria.id
                                    }
                                  >
                                    {
                                      categoria.nome
                                    }
                                  </option>
                                )
                              )}
                            </select>
                          </div>

                          <div className="mb-3">
                            <label className="form-label text-muted">
                              Cursos
                            </label>

                            <div className="d-flex flex-column gap-2">
                              {cursos.map(
                                (
                                  curso
                                ) => (
                                  <label
                                    key={
                                      curso.id
                                    }
                                    className="d-flex align-items-center gap-2"
                                    style={{
                                      fontSize:
                                        "12px",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={editCursos.includes(
                                        curso.id
                                      )}
                                      onChange={() =>
                                        toggleCursoEdicao(
                                          curso.id
                                        )
                                      }
                                    />

                                    {
                                      curso.nome
                                    }
                                  </label>
                                )
                              )}
                            </div>
                          </div>

                          {editCursos.length >
                            0 && (
                            <div className="mb-3">
                              <label className="form-label text-muted">
                                Ordem dos
                                cursos
                              </label>

                              <div className="d-flex flex-column gap-2">
                                {editCursos.map(
                                  (
                                    id,
                                    indice
                                  ) => (
                                    <div
                                      key={
                                        id
                                      }
                                      className="d-flex justify-content-between align-items-center border rounded p-2"
                                    >
                                      <span
                                        style={{
                                          fontSize:
                                            "12px",
                                        }}
                                      >
                                        {indice +
                                          1}
                                        .{" "}
                                        {buscarNomeCurso(
                                          id
                                        )}
                                      </span>

                                      <div className="d-flex gap-1">
                                        <button
                                          type="button"
                                          className="crud-btn crud-btn-secondary crud-btn-icon"
                                          disabled={
                                            indice ===
                                            0
                                          }
                                          onClick={() =>
                                            moverCurso(
                                              indice,
                                              "CIMA"
                                            )
                                          }
                                        >
                                          <i className="bi bi-arrow-up" />
                                        </button>

                                        <button
                                          type="button"
                                          className="crud-btn crud-btn-secondary crud-btn-icon"
                                          disabled={
                                            indice ===
                                            editCursos.length -
                                              1
                                          }
                                          onClick={() =>
                                            moverCurso(
                                              indice,
                                              "BAIXO"
                                            )
                                          }
                                        >
                                          <i className="bi bi-arrow-down" />
                                        </button>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          <div className="crud-actions">
                            <button
                              type="button"
                              className="crud-btn crud-btn-primary"
                              onClick={() =>
                                handleUpdate(
                                  trilha
                                )
                              }
                            >
                              <i className="bi bi-check-lg" />
                              Salvar
                            </button>

                            <button
                              type="button"
                              className="crud-btn crud-btn-secondary"
                              onClick={
                                cancelarEdicao
                              }
                            >
                              <i className="bi bi-x-lg" />
                              Cancelar
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="d-flex justify-content-between align-items-start gap-3">
                            <div>
                              <h5 className="mb-1">
                                {
                                  trilha.titulo
                                }
                              </h5>

                              <span className="badge categoria-badge">
                                {
                                  trilha.nomeCategoria
                                }
                              </span>

                              {trilha.descricao && (
                                <p className="mt-3 mb-0">
                                  {
                                    trilha.descricao
                                  }
                                </p>
                              )}
                            </div>

                            {ehAdmin && (
                              <div className="crud-actions">
                                <button
                                  type="button"
                                  className="crud-btn crud-btn-secondary crud-btn-icon"
                                  title="Editar"
                                  onClick={() =>
                                    iniciarEdicao(
                                      trilha
                                    )
                                  }
                                >
                                  <i className="bi bi-pencil" />
                                </button>

                                <button
                                  type="button"
                                  className="crud-btn crud-btn-delete crud-btn-icon"
                                  title="Excluir"
                                  onClick={() =>
                                    handleDelete(
                                      trilha
                                    )
                                  }
                                >
                                  <i className="bi bi-trash3" />
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="mt-4">
                            <small className="text-muted">
                              Sequência de
                              cursos
                            </small>

                            {trilha.cursos.length >
                            0 ? (
                              <div className="d-flex flex-column gap-2 mt-2">
                                {trilha.cursos.map(
                                  (
                                    item,
                                    indice
                                  ) => (
                                    <div
                                      key={
                                        item.idCurso
                                      }
                                      className="d-flex align-items-center gap-2"
                                    >
                                      <span className="badge categoria-badge">
                                        {indice +
                                          1}
                                      </span>

                                      <span
                                        style={{
                                          fontSize:
                                            "12px",
                                        }}
                                      >
                                        {
                                          item.nomeCurso
                                        }
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-muted small mt-2 mb-0">
                                Nenhum curso
                                vinculado.
                              </p>
                            )}
                          </div>
                        </>
                      )}
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