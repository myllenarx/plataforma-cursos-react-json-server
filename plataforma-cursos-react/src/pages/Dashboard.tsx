import { useEffect, useMemo, useState } from "react"

import { getCursos } from "../services/cursosService"
import { getCategorias } from "../services/categoriasService"
import { getUsuarios } from "../services/usuariosService"
import {
  getMatriculas,
  type Matricula
} from "../services/matriculasService"

import {
  getProgressos,
  type Progresso
} from "../services/progressosService"

import {
  getCertificados,
  type Certificado
} from "../services/certificadosService"

import { getTrilhas } from "../services/trilhasService"

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
  idCategoria?: string | null
  modulos?: Modulo[]
}

type Usuario = {
  id: string
  nome: string
  email: string
}

type Categoria = {
  id: string
  nome: string
}

type Trilha = {
  id: string
  titulo: string
  descricao: string
  cursos: string[]
}

type DashboardData = {
  cursos: Curso[]
  categorias: Categoria[]
  usuarios: Usuario[]
  matriculas: Matricula[]
  progressos: Progresso[]
  certificados: Certificado[]
  trilhas: Trilha[]
}

type StatCardProps = {
  label: string
  value: number | string
  icon: string
  description: string
}

function StatCard({
  label,
  value,
  icon,
  description
}: StatCardProps) {
  return (
    <div className="dashboard-stat-card">

      <div className="dashboard-stat-header">

        <div className="dashboard-stat-icon">
          <i className={`bi ${icon}`} />
        </div>

        <span className="dashboard-stat-label">
          {label}
        </span>

      </div>

      <strong className="dashboard-stat-value">
        {value}
      </strong>

      <span className="dashboard-stat-description">
        {description}
      </span>

    </div>
  )
}

