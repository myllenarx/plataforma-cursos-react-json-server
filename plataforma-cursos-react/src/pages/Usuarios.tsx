import { useEffect, useMemo, useState } from "react"

import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  type Usuario
} from "../services/usuariosService"

import {
  getMatriculas,
  type Matricula
} from "../services/matriculasService"

import {
  getProgressos,
  type Progresso
} from "../services/progressosService"

import { getCursos } from "../services/cursosService"

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

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [progressos, setProgressos] = useState<Progresso[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")

  const [editando, setEditando] =
    useState<string | null>(null)

  const [editNome, setEditNome] = useState("")
  const [editEmail, setEditEmail] = useState("")

  const [usuarioAberto, setUsuarioAberto] =
    useState<string | null>(null)

  const [busca, setBusca] = useState("")

  const [loading, setLoading] = useState(true)

  // =========================================================
  // CARREGAMENTO
  // =========================================================

  function carregarDados() {
    
    Promise.all([
      getUsuarios(),
      getMatriculas(),
      getProgressos(),
      getCursos()
    ])
      .then(
        ([
          usuariosResponse,
          matriculasResponse,
          progressosResponse,
          cursosResponse
        ]) => {
          setUsuarios(usuariosResponse.data)
          setMatriculas(matriculasResponse.data)
          setProgressos(progressosResponse.data)
          setCursos(cursosResponse.data)
        }
      )
      .catch(() => {
        alert(
          "Não foi possível carregar os dados dos usuários."
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
  // VALIDAÇÕES
  // =========================================================

  function emailValido(valor: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      valor.trim()
    )
  }

  function emailJaExiste(
    valor: string,
    ignorarId?: string
  ) {
    return usuarios.some(
      (usuario) =>
        usuario.id !== ignorarId &&
        usuario.email
          .trim()
          .toLowerCase() ===
          valor.trim().toLowerCase()
    )
  }

  // =========================================================
  // CREATE
  // =========================================================

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const nomeLimpo = nome.trim()
    const emailLimpo = email.trim()

    if (!nomeLimpo) {
      alert("Informe o nome do usuário.")
      return
    }

    if (nomeLimpo.length < 3) {
      alert(
        "O nome deve possuir pelo menos 3 caracteres."
      )
      return
    }

    if (!emailLimpo) {
      alert("Informe o e-mail do usuário.")
      return
    }

    if (!emailValido(emailLimpo)) {
      alert("Informe um e-mail válido.")
      return
    }

    if (emailJaExiste(emailLimpo)) {
      alert(
        "Já existe um usuário cadastrado com este e-mail."
      )
      return
    }

    createUsuario({
      nome: nomeLimpo,
      email: emailLimpo.toLowerCase()
    })
      .then(() => {
        setNome("")
        setEmail("")
        carregarDados()
      })
      .catch(() => {
        alert(
          "Não foi possível cadastrar o usuário."
        )
      })
  }

  // =========================================================
  // EDIT
  // =========================================================

  function iniciarEdicao(usuario: Usuario) {
    setEditando(usuario.id)
    setEditNome(usuario.nome)
    setEditEmail(usuario.email)
  }

  function cancelarEdicao() {
    setEditando(null)
    setEditNome("")
    setEditEmail("")
  }

  function handleUpdate(usuario: Usuario) {
    const nomeLimpo = editNome.trim()
    const emailLimpo = editEmail.trim()

    if (!nomeLimpo) {
      alert("Informe o nome do usuário.")
      return
    }

    if (nomeLimpo.length < 3) {
      alert(
        "O nome deve possuir pelo menos 3 caracteres."
      )
      return
    }

    if (!emailValido(emailLimpo)) {
      alert("Informe um e-mail válido.")
      return
    }

    if (
      emailJaExiste(
        emailLimpo,
        usuario.id
      )
    ) {
      alert(
        "Já existe outro usuário com este e-mail."
      )
      return
    }

    updateUsuario(
      usuario.id,
      {
        nome: nomeLimpo,
        email: emailLimpo.toLowerCase()
      }
    )
      .then(() => {
        cancelarEdicao()
        carregarDados()
      })
      .catch(() => {
        alert(
          "Não foi possível atualizar o usuário."
        )
      })
  }

  // =========================================================
  // DELETE
  // =========================================================

  function handleDelete(usuario: Usuario) {
    const possuiMatriculas =
      matriculas.some(
        (matricula) =>
          String(matricula.idUsuario) ===
          String(usuario.id)
      )

    if (possuiMatriculas) {
      alert(
        "Este usuário possui matrícula ativa ou histórico acadêmico. Cancele suas matrículas antes de excluir o usuário."
      )
      return
    }

    if (
      !window.confirm(
        `Deseja realmente excluir o usuário "${usuario.nome}"?`
      )
    ) {
      return
    }

    deleteUsuario(usuario.id)
      .then(() => {
        setUsuarios((atuais) =>
          atuais.filter(
            (item) =>
              item.id !== usuario.id
          )
        )

        if (
          usuarioAberto === usuario.id
        ) {
          setUsuarioAberto(null)
        }
      })
      .catch(() => {
        alert(
          "Não foi possível excluir o usuário."
        )
      })
  }

  // =========================================================
  // DADOS ACADÊMICOS
  // =========================================================

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

    return (curso.modulos || []).flatMap(
      (modulo) =>
        modulo.aulas || []
    )
  }

  function matriculasDoUsuario(
    usuarioId: string
  ) {
    return matriculas.filter(
      (matricula) =>
        String(matricula.idUsuario) ===
        String(usuarioId)
    )
  }

  function progressoDaMatricula(
    matricula: Matricula
  ) {
    const curso =
      buscarCurso(matricula.idCurso)

    const aulas =
      obterTodasAulas(curso)

    const progressosDoUsuario =
      progressos.filter(
        (progresso) =>
          String(progresso.idUsuario) ===
            String(matricula.idUsuario) &&
          String(progresso.idCurso) ===
            String(matricula.idCurso)
      )

    const concluidas =
      progressosDoUsuario.filter(
        (progresso) =>
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
            (concluidas / aulas.length) *
              100
          )

    return {
      total: aulas.length,
      concluidas,
      percentual
    }
  }

  function resumoUsuario(
    usuarioId: string
  ) {
    const lista =
      matriculasDoUsuario(usuarioId)

    const concluidos =
      lista.filter(
        (matricula) =>
          Boolean(
            matricula.dataConclusao
          )
      ).length

    if (lista.length === 0) {
      return {
        matriculas: 0,
        concluidos: 0,
        progressoMedio: 0
      }
    }

    const soma =
      lista.reduce(
        (total, matricula) =>
          total +
          progressoDaMatricula(
            matricula
          ).percentual,
        0
      )

    return {
      matriculas: lista.length,
      concluidos,
      progressoMedio: Math.round(
        soma / lista.length
      )
    }
  }

  // =========================================================
  // BUSCA
  // =========================================================

  const usuariosFiltrados = useMemo(() => {
    const termo =
      busca.trim().toLowerCase()

    if (!termo) {
      return usuarios
    }

    return usuarios.filter(
      (usuario) =>
        usuario.nome
          .toLowerCase()
          .includes(termo) ||
        usuario.email
          .toLowerCase()
          .includes(termo)
    )
  }, [usuarios, busca])

  // =========================================================
  // INTERFACE
  // =========================================================

  return (
    <div className="container mt-4 crud-page">

      <div className="crud-page-header">
        <h2>Usuários</h2>

        <p>
          Gerencie os usuários e acompanhe
          seu desempenho acadêmico.
        </p>
      </div>

      <div className="crud-two-column">

        {/* FORMULÁRIO */}
        <div className="card crud-form-card">

          <h5>Cadastrar usuário</h5>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <label className="form-label text-muted">
                Nome
              </label>

              <input
                className="form-control"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value)
                }
              />

            </div>

            <div className="mb-3">

              <label className="form-label text-muted">
                E-mail
              </label>

              <input
                type="email"
                className="form-control"
                placeholder="usuario@email.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            <div className="crud-form-actions">

              <button
                type="submit"
                className="crud-btn crud-btn-primary"
              >
                <i className="bi bi-person-plus"></i>
                Cadastrar usuário
              </button>

            </div>

          </form>

        </div>

        {/* LISTAGEM */}
        <div className="card crud-list-card">

          <div className="crud-list-header">

            <div className="d-flex justify-content-between align-items-center gap-3">

              <div>
                <h5>Usuários cadastrados</h5>

                <small className="text-muted">
                  Administração e desempenho dos alunos
                </small>
              </div>

              <div
                style={{
                  maxWidth: "230px",
                  width: "100%"
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
                      setBusca(e.target.value)
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

          ) : usuariosFiltrados.length === 0 ? (

            <div className="p-4 text-center">

              <i className="bi bi-people fs-3 text-muted"></i>

              <p className="mt-2 mb-0">
                Nenhum usuário encontrado.
              </p>

            </div>

          ) : (

            <div className="p-3">

              <div className="d-flex flex-column gap-3">

                {usuariosFiltrados.map(
                  (usuario) => {

                    const resumo =
                      resumoUsuario(
                        usuario.id
                      )

                    const matriculasUsuario =
                      matriculasDoUsuario(
                        usuario.id
                      )

                    const aberto =
                      usuarioAberto ===
                      usuario.id

                    return (
                      <div
                        key={usuario.id}
                        className="card p-3"
                      >

                        {editando ===
                        usuario.id ? (

                          <>
                            <div className="mb-2">

                              <label className="form-label text-muted">
                                Nome
                              </label>

                              <input
                                className="form-control"
                                value={
                                  editNome
                                }
                                onChange={(e) =>
                                  setEditNome(
                                    e.target
                                      .value
                                  )
                                }
                              />

                            </div>

                            <div className="mb-3">

                              <label className="form-label text-muted">
                                E-mail
                              </label>

                              <input
                                type="email"
                                className="form-control"
                                value={
                                  editEmail
                                }
                                onChange={(e) =>
                                  setEditEmail(
                                    e.target
                                      .value
                                  )
                                }
                              />

                            </div>

                            <div className="d-flex gap-2">

                              <button
                                type="button"
                                className="crud-btn crud-btn-primary"
                                onClick={() =>
                                  handleUpdate(
                                    usuario
                                  )
                                }
                              >
                                <i className="bi bi-check-lg"></i>
                                Salvar
                              </button>

                              <button
                                type="button"
                                className="crud-btn crud-btn-secondary"
                                onClick={
                                  cancelarEdicao
                                }
                              >
                                <i className="bi bi-x-lg"></i>
                                Cancelar
                              </button>

                            </div>
                          </>

                        ) : (

                          <>

                            {/* CABEÇALHO */}
                            <div className="d-flex justify-content-between align-items-start gap-3">

                              <div className="d-flex align-items-center gap-3">

                                <div
                                  className="d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "40px",
                                    height:
                                      "40px",
                                    borderRadius:
                                      "10px",
                                    background:
                                      "rgba(124, 63, 70, 0.18)",
                                    color:
                                      "var(--wine-light)"
                                  }}
                                >
                                  <i className="bi bi-person fs-5"></i>
                                </div>

                                <div>

                                  <strong>
                                    {
                                      usuario.nome
                                    }
                                  </strong>

                                  <div className="text-muted small">
                                    {
                                      usuario.email
                                    }
                                  </div>

                                </div>

                              </div>

                              <div className="crud-actions">

                                <button
                                  type="button"
                                  className="crud-btn crud-btn-secondary crud-btn-icon"
                                  title="Editar usuário"
                                  onClick={() =>
                                    iniciarEdicao(
                                      usuario
                                    )
                                  }
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>

                                <button
                                  type="button"
                                  className="crud-btn crud-btn-secondary crud-btn-icon"
                                  title={
                                    aberto
                                      ? "Fechar detalhes"
                                      : "Ver detalhes"
                                  }
                                  onClick={() =>
                                    setUsuarioAberto(
                                      aberto
                                        ? null
                                        : usuario.id
                                    )
                                  }
                                >
                                  <i
                                    className={`bi ${
                                      aberto
                                        ? "bi-chevron-up"
                                        : "bi-chevron-down"
                                    }`}
                                  ></i>
                                </button>

                                <button
                                  type="button"
                                  className="crud-btn crud-btn-delete crud-btn-icon"
                                  title="Excluir usuário"
                                  onClick={() =>
                                    handleDelete(
                                      usuario
                                    )
                                  }
                                >
                                  <i className="bi bi-trash3"></i>
                                </button>

                              </div>

                            </div>

                            {/* RESUMO */}
                            <div
                              className="d-grid mt-3"
                              style={{
                                gridTemplateColumns:
                                  "repeat(3, 1fr)",
                                gap: "8px"
                              }}
                            >

                              <div
                                style={{
                                  padding:
                                    "10px",
                                  border:
                                    "1px solid var(--border)",
                                  borderRadius:
                                    "8px"
                                }}
                              >
                                <small className="text-muted">
                                  Matrículas
                                </small>

                                <div>
                                  <strong>
                                    {
                                      resumo.matriculas
                                    }
                                  </strong>
                                </div>
                              </div>

                              <div
                                style={{
                                  padding:
                                    "10px",
                                  border:
                                    "1px solid var(--border)",
                                  borderRadius:
                                    "8px"
                                }}
                              >
                                <small className="text-muted">
                                  Concluídos
                                </small>

                                <div>
                                  <strong>
                                    {
                                      resumo.concluidos
                                    }
                                  </strong>
                                </div>
                              </div>

                              <div
                                style={{
                                  padding:
                                    "10px",
                                  border:
                                    "1px solid var(--border)",
                                  borderRadius:
                                    "8px"
                                }}
                              >
                                <small className="text-muted">
                                  Progresso médio
                                </small>

                                <div>
                                  <strong>
                                    {
                                      resumo.progressoMedio
                                    }
                                    %
                                  </strong>
                                </div>
                              </div>

                            </div>

                            {/* DETALHES */}
                            {aberto && (

                              <div
                                className="mt-4 pt-3"
                                style={{
                                  borderTop:
                                    "1px solid var(--border)"
                                }}
                              >

                                <strong
                                  style={{
                                    fontSize:
                                      "13px"
                                  }}
                                >
                                  Cursos do usuário
                                </strong>

                                {matriculasUsuario.length ===
                                0 ? (

                                  <div className="text-muted small mt-2">
                                    Este usuário ainda não possui matrículas.
                                  </div>

                                ) : (

                                  <div className="d-flex flex-column gap-2 mt-3">

                                    {matriculasUsuario.map(
                                      (
                                        matricula
                                      ) => {

                                        const curso =
                                          buscarCurso(
                                            matricula.idCurso
                                          )

                                        const progresso =
                                          progressoDaMatricula(
                                            matricula
                                          )

                                        return (
                                          <div
                                            key={
                                              matricula.id
                                            }
                                            style={{
                                              padding:
                                                "12px",
                                              border:
                                                "1px solid var(--border)",
                                              borderRadius:
                                                "8px"
                                            }}
                                          >

                                            <div className="d-flex justify-content-between gap-3">

                                              <div>
                                                <strong
                                                  style={{
                                                    fontSize:
                                                      "12px"
                                                  }}
                                                >
                                                  {curso?.nome ||
                                                    "Curso não encontrado"}
                                                </strong>

                                                <div className="text-muted small mt-1">
                                                  Matrícula:{" "}
                                                  {
                                                    matricula.dataMatricula
                                                  }
                                                </div>
                                              </div>

                                              <div>
                                                {matricula.dataConclusao ? (

                                                  <span
                                                    className="badge"
                                                    style={{
                                                      background:
                                                        "rgba(72, 135, 91, 0.15)",
                                                      color:
                                                        "var(--color-success)"
                                                    }}
                                                  >
                                                    <i className="bi bi-check-circle me-1"></i>
                                                    Concluído
                                                  </span>

                                                ) : (

                                                  <span className="badge categoria-badge">
                                                    Em andamento
                                                  </span>

                                                )}
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
                                                  {
                                                    progresso.total
                                                  }{" "}
                                                  aulas ·{" "}
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
                                                  height:
                                                    "6px",
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

                                            </div>

                                          </div>
                                        )
                                      }
                                    )}

                                  </div>

                                )}

                              </div>

                            )}

                          </>

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