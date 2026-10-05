import { useEffect, useMemo, useState } from "react"

import {
  createUsuario,
  deleteUsuario,
  getUsuarios,
  updateUsuario,
  type PerfilUsuario,
  type Usuario,
} from "../services/usuariosService"

import {
  getMatriculas,
  type Matricula,
} from "../services/matriculasService"

import {
  getCursos,
  type Curso,
} from "../services/cursosService"

import {
  getProgressos,
  type Progresso,
} from "../services/progressosService"

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [progressos, setProgressos] = useState<Progresso[]>([])

  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("")

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [perfil, setPerfil] =
    useState<PerfilUsuario>("ALUNO")

  const [editando, setEditando] =
    useState<string | null>(null)

  const [editNome, setEditNome] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPassword, setEditPassword] = useState("")
  const [editPerfil, setEditPerfil] =
    useState<PerfilUsuario>("ALUNO")

  const [usuarioDetalhes, setUsuarioDetalhes] =
    useState<string | null>(null)

  async function carregarDados() {
    try {
      setLoading(true)

      const [
        usuariosResponse,
        matriculasResponse,
        cursosResponse,
        progressosResponse,
      ] = await Promise.all([
        getUsuarios(),
        getMatriculas(),
        getCursos(),
        getProgressos(),
      ])

      setUsuarios(usuariosResponse.data)
      setMatriculas(matriculasResponse.data)
      setCursos(cursosResponse.data)
      setProgressos(progressosResponse.data)
    } catch (error) {
      console.error(
        "Erro ao carregar usuários:",
        error
      )

      alert(
        "Não foi possível carregar os dados dos usuários."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const usuariosFiltrados = useMemo(() => {
    const termo = busca
      .trim()
      .toLocaleLowerCase("pt-BR")

    if (!termo) {
      return usuarios
    }

    return usuarios.filter((usuario) => {
      return (
        usuario.nome
          .toLocaleLowerCase("pt-BR")
          .includes(termo) ||
        usuario.email
          .toLocaleLowerCase("pt-BR")
          .includes(termo) ||
        usuario.perfil
          .toLocaleLowerCase("pt-BR")
          .includes(termo)
      )
    })
  }, [usuarios, busca])

  function validarEmail(valor: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)
  }

  function nomePerfil(
    perfilUsuario: PerfilUsuario
  ) {
    if (perfilUsuario === "ADMIN") {
      return "Administrador"
    }

    if (perfilUsuario === "PROFESSOR") {
      return "Professor"
    }

    return "Aluno"
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (!nome.trim()) {
      alert("Informe o nome do usuário.")
      return
    }

    if (!email.trim()) {
      alert("Informe o e-mail.")
      return
    }

    if (!validarEmail(email.trim())) {
      alert("Informe um e-mail válido.")
      return
    }

    if (!password) {
      alert("Informe uma senha.")
      return
    }

    if (password.length < 6) {
      alert(
        "A senha deve possuir pelo menos 6 caracteres."
      )
      return
    }

    try {
      await createUsuario({
        nome: nome.trim(),
        email: email.trim(),
        password,
        perfil,
      })

      setNome("")
      setEmail("")
      setPassword("")
      setPerfil("ALUNO")

      await carregarDados()
    } catch (error) {
      console.error(
        "Erro ao cadastrar usuário:",
        error
      )

      alert(
        "Não foi possível cadastrar o usuário. Verifique se o e-mail já está em uso."
      )
    }
  }

  function iniciarEdicao(usuario: Usuario) {
    setEditando(usuario.id)
    setEditNome(usuario.nome)
    setEditEmail(usuario.email)
    setEditPassword("")
    setEditPerfil(usuario.perfil)
  }

  function cancelarEdicao() {
    setEditando(null)
    setEditNome("")
    setEditEmail("")
    setEditPassword("")
    setEditPerfil("ALUNO")
  }

  async function salvarEdicao(
    usuario: Usuario
  ) {
    if (!editNome.trim()) {
      alert("Informe o nome do usuário.")
      return
    }

    if (!validarEmail(editEmail.trim())) {
      alert("Informe um e-mail válido.")
      return
    }

    if (
      editPassword &&
      editPassword.length < 6
    ) {
      alert(
        "A nova senha deve possuir pelo menos 6 caracteres."
      )
      return
    }

    try {
      await updateUsuario(usuario.id, {
        nome: editNome.trim(),
        email: editEmail.trim(),
        perfil: editPerfil,
        ...(editPassword
          ? { password: editPassword }
          : {}),
      })

      cancelarEdicao()

      await carregarDados()
    } catch (error) {
      console.error(
        "Erro ao atualizar usuário:",
        error
      )

      alert(
        "Não foi possível atualizar o usuário."
      )
    }
  }

  async function excluirUsuario(
    usuario: Usuario
  ) {
    const confirmar = window.confirm(
      `Deseja realmente excluir o usuário "${usuario.nome}"?`
    )

    if (!confirmar) {
      return
    }

    try {
      await deleteUsuario(usuario.id)

      if (
        usuarioDetalhes === usuario.id
      ) {
        setUsuarioDetalhes(null)
      }

      await carregarDados()
    } catch (error) {
      console.error(
        "Erro ao excluir usuário:",
        error
      )

      alert(
        "Não foi possível excluir o usuário. Ele pode possuir matrículas, cursos ou outros dados vinculados."
      )
    }
  }

  function buscarCurso(idCurso: string) {
    return cursos.find(
      (curso) =>
        String(curso.id) ===
        String(idCurso)
    )
  }

  function matriculasDoUsuario(
    idUsuario: string
  ) {
    return matriculas.filter(
      (matricula) =>
        String(matricula.idUsuario) ===
        String(idUsuario)
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
        percentual: 0,
      }
    }

    const aulas = curso.modulos.flatMap(
      (modulo) => modulo.aulas
    )

    const idsAulas = new Set(
      aulas.map((aula) =>
        String(aula.id)
      )
    )

    const progressosDoUsuario =
      progressos.filter(
        (progresso) =>
          String(progresso.idUsuario) ===
            String(
              matricula.idUsuario
            ) &&
          idsAulas.has(
            String(progresso.idAula)
          ) &&
          progresso.status === "CONCLUIDO"
      )

    const percentual =
      aulas.length === 0
        ? 0
        : Math.round(
            (progressosDoUsuario.length /
              aulas.length) *
              100
          )

    return {
      total: aulas.length,
      concluidas:
        progressosDoUsuario.length,
      percentual,
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
        <h2>Usuários</h2>

        <p>
          Gerencie alunos, professores e
          administradores da plataforma.
        </p>
      </div>

      <div className="crud-two-column">
        <div className="card crud-form-card">
          <h5>Cadastrar usuário</h5>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted">
                Nome
              </label>

              <input
                className="form-control"
                type="text"
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
                className="form-control"
                type="email"
                placeholder="usuario@email.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted">
                Senha
              </label>

              <input
                className="form-control"
                type="password"
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                autoComplete="new-password"
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted">
                Perfil
              </label>

              <select
                className="form-select"
                value={perfil}
                onChange={(e) =>
                  setPerfil(
                    e.target
                      .value as PerfilUsuario
                  )
                }
              >
                <option value="ALUNO">
                  Aluno
                </option>

                <option value="PROFESSOR">
                  Professor
                </option>

                <option value="ADMIN">
                  Administrador
                </option>
              </select>
            </div>

            <div className="crud-form-actions">
              <button
                type="submit"
                className="crud-btn crud-btn-primary"
              >
                <i className="bi bi-person-plus" />
                Cadastrar usuário
              </button>
            </div>
          </form>
        </div>

        <div className="card crud-list-card">
          <div className="crud-list-header">
            <div>
              <h5>Usuários cadastrados</h5>

              <small className="text-muted">
                {usuarios.length} usuário(s)
              </small>
            </div>
          </div>

          <div className="p-3 border-bottom">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search" />
              </span>

              <input
                type="search"
                className="form-control"
                placeholder="Buscar por nome, e-mail ou perfil..."
                value={busca}
                onChange={(e) =>
                  setBusca(e.target.value)
                }
              />
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-muted">
              Carregando...
            </div>
          ) : usuariosFiltrados.length ===
            0 ? (
            <div className="p-4 text-center">
              <i className="bi bi-people fs-3 text-muted" />

              <p className="mt-2 mb-0">
                Nenhum usuário encontrado.
              </p>
            </div>
          ) : (
            <div className="p-3">
              <div className="d-flex flex-column gap-3">
                {usuariosFiltrados.map(
                  (usuario) => {
                    const detalhesAbertos =
                      usuarioDetalhes ===
                      usuario.id

                    const matriculasUsuario =
                      matriculasDoUsuario(
                        usuario.id
                      )

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

                            <div className="mb-2">
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

                            <div className="mb-2">
                              <label className="form-label text-muted">
                                Nova senha
                              </label>

                              <input
                                type="password"
                                className="form-control"
                                placeholder="Deixe em branco para manter a senha atual"
                                value={
                                  editPassword
                                }
                                onChange={(e) =>
                                  setEditPassword(
                                    e.target
                                      .value
                                  )
                                }
                                autoComplete="new-password"
                              />
                            </div>

                            <div className="mb-3">
                              <label className="form-label text-muted">
                                Perfil
                              </label>

                              <select
                                className="form-select"
                                value={
                                  editPerfil
                                }
                                onChange={(e) =>
                                  setEditPerfil(
                                    e.target
                                      .value as PerfilUsuario
                                  )
                                }
                              >
                                <option value="ALUNO">
                                  Aluno
                                </option>

                                <option value="PROFESSOR">
                                  Professor
                                </option>

                                <option value="ADMIN">
                                  Administrador
                                </option>
                              </select>
                            </div>

                            <div className="crud-actions">
                              <button
                                type="button"
                                className="crud-btn crud-btn-primary"
                                onClick={() =>
                                  salvarEdicao(
                                    usuario
                                  )
                                }
                              >
                                Salvar
                              </button>

                              <button
                                type="button"
                                className="crud-btn crud-btn-secondary"
                                onClick={
                                  cancelarEdicao
                                }
                              >
                                Cancelar
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="d-flex justify-content-between align-items-start gap-3">
                              <div>
                                <strong>
                                  {
                                    usuario.nome
                                  }
                                </strong>

                                <div className="text-muted small mt-1">
                                  {
                                    usuario.email
                                  }
                                </div>

                                <div className="mt-2">
                                  <span className="badge text-bg-secondary">
                                    {nomePerfil(
                                      usuario.perfil
                                    )}
                                  </span>
                                </div>
                              </div>

                              <div className="crud-actions">
                                {usuario.perfil ===
                                  "ALUNO" && (
                                  <button
                                    type="button"
                                    className="crud-btn crud-btn-secondary crud-btn-icon"
                                    title="Histórico acadêmico"
                                    onClick={() =>
                                      setUsuarioDetalhes(
                                        detalhesAbertos
                                          ? null
                                          : usuario.id
                                      )
                                    }
                                  >
                                    <i
                                      className={`bi ${
                                        detalhesAbertos
                                          ? "bi-chevron-up"
                                          : "bi-journal-text"
                                      }`}
                                    />
                                  </button>
                                )}

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
                                  <i className="bi bi-pencil" />
                                </button>

                                <button
                                  type="button"
                                  className="crud-btn crud-btn-delete crud-btn-icon"
                                  title="Excluir usuário"
                                  onClick={() =>
                                    excluirUsuario(
                                      usuario
                                    )
                                  }
                                >
                                  <i className="bi bi-trash3" />
                                </button>
                              </div>
                            </div>

                            {detalhesAbertos &&
                              usuario.perfil ===
                                "ALUNO" && (
                                <div className="mt-4">
                                  <div className="border-top pt-3">
                                    <strong
                                      style={{
                                        fontSize:
                                          "13px",
                                      }}
                                    >
                                      Histórico
                                      acadêmico
                                    </strong>

                                    {matriculasUsuario.length ===
                                    0 ? (
                                      <p className="text-muted small mt-2 mb-0">
                                        Este
                                        aluno
                                        ainda
                                        não
                                        possui
                                        matrículas.
                                      </p>
                                    ) : (
                                      <div className="d-flex flex-column gap-3 mt-3">
                                        {matriculasUsuario.map(
                                          (
                                            matricula
                                          ) => {
                                            const curso =
                                              buscarCurso(
                                                matricula.idCurso
                                              )

                                            const progresso =
                                              calcularProgresso(
                                                matricula
                                              )

                                            return (
                                              <div
                                                key={
                                                  matricula.id
                                                }
                                                className="card p-3"
                                              >
                                                <div className="d-flex justify-content-between gap-3">
                                                  <div>
                                                    <strong
                                                      style={{
                                                        fontSize:
                                                          "12px",
                                                      }}
                                                    >
                                                      {curso?.nome ||
                                                        "Curso não encontrado"}
                                                    </strong>

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

                                                  <span
                                                    className={
                                                      matricula.dataConclusao
                                                        ? "badge text-bg-success"
                                                        : "badge text-bg-secondary"
                                                    }
                                                  >
                                                    {matricula.dataConclusao
                                                      ? "Concluído"
                                                      : "Em andamento"}
                                                  </span>
                                                </div>

                                                <div className="mt-3">
                                                  <div className="d-flex justify-content-between small mb-1">
                                                    <span className="text-muted">
                                                      Progresso
                                                    </span>

                                                    <span>
                                                      {
                                                        progresso.concluidas
                                                      }
                                                      /
                                                      {
                                                        progresso.total
                                                      }{" "}
                                                      (
                                                      {
                                                        progresso.percentual
                                                      }
                                                      %)
                                                    </span>
                                                  </div>

                                                  <div
                                                    className="progress"
                                                    style={{
                                                      height:
                                                        "6px",
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
                                                      aria-valuemin={
                                                        0
                                                      }
                                                      aria-valuemax={
                                                        100
                                                      }
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