import { useEffect, useState } from "react"

import { getCategorias } from "../services/categoriasService"
import {
  createCurso,
  deleteCurso,
  getCursos,
  updateCurso,
  type Curso,
  type NivelCurso,
} from "../services/cursosService"
import {
  createModulo,
  deleteModulo,
} from "../services/modulosService"
import {
  createAula,
  deleteAula,
  type TipoConteudo,
} from "../services/aulasService"
import {
  getUsuarios,
  type Usuario,
} from "../services/usuariosService"
import { getUsuarioLogado } from "../services/auth"

type Categoria = {
  id: string
  nome: string
}

export default function Cursos() {
  const usuarioLogado = getUsuarioLogado()
  const perfil = usuarioLogado?.perfil

  const podeGerenciar =
    perfil === "ADMIN" || perfil === "PROFESSOR"

  const [cursos, setCursos] = useState<Curso[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [professores, setProfessores] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [idCategoria, setIdCategoria] = useState("")
  const [idInstrutor, setIdInstrutor] = useState("")
  const [nivel, setNivel] =
    useState<NivelCurso>("INICIANTE")

  const [editando, setEditando] =
    useState<string | null>(null)

  const [editNome, setEditNome] = useState("")
  const [editDescricao, setEditDescricao] = useState("")
  const [editCategoria, setEditCategoria] = useState("")
  const [editNivel, setEditNivel] =
    useState<NivelCurso>("INICIANTE")

  const [cursoModuloAberto, setCursoModuloAberto] =
    useState<string | null>(null)

  const [tituloModulo, setTituloModulo] = useState("")

  const [moduloAulaAberto, setModuloAulaAberto] =
    useState<string | null>(null)

  const [tituloAula, setTituloAula] = useState("")
  const [tipoAula, setTipoAula] =
    useState<TipoConteudo>("VIDEO")

  const [urlAula, setUrlAula] = useState("")
  const [duracaoAula, setDuracaoAula] = useState("")

  async function carregarCursos() {
    try {
      const response = await getCursos()
      setCursos(response.data)
    } catch (error) {
      console.error("Erro ao carregar cursos:", error)
      alert("Não foi possível carregar os cursos.")
    } finally {
      setLoading(false)
    }
  }

  async function carregarCategorias() {
    try {
      const response = await getCategorias()
      setCategorias(response.data)
    } catch (error) {
      console.error(
        "Erro ao carregar categorias:",
        error
      )
    }
  }

  async function carregarProfessores() {
    if (perfil !== "ADMIN") {
      return
    }

    try {
      const response = await getUsuarios()

      setProfessores(
        response.data.filter(
          (usuario) =>
            usuario.perfil === "PROFESSOR"
        )
      )
    } catch (error) {
      console.error(
        "Erro ao carregar professores:",
        error
      )
    }
  }

  useEffect(() => {
    carregarCursos()
    carregarCategorias()
    carregarProfessores()
  }, [])

  function instrutorDoNovoCurso() {
    if (perfil === "PROFESSOR") {
      return String(usuarioLogado?.sub ?? "")
    }

    return idInstrutor
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (!nome.trim()) {
      alert("Informe o nome do curso.")
      return
    }

    if (!idCategoria) {
      alert("Selecione uma categoria.")
      return
    }

    const instrutor = instrutorDoNovoCurso()

    if (!instrutor) {
      alert(
        "Selecione o professor responsável pelo curso."
      )
      return
    }

    try {
      await createCurso({
        nome: nome.trim(),
        descricao: descricao.trim(),
        idInstrutor: instrutor,
        idCategoria,
        nivel,
        totalAulas: 0,
        totalHoras: 0,
      })

      setNome("")
      setDescricao("")
      setIdCategoria("")
      setIdInstrutor("")
      setNivel("INICIANTE")

      await carregarCursos()
    } catch (error) {
      console.error(
        "Erro ao cadastrar curso:",
        error
      )

      alert(
        "Não foi possível cadastrar o curso."
      )
    }
  }

  function iniciarEdicao(curso: Curso) {
    setEditando(curso.id)
    setEditNome(curso.nome)
    setEditDescricao(curso.descricao)
    setEditCategoria(curso.idCategoria || "")
    setEditNivel(curso.nivel)
  }

  function cancelarEdicao() {
    setEditando(null)
    setEditNome("")
    setEditDescricao("")
    setEditCategoria("")
    setEditNivel("INICIANTE")
  }

  async function handleUpdate(curso: Curso) {
    if (!editNome.trim()) {
      alert("Informe o nome do curso.")
      return
    }

    if (!editCategoria) {
      alert("Selecione uma categoria.")
      return
    }

    try {
      await updateCurso(curso.id, {
        nome: editNome.trim(),
        descricao: editDescricao.trim(),
        idCategoria: editCategoria,
        nivel: editNivel,
      })

      cancelarEdicao()
      await carregarCursos()
    } catch (error) {
      console.error(
        "Erro ao atualizar curso:",
        error
      )

      alert(
        "Não foi possível atualizar o curso."
      )
    }
  }

  async function handleDelete(id: string) {
    const confirmar = window.confirm(
      "Deseja realmente excluir este curso?"
    )

    if (!confirmar) {
      return
    }

    try {
      await deleteCurso(id)
      await carregarCursos()
    } catch (error) {
      console.error(
        "Erro ao excluir curso:",
        error
      )

      alert(
        "Não foi possível excluir o curso. Verifique se ele possui dados vinculados."
      )
    }
  }

  function abrirNovoModulo(cursoId: string) {
    if (cursoModuloAberto === cursoId) {
      setCursoModuloAberto(null)
      setTituloModulo("")
      return
    }

    setCursoModuloAberto(cursoId)
    setTituloModulo("")
  }

  async function adicionarModulo(
    curso: Curso
  ) {
    if (!tituloModulo.trim()) {
      alert("Informe o título do módulo.")
      return
    }

    try {
      await createModulo({
        idCurso: curso.id,
        titulo: tituloModulo.trim(),
        ordem: curso.modulos.length + 1,
      })

      setTituloModulo("")
      setCursoModuloAberto(null)

      await carregarCursos()
    } catch (error) {
      console.error(
        "Erro ao cadastrar módulo:",
        error
      )

      alert(
        "Não foi possível cadastrar o módulo."
      )
    }
  }

  async function excluirModulo(
    moduloId: string
  ) {
    const confirmar = window.confirm(
      "Deseja realmente excluir este módulo e suas aulas?"
    )

    if (!confirmar) {
      return
    }

    try {
      await deleteModulo(moduloId)
      await carregarCursos()
    } catch (error) {
      console.error(
        "Erro ao excluir módulo:",
        error
      )

      alert(
        "Não foi possível excluir o módulo."
      )
    }
  }

  function limparFormularioAula() {
    setTituloAula("")
    setTipoAula("VIDEO")
    setUrlAula("")
    setDuracaoAula("")
  }

  function abrirNovaAula(moduloId: string) {
    if (moduloAulaAberto === moduloId) {
      setModuloAulaAberto(null)
      limparFormularioAula()
      return
    }

    setModuloAulaAberto(moduloId)
    limparFormularioAula()
  }

  async function adicionarAula(
    curso: Curso,
    moduloId: string
  ) {
    if (!tituloAula.trim()) {
      alert("Informe o título da aula.")
      return
    }

    if (urlAula.trim()) {
      try {
        new URL(urlAula.trim())
      } catch {
        alert(
          "Informe uma URL válida para o conteúdo."
        )
        return
      }
    }

    const modulo = curso.modulos.find(
      (item) => item.id === moduloId
    )

    if (!modulo) {
      return
    }

    const duracao =
      duracaoAula === ""
        ? undefined
        : Number(duracaoAula)

    if (
      duracao !== undefined &&
      (Number.isNaN(duracao) || duracao < 0)
    ) {
      alert("Informe uma duração válida.")
      return
    }

    try {
      await createAula({
        idModulo: moduloId,
        titulo: tituloAula.trim(),
        tipoConteudo: tipoAula,
        urlConteudo:
          urlAula.trim() || undefined,
        duracaoMinutos: duracao,
        ordem: modulo.aulas.length + 1,
      })

      limparFormularioAula()
      setModuloAulaAberto(null)

      await carregarCursos()
    } catch (error) {
      console.error(
        "Erro ao cadastrar aula:",
        error
      )

      alert(
        "Não foi possível cadastrar a aula."
      )
    }
  }

  async function excluirAula(
    aulaId: string
  ) {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta aula?"
    )

    if (!confirmar) {
      return
    }

    try {
      await deleteAula(aulaId)
      await carregarCursos()
    } catch (error) {
      console.error(
        "Erro ao excluir aula:",
        error
      )

      alert(
        "Não foi possível excluir a aula."
      )
    }
  }

  function buscarCategoria(
    id: string | null
  ) {
    return (
      categorias.find(
        (categoria) =>
          String(categoria.id) === String(id)
      )?.nome || "Sem categoria"
    )
  }

  function podeGerenciarCurso(
    curso: Curso
  ) {
    if (perfil === "ADMIN") {
      return true
    }

    if (perfil === "PROFESSOR") {
      return (
        String(curso.idInstrutor) ===
        String(usuarioLogado?.sub)
      )
    }

    return false
  }

  function nomeNivel(nivelCurso: NivelCurso) {
    if (nivelCurso === "INTERMEDIARIO") {
      return "Intermediário"
    }

    if (nivelCurso === "AVANCADO") {
      return "Avançado"
    }

    return "Iniciante"
  }

  return (
    <div className="container mt-4 crud-page">
      <div className="crud-page-header">
        <h2>Cursos</h2>

        <p>
          Gerencie cursos, módulos e aulas da
          plataforma.
        </p>
      </div>

      <div
        className={
          podeGerenciar
            ? "crud-two-column"
            : ""
        }
      >
        {podeGerenciar && (
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
                  Descrição
                </label>

                <textarea
                  className="form-control"
                  placeholder="Descrição do curso"
                  value={descricao}
                  onChange={(e) =>
                    setDescricao(e.target.value)
                  }
                  rows={3}
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
                    setIdCategoria(
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

              <div className="mb-3">
                <label className="form-label text-muted">
                  Nível
                </label>

                <select
                  className="form-select"
                  value={nivel}
                  onChange={(e) =>
                    setNivel(
                      e.target
                        .value as NivelCurso
                    )
                  }
                >
                  <option value="INICIANTE">
                    Iniciante
                  </option>

                  <option value="INTERMEDIARIO">
                    Intermediário
                  </option>

                  <option value="AVANCADO">
                    Avançado
                  </option>
                </select>
              </div>

              {perfil === "ADMIN" && (
                <div className="mb-3">
                  <label className="form-label text-muted">
                    Professor
                  </label>

                  <select
                    className="form-select"
                    value={idInstrutor}
                    onChange={(e) =>
                      setIdInstrutor(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Selecione um professor
                    </option>

                    {professores.map(
                      (professor) => (
                        <option
                          key={professor.id}
                          value={professor.id}
                        >
                          {professor.nome}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              <div className="crud-form-actions">
                <button
                  type="submit"
                  className="crud-btn crud-btn-primary"
                >
                  <i className="bi bi-plus-lg" />
                  Cadastrar curso
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card crud-list-card">
          <div className="crud-list-header">
            <h5>Cursos cadastrados</h5>

            <small className="text-muted">
              {podeGerenciar
                ? "Gerencie os cursos e seus conteúdos"
                : "Consulte os cursos disponíveis"}
            </small>
          </div>

          {loading ? (
            <div className="p-4 text-center text-muted">
              Carregando...
            </div>
          ) : cursos.length === 0 ? (
            <div className="p-4 text-center">
              <i className="bi bi-book fs-3 text-muted" />

              <p className="mt-2 mb-0">
                Nenhum curso cadastrado.
              </p>
            </div>
          ) : (
            <div className="p-3">
              <div className="d-flex flex-column gap-3">
                {cursos.map((curso) => {
                  const gerenciaEsteCurso =
                    podeGerenciarCurso(curso)

                  return (
                    <div
                      key={curso.id}
                      className="card p-3"
                    >
                      {editando ===
                      curso.id ? (
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

                          <div className="mb-2">
                            <label className="form-label text-muted">
                              Descrição
                            </label>

                            <textarea
                              className="form-control"
                              value={
                                editDescricao
                              }
                              onChange={(e) =>
                                setEditDescricao(
                                  e.target.value
                                )
                              }
                              rows={2}
                            />
                          </div>

                          <div className="mb-2">
                            <label className="form-label text-muted">
                              Categoria
                            </label>

                            <select
                              className="form-select"
                              value={
                                editCategoria
                              }
                              onChange={(e) =>
                                setEditCategoria(
                                  e.target.value
                                )
                              }
                            >
                              <option value="">
                                Selecione uma
                                categoria
                              </option>

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
                              Nível
                            </label>

                            <select
                              className="form-select"
                              value={editNivel}
                              onChange={(e) =>
                                setEditNivel(
                                  e.target
                                    .value as NivelCurso
                                )
                              }
                            >
                              <option value="INICIANTE">
                                Iniciante
                              </option>

                              <option value="INTERMEDIARIO">
                                Intermediário
                              </option>

                              <option value="AVANCADO">
                                Avançado
                              </option>
                            </select>
                          </div>

                          <div className="crud-actions">
                            <button
                              type="button"
                              className="crud-btn crud-btn-primary"
                              onClick={() =>
                                handleUpdate(
                                  curso
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
                              <h5 className="mb-1">
                                {curso.nome}
                              </h5>

                              <div className="text-muted small">
                                {buscarCategoria(
                                  curso.idCategoria
                                )}
                                {" · "}
                                {nomeNivel(
                                  curso.nivel
                                )}
                              </div>

                              {curso.descricao && (
                                <p className="text-muted small mt-2 mb-0">
                                  {
                                    curso.descricao
                                  }
                                </p>
                              )}

                              <div className="text-muted small mt-2">
                                <i className="bi bi-person me-1" />
                                {
                                  curso.nomeInstrutor
                                }
                              </div>

                              <div className="text-muted small mt-1">
                                {
                                  curso.modulos
                                    .length
                                }{" "}
                                módulo(s)
                                {" · "}
                                {curso.modulos.reduce(
                                  (
                                    total,
                                    modulo
                                  ) =>
                                    total +
                                    modulo.aulas
                                      .length,
                                  0
                                )}{" "}
                                aula(s)
                              </div>
                            </div>

                            {gerenciaEsteCurso && (
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
                                  <i className="bi bi-pencil" />
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
                                  <i className="bi bi-trash3" />
                                </button>
                              </div>
                            )}
                          </div>

                          {gerenciaEsteCurso && (
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
                                <i className="bi bi-plus-lg" />
                                Adicionar módulo
                              </button>
                            </div>
                          )}

                          {cursoModuloAberto ===
                            curso.id &&
                            gerenciaEsteCurso && (
                              <div className="mt-3">
                                <div className="d-flex gap-2">
                                  <input
                                    className="form-control"
                                    placeholder="Título do módulo"
                                    value={
                                      tituloModulo
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      setTituloModulo(
                                        e.target
                                          .value
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

                          {curso.modulos.length >
                            0 && (
                            <div className="mt-4">
                              <small className="text-muted">
                                Conteúdo do
                                curso
                              </small>

                              <div className="d-flex flex-column gap-2 mt-2">
                                {curso.modulos.map(
                                  (
                                    modulo,
                                    index
                                  ) => (
                                    <div
                                      key={
                                        modulo.id
                                      }
                                      className="card p-3"
                                    >
                                      <div className="d-flex justify-content-between align-items-center gap-3">
                                        <div>
                                          <strong
                                            style={{
                                              fontSize:
                                                "13px",
                                            }}
                                          >
                                            Módulo{" "}
                                            {index +
                                              1}
                                            :{" "}
                                            {
                                              modulo.titulo
                                            }
                                          </strong>

                                          <div className="text-muted small mt-1">
                                            {
                                              modulo
                                                .aulas
                                                .length
                                            }{" "}
                                            aula(s)
                                          </div>
                                        </div>

                                        {gerenciaEsteCurso && (
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
                                              <i className="bi bi-plus-lg" />
                                            </button>

                                            <button
                                              type="button"
                                              className="crud-btn crud-btn-delete crud-btn-icon"
                                              title="Excluir módulo"
                                              onClick={() =>
                                                excluirModulo(
                                                  modulo.id
                                                )
                                              }
                                            >
                                              <i className="bi bi-trash3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      {moduloAulaAberto ===
                                        modulo.id &&
                                        gerenciaEsteCurso && (
                                          <div className="mt-3">
                                            <div className="row g-2">
                                              <div className="col-12">
                                                <input
                                                  className="form-control"
                                                  placeholder="Título da aula"
                                                  value={
                                                    tituloAula
                                                  }
                                                  onChange={(
                                                    e
                                                  ) =>
                                                    setTituloAula(
                                                      e
                                                        .target
                                                        .value
                                                    )
                                                  }
                                                />
                                              </div>

                                              <div className="col-md-4">
                                                <select
                                                  className="form-select"
                                                  value={
                                                    tipoAula
                                                  }
                                                  onChange={(
                                                    e
                                                  ) =>
                                                    setTipoAula(
                                                      e
                                                        .target
                                                        .value as TipoConteudo
                                                    )
                                                  }
                                                >
                                                  <option value="VIDEO">
                                                    Vídeo
                                                  </option>

                                                  <option value="TEXTO">
                                                    Texto
                                                  </option>

                                                  <option value="QUIZ">
                                                    Quiz
                                                  </option>
                                                </select>
                                              </div>

                                              <div className="col-md-5">
                                                <input
                                                  className="form-control"
                                                  placeholder="URL do conteúdo (opcional)"
                                                  value={
                                                    urlAula
                                                  }
                                                  onChange={(
                                                    e
                                                  ) =>
                                                    setUrlAula(
                                                      e
                                                        .target
                                                        .value
                                                    )
                                                  }
                                                />
                                              </div>

                                              <div className="col-md-3">
                                                <input
                                                  className="form-control"
                                                  type="number"
                                                  min="0"
                                                  step="1"
                                                  placeholder="Minutos"
                                                  value={
                                                    duracaoAula
                                                  }
                                                  onChange={(
                                                    e
                                                  ) =>
                                                    setDuracaoAula(
                                                      e
                                                        .target
                                                        .value
                                                    )
                                                  }
                                                />
                                              </div>
                                            </div>

                                            <div className="mt-2">
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
                                                aula
                                              </button>
                                            </div>
                                          </div>
                                        )}

                                      {modulo.aulas
                                        .length >
                                        0 && (
                                        <div className="mt-3">
                                          {modulo.aulas.map(
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
                                                  style={{
                                                    fontSize:
                                                      "12px",
                                                  }}
                                                >
                                                  <div className="d-flex align-items-center gap-2">
                                                    <i className="bi bi-play-circle text-muted" />

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

                                                  <div className="text-muted mt-1">
                                                    {
                                                      aula.tipoConteudo
                                                    }

                                                    {aula.duracaoMinutos !==
                                                    null
                                                      ? ` · ${aula.duracaoMinutos} min`
                                                      : ""}
                                                  </div>

                                                  {aula.urlConteudo && (
                                                    <div className="mt-1">
                                                      <a
                                                        href={
                                                          aula.urlConteudo
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                      >
                                                        Abrir
                                                        conteúdo
                                                      </a>
                                                    </div>
                                                  )}
                                                </div>

                                                {gerenciaEsteCurso && (
                                                  <button
                                                    type="button"
                                                    className="crud-btn crud-btn-delete crud-btn-icon"
                                                    title="Excluir aula"
                                                    onClick={() =>
                                                      excluirAula(
                                                        aula.id
                                                      )
                                                    }
                                                  >
                                                    <i className="bi bi-trash3" />
                                                  </button>
                                                )}
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
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}