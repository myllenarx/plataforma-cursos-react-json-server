import { useEffect, useState } from "react"

import { getCursos } from "../services/cursosService"

import {
  getTrilhas,
  createTrilha,
  updateTrilha,
  deleteTrilha
} from "../services/trilhasService"

type Curso = {
  id: string
  nome: string
}

type Trilha = {
  id: string
  titulo: string
  descricao: string
  cursos: string[]
}

export default function Trilhas() {
  const [trilhas, setTrilhas] = useState<Trilha[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])

  const [loading, setLoading] = useState(true)

  // CREATE
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [cursosSelecionados, setCursosSelecionados] =
    useState<string[]>([])

  // EDIT
  const [editando, setEditando] = useState<string | null>(null)
  const [editTitulo, setEditTitulo] = useState("")
  const [editDescricao, setEditDescricao] = useState("")
  const [editCursos, setEditCursos] =
    useState<string[]>([])

  function carregarDados() {
    
    Promise.all([
      getTrilhas(),
      getCursos()
    ])
      .then(([trilhasResponse, cursosResponse]) => {
        setTrilhas(trilhasResponse.data)
        setCursos(cursosResponse.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    carregarDados()
  }, [])

  function toggleCurso(idCurso: string) {
    if (cursosSelecionados.includes(idCurso)) {
      setCursosSelecionados(
        cursosSelecionados.filter(
          (id) => id !== idCurso
        )
      )
    } else {
      setCursosSelecionados([
        ...cursosSelecionados,
        idCurso
      ])
    }
  }

  function toggleCursoEdicao(idCurso: string) {
    if (editCursos.includes(idCurso)) {
      setEditCursos(
        editCursos.filter(
          (id) => id !== idCurso
        )
      )
    } else {
      setEditCursos([
        ...editCursos,
        idCurso
      ])
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!titulo.trim()) {
      alert("Informe o título da trilha.")
      return
    }

    if (!descricao.trim()) {
      alert("Informe a descrição da trilha.")
      return
    }

    createTrilha({
      titulo,
      descricao,
      cursos: cursosSelecionados
    }).then(() => {
      setTitulo("")
      setDescricao("")
      setCursosSelecionados([])

      carregarDados()
    })
  }

  function iniciarEdicao(trilha: Trilha) {
    setEditando(trilha.id)
    setEditTitulo(trilha.titulo)
    setEditDescricao(trilha.descricao)
    setEditCursos(trilha.cursos || [])
  }

  function cancelarEdicao() {
    setEditando(null)
    setEditTitulo("")
    setEditDescricao("")
    setEditCursos([])
  }

  function handleUpdate(id: string) {
    if (!editTitulo.trim()) {
      alert("Informe o título da trilha.")
      return
    }

    if (!editDescricao.trim()) {
      alert("Informe a descrição da trilha.")
      return
    }

    updateTrilha(id, {
      titulo: editTitulo,
      descricao: editDescricao,
      cursos: editCursos
    }).then(() => {
      cancelarEdicao()
      carregarDados()
    })
  }

  function handleDelete(id: string) {
    if (
      !window.confirm(
        "Deseja realmente excluir esta trilha?"
      )
    ) {
      return
    }

    deleteTrilha(id).then(() => {
      setTrilhas((trilhasAtuais) =>
        trilhasAtuais.filter(
          (trilha) => trilha.id !== id
        )
      )
    })
  }

  function buscarNomeCurso(idCurso: string) {
    return (
      cursos.find(
        (curso) =>
          String(curso.id) === String(idCurso)
      )?.nome || "Curso não encontrado"
    )
  }

  return (
    <div className="container mt-4 crud-page">

      {/* CABEÇALHO */}
      <div className="crud-page-header">
        <h2>Trilhas</h2>

        <p>
          Organize cursos em trilhas de aprendizagem.
        </p>
      </div>

      {/* LAYOUT PRINCIPAL */}
      <div className="crud-two-column">

        {/* FORMULÁRIO */}
        <div className="card crud-form-card">

          <h5>Cadastrar trilha</h5>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <label className="form-label text-muted">
                Título
              </label>

              <input
                className="form-control"
                placeholder="Nome da trilha"
                value={titulo}
                onChange={(e) =>
                  setTitulo(e.target.value)
                }
              />

            </div>

            <div className="mb-3">

              <label className="form-label text-muted">
                Descrição
              </label>

              <textarea
                className="form-control"
                placeholder="Descrição da trilha"
                value={descricao}
                onChange={(e) =>
                  setDescricao(e.target.value)
                }
              />

            </div>

            <div className="mb-3">

              <label className="form-label text-muted">
                Cursos da trilha
              </label>

              {cursos.length === 0 ? (

                <p className="text-muted small">
                  Nenhum curso cadastrado.
                </p>

              ) : (

                <div className="d-flex flex-column gap-2">

                  {cursos.map((curso) => (

                    <label
                      key={curso.id}
                      className="d-flex align-items-center gap-2"
                      style={{
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                    >

                      <input
                        type="checkbox"
                        checked={
                          cursosSelecionados.includes(
                            curso.id
                          )
                        }
                        onChange={() =>
                          toggleCurso(curso.id)
                        }
                      />

                      {curso.nome}

                    </label>

                  ))}

                </div>

              )}

            </div>

            <div className="crud-form-actions">

              <button
                type="submit"
                className="crud-btn crud-btn-primary"
              >
                <i className="bi bi-plus-lg"></i>
                Cadastrar trilha
              </button>

            </div>

          </form>

        </div>

        {/* LISTAGEM */}
        <div className="card crud-list-card">

          <div className="crud-list-header">

            <h5>Trilhas cadastradas</h5>

            <small className="text-muted">
              Trilhas disponíveis na plataforma
            </small>

          </div>

          {loading ? (

            <div className="p-4 text-center text-muted">
              Carregando...
            </div>

          ) : trilhas.length === 0 ? (

            <div className="p-4 text-center">

              <i className="bi bi-signpost-split fs-3 text-muted"></i>

              <p className="mt-2 mb-0">
                Nenhuma trilha cadastrada.
              </p>

            </div>

          ) : (

            <div className="p-3">

              <div className="row g-3">

                {trilhas.map((trilha) => (

                  <div
                    className="col-12"
                    key={trilha.id}
                  >

                    <div className="card crud-item-card">

                      {editando === trilha.id ? (

                        <>

                          <div className="mb-2">

                            <label className="form-label text-muted">
                              Título
                            </label>

                            <input
                              className="form-control"
                              value={editTitulo}
                              onChange={(e) =>
                                setEditTitulo(
                                  e.target.value
                                )
                              }
                            />

                          </div>

                          <div className="mb-3">

                            <label className="form-label text-muted">
                              Descrição
                            </label>

                            <textarea
                              className="form-control"
                              value={editDescricao}
                              onChange={(e) =>
                                setEditDescricao(
                                  e.target.value
                                )
                              }
                            />

                          </div>

                          <div className="mb-3">

                            <label className="form-label text-muted">
                              Cursos
                            </label>

                            <div className="d-flex flex-column gap-2">

                              {cursos.map((curso) => (

                                <label
                                  key={curso.id}
                                  className="d-flex align-items-center gap-2"
                                  style={{
                                    fontSize: "12px",
                                    cursor: "pointer"
                                  }}
                                >

                                  <input
                                    type="checkbox"
                                    checked={
                                      editCursos.includes(
                                        curso.id
                                      )
                                    }
                                    onChange={() =>
                                      toggleCursoEdicao(
                                        curso.id
                                      )
                                    }
                                  />

                                  {curso.nome}

                                </label>

                              ))}

                            </div>

                          </div>

                          <div className="d-flex gap-2">

                            <button
                              type="button"
                              className="crud-btn crud-btn-primary"
                              onClick={() =>
                                handleUpdate(
                                  trilha.id
                                )
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

                          <div className="d-flex justify-content-between align-items-start gap-3">

                            <div>

                              <h5 className="mb-1">
                                {trilha.titulo}
                              </h5>

                              <p className="mb-3">
                                {trilha.descricao}
                              </p>

                            </div>

                            <div className="crud-actions">

                              <button
                                type="button"
                                className="crud-btn crud-btn-secondary crud-btn-icon"
                                onClick={() =>
                                  iniciarEdicao(
                                    trilha
                                  )
                                }
                                title="Editar"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>

                              <button
                                type="button"
                                className="crud-btn crud-btn-delete crud-btn-icon"
                                onClick={() =>
                                  handleDelete(
                                    trilha.id
                                  )
                                }
                                title="Excluir"
                              >
                                <i className="bi bi-trash3"></i>
                              </button>

                            </div>

                          </div>

                          <div>

                            <small className="text-muted">
                              Cursos
                            </small>

                            {trilha.cursos?.length > 0 ? (

                              <div className="d-flex flex-wrap gap-2 mt-2">

                                {trilha.cursos.map(
                                  (idCurso) => (

                                    <span
                                      key={idCurso}
                                      className="badge categoria-badge"
                                    >
                                      {buscarNomeCurso(
                                        idCurso
                                      )}
                                    </span>

                                  )
                                )}

                              </div>

                            ) : (

                              <p className="text-muted small mt-2 mb-0">
                                Nenhum curso vinculado.
                              </p>

                            )}

                          </div>

                        </>

                      )}

                    </div>

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