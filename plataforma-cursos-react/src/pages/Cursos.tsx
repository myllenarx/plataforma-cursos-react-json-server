import { useEffect, useState } from "react"

import { getCategorias } from "../services/categoriasService"

import {
  getCursos,
  createCurso,
  updateCurso,
  deleteCurso
} from "../services/cursosService"

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
  idCategoria: string | null
  modulos?: Modulo[]
}

type Categoria = {
  id: string
  nome: string
}

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  // CREATE
  const [nome, setNome] = useState("")
  const [idCategoria, setIdCategoria] = useState("")

  // EDIT CURSO
  const [editando, setEditando] = useState<string | null>(null)
  const [editNome, setEditNome] = useState("")
  const [editCategoria, setEditCategoria] = useState("")

  // MÓDULO
  const [cursoModuloAberto, setCursoModuloAberto] =
    useState<string | null>(null)

  const [tituloModulo, setTituloModulo] = useState("")

  // AULA
  const [moduloAulaAberto, setModuloAulaAberto] =
    useState<string | null>(null)

  const [tituloAula, setTituloAula] = useState("")

  function carregarCursos() {
    setLoading(true)

    getCursos()
      .then((res) => {
        setCursos(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function carregarCategorias() {
    getCategorias().then((res) => {
      setCategorias(res.data)
    })
  }

  useEffect(() => {
    carregarCursos()
    carregarCategorias()
  }, [])

  // =========================================================
  // CURSO
  // =========================================================

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!nome.trim()) {
      alert("Informe o nome do curso.")
      return
    }

    if (!idCategoria) {
      alert("Selecione uma categoria.")
      return
    }

    createCurso({
      nome,
      idCategoria,
      modulos: []
    }).then(() => {
      setNome("")
      setIdCategoria("")
      carregarCursos()
    })
  }

  function iniciarEdicao(curso: Curso) {
    setEditando(curso.id)
    setEditNome(curso.nome)
    setEditCategoria(curso.idCategoria || "")
  }

  function cancelarEdicao() {
    setEditando(null)
    setEditNome("")
    setEditCategoria("")
  }

  function handleUpdate(curso: Curso) {
    if (!editNome.trim()) {
      alert("Informe o nome do curso.")
      return
    }

    if (!editCategoria) {
      alert("Selecione uma categoria.")
      return
    }

    updateCurso(curso.id, {
      ...curso,
      nome: editNome,
      idCategoria: editCategoria,
      modulos: curso.modulos || []
    }).then(() => {
      cancelarEdicao()
      carregarCursos()
    })
  }

  function handleDelete(id: string) {
    if (
      !window.confirm(
        "Deseja realmente excluir este curso?"
      )
    ) {
      return
    }

    deleteCurso(id).then(() => {
      setCursos((cursosAtuais) =>
        cursosAtuais.filter(
          (curso) => curso.id !== id
        )
      )
    })
  }

  // =========================================================
  // MÓDULO
  // =========================================================

  function abrirNovoModulo(cursoId: string) {
    if (cursoModuloAberto === cursoId) {
      setCursoModuloAberto(null)
      setTituloModulo("")
      return
    }

    setCursoModuloAberto(cursoId)
    setTituloModulo("")
  }

  function adicionarModulo(curso: Curso) {
    if (!tituloModulo.trim()) {
      alert("Informe o título do módulo.")
      return
    }

    const novoModulo: Modulo = {
      id: crypto.randomUUID(),
      titulo: tituloModulo,
      aulas: []
    }

    const modulosAtualizados = [
      ...(curso.modulos || []),
      novoModulo
    ]

    updateCurso(curso.id, {
      ...curso,
      modulos: modulosAtualizados
    }).then(() => {
      setTituloModulo("")
      setCursoModuloAberto(null)
      carregarCursos()
    })
  }

  function excluirModulo(
    curso: Curso,
    moduloId: string
  ) {
    if (
      !window.confirm(
        "Deseja realmente excluir este módulo e suas aulas?"
      )
    ) {
      return
    }

    const modulosAtualizados =
      (curso.modulos || []).filter(
        (modulo) => modulo.id !== moduloId
      )

    updateCurso(curso.id, {
      ...curso,
      modulos: modulosAtualizados
    }).then(() => {
      carregarCursos()
    })
  }

  // =========================================================
  // AULA
  // =========================================================

  function abrirNovaAula(moduloId: string) {
    if (moduloAulaAberto === moduloId) {
      setModuloAulaAberto(null)
      setTituloAula("")
      return
    }

    setModuloAulaAberto(moduloId)
    setTituloAula("")
  }

  function adicionarAula(
    curso: Curso,
    moduloId: string
  ) {
    if (!tituloAula.trim()) {
      alert("Informe o título da aula.")
      return
    }

    const novaAula: Aula = {
      id: crypto.randomUUID(),
      titulo: tituloAula
    }

    const modulosAtualizados =
      (curso.modulos || []).map((modulo) => {
        if (modulo.id === moduloId) {
          return {
            ...modulo,
            aulas: [
              ...(modulo.aulas || []),
              novaAula
            ]
          }
        }

        return modulo
      })

    updateCurso(curso.id, {
      ...curso,
      modulos: modulosAtualizados
    }).then(() => {
      setTituloAula("")
      setModuloAulaAberto(null)
      carregarCursos()
    })
  }

  function excluirAula(
    curso: Curso,
    moduloId: string,
    aulaId: string
  ) {
    if (
      !window.confirm(
        "Deseja realmente excluir esta aula?"
      )
    ) {
      return
    }

    const modulosAtualizados =
      (curso.modulos || []).map((modulo) => {
        if (modulo.id === moduloId) {
          return {
            ...modulo,
            aulas: (modulo.aulas || []).filter(
              (aula) => aula.id !== aulaId
            )
          }
        }

        return modulo
      })

    updateCurso(curso.id, {
      ...curso,
      modulos: modulosAtualizados
    }).then(() => {
      carregarCursos()
    })
  }

  function buscarCategoria(
    idCategoria: string | null
  ) {
    return (
      categorias.find(
        (categoria) =>
          String(categoria.id) ===
          String(idCategoria)
      )?.nome || "Sem categoria"
    )
  }

  return (
    <div className="container mt-4 crud-page">

      {/* CABEÇALHO */}
      <div className="crud-page-header">
        <h2>Cursos</h2>

        <p>
          Gerencie cursos, módulos e aulas da plataforma.
        </p>
      </div>

      <div className="crud-two-column">

        {/* FORMULÁRIO */}
        <div className="card crud-form-card">

          <h5>Cadastrar curso</h5>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <label className="form-label text-muted">
                Nome
              </label>

              <input
                className="form-control"
                placeholder="Nome do curso"
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value)
                }
              />

            </div>

            <div className="mb-3">

              <label className="form-label text-muted">
                Categoria
              </label>

              <select
                className="form-select"
                value={idCategoria}
                onChange={(e) =>
                  setIdCategoria(e.target.value)
                }
              >

                <option value="">
                  Selecione uma categoria
                </option>

                {categorias.map((categoria) => (

                  <option
                    key={categoria.id}
                    value={categoria.id}
                  >
                    {categoria.nome}
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
                Cadastrar curso
              </button>

            </div>

          </form>

        </div>

        {/* LISTAGEM */}
        <div className="card crud-list-card">

          <div className="crud-list-header">

            <h5>Cursos cadastrados</h5>

            <small className="text-muted">
              Gerencie os cursos e seus conteúdos
            </small>

          </div>

          {loading ? (

            <div className="p-4 text-center text-muted">
              Carregando...
            </div>

          ) : cursos.length === 0 ? (

            <div className="p-4 text-center">

              <i className="bi bi-book fs-3 text-muted"></i>

              <p className="mt-2 mb-0">
                Nenhum curso cadastrado.
              </p>

            </div>

          ) : (

            <div className="p-3">

              <div className="d-flex flex-column gap-3">

                {cursos.map((curso) => (

                  <div
                    key={curso.id}
                    className="card p-3"
                  >

                    {editando === curso.id ? (

                      <>
                        <div className="mb-2">

                          <label className="form-label text-muted">
                            Nome
                          </label>

                          <input
                            className="form-control"
                            value={editNome}
                            onChange={(e) =>
                              setEditNome(
                                e.target.value
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
                            value={editCategoria}
                            onChange={(e) =>
                              setEditCategoria(
                                e.target.value
                              )
                            }
                          >

                            <option value="">
                              Selecione uma categoria
                            </option>

                            {categorias.map(
                              (categoria) => (

                                <option
                                  key={categoria.id}
                                  value={categoria.id}
                                >
                                  {categoria.nome}
                                </option>

                              )
                            )}

                          </select>

                        </div>

                        <div className="d-flex gap-2">

                          <button
                            type="button"
                            className="crud-btn crud-btn-primary"
                            onClick={() =>
                              handleUpdate(curso)
                            }
                          >
                            <i className="bi bi-check-lg"></i>
                            Salvar
                          </button>

                          <button
                            type="button"
                            className="crud-btn crud-btn-secondary"
                            onClick={cancelarEdicao}
                          >
                            <i className="bi bi-x-lg"></i>
                            Cancelar
                          </button>

                        </div>
                      </>

                    ) : (

                      <>

                        {/* CABEÇALHO DO CURSO */}
                        <div className="d-flex justify-content-between align-items-start gap-3">

                          <div>

                            <h5 className="mb-1">
                              {curso.nome}
                            </h5>

                            <span className="badge categoria-badge">
                              {buscarCategoria(
                                curso.idCategoria
                              )}
                            </span>

                          </div>

                          <div className="crud-actions">

                            <button
                              type="button"
                              className="crud-btn crud-btn-secondary crud-btn-icon"
                              title="Editar curso"
                              onClick={() =>
                                iniciarEdicao(
                                  curso
                                )
                              }
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            <button
                              type="button"
                              className="crud-btn crud-btn-delete crud-btn-icon"
                              title="Excluir curso"
                              onClick={() =>
                                handleDelete(
                                  curso.id
                                )
                              }
                            >
                              <i className="bi bi-trash3"></i>
                            </button>

                          </div>

                        </div>

                        {/* AÇÕES DE CONTEÚDO */}
                        <div className="mt-3">

                          <button
                            type="button"
                            className="crud-btn crud-btn-secondary"
                            onClick={() =>
                              abrirNovoModulo(
                                curso.id
                              )
                            }
                          >
                            <i className="bi bi-plus-lg"></i>
                            Módulo
                          </button>

                        </div>

                        {/* FORMULÁRIO NOVO MÓDULO */}
                        {cursoModuloAberto ===
                          curso.id && (

                          <div className="mt-3">

                            <div className="d-flex gap-2">

                              <input
                                className="form-control"
                                placeholder="Título do módulo"
                                value={tituloModulo}
                                onChange={(e) =>
                                  setTituloModulo(
                                    e.target.value
                                  )
                                }
                              />

                              <button
                                type="button"
                                className="crud-btn crud-btn-primary"
                                onClick={() =>
                                  adicionarModulo(
                                    curso
                                  )
                                }
                              >
                                Salvar
                              </button>

                            </div>

                          </div>

                        )}

                        {/* MÓDULOS */}
                        {(curso.modulos || [])
                          .length > 0 && (

                          <div className="mt-4">

                            <small className="text-muted">
                              Conteúdo do curso
                            </small>

                            <div className="d-flex flex-column gap-2 mt-2">

                              {(curso.modulos || []).map(
                                (modulo, index) => (

                                  <div
                                    key={modulo.id}
                                    className="card p-3"
                                  >

                                    <div className="d-flex justify-content-between align-items-center gap-3">

                                      <div>

                                        <strong
                                          style={{
                                            fontSize:
                                              "13px"
                                          }}
                                        >
                                          Módulo{" "}
                                          {index + 1}:{" "}
                                          {modulo.titulo}
                                        </strong>

                                        <div className="text-muted small mt-1">
                                          {
                                            (
                                              modulo.aulas ||
                                              []
                                            ).length
                                          }{" "}
                                          aula(s)
                                        </div>

                                      </div>

                                      <div className="crud-actions">

                                        <button
                                          type="button"
                                          className="crud-btn crud-btn-secondary crud-btn-icon"
                                          title="Adicionar aula"
                                          onClick={() =>
                                            abrirNovaAula(
                                              modulo.id
                                            )
                                          }
                                        >
                                          <i className="bi bi-plus-lg"></i>
                                        </button>

                                        <button
                                          type="button"
                                          className="crud-btn crud-btn-delete crud-btn-icon"
                                          title="Excluir módulo"
                                          onClick={() =>
                                            excluirModulo(
                                              curso,
                                              modulo.id
                                            )
                                          }
                                        >
                                          <i className="bi bi-trash3"></i>
                                        </button>

                                      </div>

                                    </div>

                                    {/* NOVA AULA */}
                                    {moduloAulaAberto ===
                                      modulo.id && (

                                      <div className="mt-3">

                                        <div className="d-flex gap-2">

                                          <input
                                            className="form-control"
                                            placeholder="Título da aula"
                                            value={
                                              tituloAula
                                            }
                                            onChange={(e) =>
                                              setTituloAula(
                                                e.target
                                                  .value
                                              )
                                            }
                                          />

                                          <button
                                            type="button"
                                            className="crud-btn crud-btn-primary"
                                            onClick={() =>
                                              adicionarAula(
                                                curso,
                                                modulo.id
                                              )
                                            }
                                          >
                                            Salvar
                                          </button>

                                        </div>

                                      </div>

                                    )}

                                    {/* AULAS */}
                                    {(modulo.aulas || [])
                                      .length > 0 && (

                                      <div className="mt-3">

                                        {(modulo.aulas || []).map(
                                          (
                                            aula,
                                            aulaIndex
                                          ) => (

                                            <div
                                              key={
                                                aula.id
                                              }
                                              className="d-flex justify-content-between align-items-center py-2 border-top"
                                            >

                                              <div
                                                className="d-flex align-items-center gap-2"
                                                style={{
                                                  fontSize:
                                                    "12px"
                                                }}
                                              >

                                                <i className="bi bi-play-circle text-muted"></i>

                                                <span>
                                                  Aula{" "}
                                                  {aulaIndex +
                                                    1}
                                                  :{" "}
                                                  {
                                                    aula.titulo
                                                  }
                                                </span>

                                              </div>

                                              <button
                                                type="button"
                                                className="crud-btn crud-btn-delete crud-btn-icon"
                                                title="Excluir aula"
                                                onClick={() =>
                                                  excluirAula(
                                                    curso,
                                                    modulo.id,
                                                    aula.id
                                                  )
                                                }
                                              >
                                                <i className="bi bi-trash3"></i>
                                              </button>

                                            </div>

                                          )
                                        )}

                                      </div>

                                    )}

                                  </div>

                                )
                              )}

                            </div>

                          </div>

                        )}

                      </>

                    )}

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}