export default function Dashboard() {
  const [dados, setDados] =
    useState<DashboardData>({
      cursos: [],
      categorias: [],
      usuarios: [],
      matriculas: [],
      progressos: [],
      certificados: [],
      trilhas: []
    })

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(false)

  // =========================================================
  // CARREGAMENTO
  // =========================================================

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setLoading(true)
        setError(false)

        const [
          cursosResponse,
          categoriasResponse,
          usuariosResponse,
          matriculasResponse,
          progressosResponse,
          certificadosResponse,
          trilhasResponse
        ] = await Promise.all([
          getCursos(),
          getCategorias(),
          getUsuarios(),
          getMatriculas(),
          getProgressos(),
          getCertificados(),
          getTrilhas()
        ])

        setDados({
          cursos: cursosResponse.data,
          categorias: categoriasResponse.data,
          usuarios: usuariosResponse.data,
          matriculas: matriculasResponse.data,
          progressos: progressosResponse.data,
          certificados: certificadosResponse.data,
          trilhas: trilhasResponse.data
        })
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    carregarDashboard()
  }, [])

  // =========================================================
  // CÁLCULOS
  // =========================================================

  const indicadores = useMemo(() => {
    const matriculasConcluidas =
      dados.matriculas.filter(
        (matricula) =>
          Boolean(matricula.dataConclusao)
      )

    const matriculasEmAndamento =
      dados.matriculas.filter(
        (matricula) =>
          !matricula.dataConclusao
      )

    const totalModulos =
      dados.cursos.reduce(
        (total, curso) =>
          total +
          (curso.modulos || []).length,
        0
      )

    const totalAulas =
      dados.cursos.reduce(
        (total, curso) =>
          total +
          (curso.modulos || []).reduce(
            (subtotal, modulo) =>
              subtotal +
              (modulo.aulas || []).length,
            0
          ),
        0
      )

    let somaPercentuais = 0

    dados.matriculas.forEach(
      (matricula) => {
        const curso =
          dados.cursos.find(
            (item) =>
              String(item.id) ===
              String(matricula.idCurso)
          )

        if (!curso) {
          return
        }

        const aulas =
          (curso.modulos || []).flatMap(
            (modulo) =>
              modulo.aulas || []
          )

        if (aulas.length === 0) {
          return
        }

        const concluidas =
          dados.progressos.filter(
            (progresso) =>
              String(
                progresso.idUsuario
              ) ===
                String(
                  matricula.idUsuario
                ) &&
              String(
                progresso.idCurso
              ) ===
                String(
                  matricula.idCurso
                ) &&
              aulas.some(
                (aula) =>
                  String(aula.id) ===
                  String(
                    progresso.idAula
                  )
              )
          ).length

        somaPercentuais +=
          (concluidas /
            aulas.length) *
          100
      }
    )

    const progressoMedio =
      dados.matriculas.length === 0
        ? 0
        : Math.round(
            somaPercentuais /
              dados.matriculas.length
          )

    const taxaConclusao =
      dados.matriculas.length === 0
        ? 0
        : Math.round(
            (matriculasConcluidas.length /
              dados.matriculas.length) *
              100
          )

    return {
      matriculasConcluidas:
        matriculasConcluidas.length,

      matriculasEmAndamento:
        matriculasEmAndamento.length,

      totalModulos,

      totalAulas,

      progressoMedio,

      taxaConclusao
    }
  }, [dados])

  // =========================================================
  // CURSOS MAIS POPULARES
  // =========================================================

  const cursosMaisMatriculados =
    useMemo(() => {
      return dados.cursos
        .map((curso) => {
          const quantidade =
            dados.matriculas.filter(
              (matricula) =>
                String(
                  matricula.idCurso
                ) ===
                String(curso.id)
            ).length

          return {
            ...curso,
            quantidade
          }
        })
        .sort(
          (a, b) =>
            b.quantidade -
            a.quantidade
        )
        .slice(0, 5)
    }, [
      dados.cursos,
      dados.matriculas
    ])

  // =========================================================
  // MATRÍCULAS RECENTES
  // =========================================================

  const matriculasRecentes =
    useMemo(() => {
      return [
        ...dados.matriculas
      ]
        .reverse()
        .slice(0, 5)
    }, [dados.matriculas])

  function buscarUsuario(
    id: string
  ) {
    return (
      dados.usuarios.find(
        (usuario) =>
          String(usuario.id) ===
          String(id)
      )?.nome ||
      "Usuário não encontrado"
    )
  }

  function buscarCurso(
    id: string
  ) {
    return (
      dados.cursos.find(
        (curso) =>
          String(curso.id) ===
          String(id)
      )?.nome ||
      "Curso não encontrado"
    )
  }

  // =========================================================
  // ESTADOS
  // =========================================================

  if (loading) {
    return (
      <div className="dashboard-page">

        <div className="dashboard-loading">

          <div
            className="spinner-border"
            role="status"
            aria-label="Carregando"
          />

          <span>
            Carregando informações...
          </span>

        </div>

      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-page">

        <div className="dashboard-error">

          <div className="dashboard-error-icon">
            <i className="bi bi-exclamation-triangle" />
          </div>

          <h2>
            Não foi possível carregar o dashboard
          </h2>

          <p>
            Verifique se o servidor de
            dados está funcionando e
            tente novamente.
          </p>

        </div>

      </div>
    )
  }

  // =========================================================
  // INTERFACE
  // =========================================================

  return (
    <div className="dashboard-page">

      {/* CABEÇALHO */}
      <section className="dashboard-welcome">

        <div>

          <span className="dashboard-eyebrow">
            Visão geral
          </span>

          <h2>
            Painel administrativo
          </h2>

          <p>
            Acompanhe os principais
            indicadores acadêmicos da
            plataforma.
          </p>

        </div>

        <div className="dashboard-welcome-icon">
          <i className="bi bi-mortarboard" />
        </div>

      </section>

      {/* INDICADORES PRINCIPAIS */}
      <section className="dashboard-stats">

        <StatCard
          label="Usuários"
          value={dados.usuarios.length}
          icon="bi-people"
          description="usuários cadastrados"
        />

        <StatCard
          label="Cursos"
          value={dados.cursos.length}
          icon="bi-book"
          description="cursos disponíveis"
        />

        <StatCard
          label="Matrículas"
          value={dados.matriculas.length}
          icon="bi-person-check"
          description="matrículas realizadas"
        />

        <StatCard
          label="Certificados"
          value={
            dados.certificados.length
          }
          icon="bi-award"
          description="certificados emitidos"
        />

      </section>

      {/* SEGUNDA LINHA */}
      <section className="dashboard-stats mt-3">

        <StatCard
          label="Trilhas"
          value={dados.trilhas.length}
          icon="bi-signpost-split"
          description="trilhas cadastradas"
        />

        <StatCard
          label="Aulas"
          value={
            indicadores.totalAulas
          }
          icon="bi-play-btn"
          description="aulas disponíveis"
        />

        <StatCard
          label="Conclusões"
          value={
            indicadores.matriculasConcluidas
          }
          icon="bi-check-circle"
          description="cursos concluídos"
        />

        <StatCard
          label="Taxa de conclusão"
          value={`${indicadores.taxaConclusao}%`}
          icon="bi-graph-up-arrow"
          description="das matrículas"
        />

      </section>

      {/* CONTEÚDO */}
      <section className="dashboard-content-grid">

        {/* RESUMO ACADÊMICO */}
        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <span className="dashboard-panel-eyebrow">
                Acadêmico
              </span>

              <h3>
                Resumo da plataforma
              </h3>

            </div>

            <div className="dashboard-panel-icon">
              <i className="bi bi-bar-chart-line" />
            </div>

          </div>

          <div className="dashboard-summary-list">

            <div className="dashboard-summary-item">

              <div>
                <span>
                  Matrículas em andamento
                </span>

                <small>
                  Alunos com cursos ainda não concluídos
                </small>
              </div>

              <strong>
                {
                  indicadores.matriculasEmAndamento
                }
              </strong>

            </div>

            <div className="dashboard-summary-item">

              <div>
                <span>
                  Cursos concluídos
                </span>

                <small>
                  Matrículas que chegaram a 100%
                </small>
              </div>

              <strong>
                {
                  indicadores.matriculasConcluidas
                }
              </strong>

            </div>

            <div className="dashboard-summary-item">

              <div>
                <span>
                  Progresso médio
                </span>

                <small>
                  Média geral das matrículas
                </small>
              </div>

              <strong>
                {
                  indicadores.progressoMedio
                }
                %
              </strong>

            </div>

            <div className="dashboard-summary-item">

              <div>
                <span>
                  Estrutura de conteúdo
                </span>

                <small>
                  Módulos e aulas cadastrados
                </small>
              </div>

              <strong>
                {
                  indicadores.totalModulos
                }{" "}
                /{" "}
                {
                  indicadores.totalAulas
                }
              </strong>

            </div>

            <div className="dashboard-summary-item">

              <div>
                <span>
                  Categorias
                </span>

                <small>
                  Organização dos cursos
                </small>
              </div>

              <strong>
                {
                  dados.categorias.length
                }
              </strong>

            </div>

          </div>

        </div>

        {/* STATUS */}
        <div className="dashboard-panel dashboard-panel-highlight">

          <div className="dashboard-highlight-icon">
            <i className="bi bi-check2-circle" />
          </div>

          <span className="dashboard-panel-eyebrow">
            Plataforma
          </span>

          <h3>
            Núcleo acadêmico implementado
          </h3>

          <p>
            A plataforma já possui um
            fluxo completo de gerenciamento
            acadêmico e acompanhamento dos
            alunos.
          </p>

          <div className="dashboard-highlight-list">

            <span>
              <i className="bi bi-check2" />
              Cursos, módulos e aulas
            </span>

            <span>
              <i className="bi bi-check2" />
              Trilhas de aprendizagem
            </span>

            <span>
              <i className="bi bi-check2" />
              Matrículas e progresso
            </span>

            <span>
              <i className="bi bi-check2" />
              Conclusão e certificados
            </span>

          </div>

        </div>

      </section>

      {/* CURSOS POPULARES + MATRÍCULAS */}
      <section
        className="dashboard-content-grid"
        style={{
          marginTop: "20px"
        }}
      >

        {/* CURSOS MAIS MATRICULADOS */}
        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <span className="dashboard-panel-eyebrow">
                Cursos
              </span>

              <h3>
                Mais matriculados
              </h3>

            </div>

            <div className="dashboard-panel-icon">
              <i className="bi bi-trophy" />
            </div>

          </div>

          {cursosMaisMatriculados.length ===
          0 ? (

            <p className="text-muted mb-0">
              Nenhum curso cadastrado.
            </p>

          ) : (

            <div className="dashboard-summary-list">

              {cursosMaisMatriculados.map(
                (curso, index) => (

                  <div
                    className="dashboard-summary-item"
                    key={curso.id}
                  >

                    <div>

                      <span>
                        {index + 1}.{" "}
                        {curso.nome}
                      </span>

                      <small>
                        {curso.quantidade ===
                        1
                          ? "1 matrícula"
                          : `${curso.quantidade} matrículas`}
                      </small>

                    </div>

                    <strong>
                      {
                        curso.quantidade
                      }
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* MATRÍCULAS RECENTES */}
        <div className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <span className="dashboard-panel-eyebrow">
                Atividade
              </span>

              <h3>
                Matrículas recentes
              </h3>

            </div>

            <div className="dashboard-panel-icon">
              <i className="bi bi-clock-history" />
            </div>

          </div>

          {matriculasRecentes.length ===
          0 ? (

            <p className="text-muted mb-0">
              Nenhuma matrícula realizada.
            </p>

          ) : (

            <div className="dashboard-summary-list">

              {matriculasRecentes.map(
                (matricula) => (

                  <div
                    className="dashboard-summary-item"
                    key={matricula.id}
                  >

                    <div>

                      <span>
                        {buscarUsuario(
                          matricula.idUsuario
                        )}
                      </span>

                      <small>
                        {buscarCurso(
                          matricula.idCurso
                        )}
                        {" · "}
                        {
                          matricula.dataMatricula
                        }
                      </small>

                    </div>

                    {matricula.dataConclusao ? (

                      <i
                        className="bi bi-check-circle"
                        style={{
                          color:
                            "var(--color-success)"
                        }}
                        title="Concluído"
                      />

                    ) : (

                      <i
                        className="bi bi-hourglass-split"
                        style={{
                          color:
                            "var(--wine-light)"
                        }}
                        title="Em andamento"
                      />

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </section>

    </div>
  )
}