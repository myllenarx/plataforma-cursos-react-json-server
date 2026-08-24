import { useEffect, useState } from "react"

import { getCursos } from "../services/cursosService"
import { getCategorias } from "../services/categoriasService"
import { getUsuarios } from "../services/usuariosService"
import { getMatriculas } from "../services/matriculasService"

interface DashboardStats {
  cursos: number
  categorias: number
  usuarios: number
  matriculas: number
}

interface StatCardProps {
  label: string
  value: number
  icon: string
  description: string
}

function StatCard({
  label,
  value,
  icon,
  description,
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
  const [stats, setStats] = useState<DashboardStats>({
    cursos: 0,
    categorias: 0,
    usuarios: 0,
    matriculas: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError(false)

        const cursosResponse = await getCursos()
        console.log("CURSOS:", cursosResponse)

        const categoriasResponse = await getCategorias()
        console.log("CATEGORIAS:", categoriasResponse)

        const usuariosResponse = await getUsuarios()
        console.log("USUARIOS:", usuariosResponse)

        const matriculasResponse = await getMatriculas()
        console.log("MATRICULAS:", matriculasResponse)

        setStats({
          cursos: cursosResponse.data.length,
          categorias: categoriasResponse.data.length,
          usuarios: usuariosResponse.data.length,
          matriculas: matriculasResponse.data.length,
        })
      } catch (err) {
        console.error(
          "Erro ao carregar dados do dashboard:",
          err
        )

        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div
            className="spinner-border"
            role="status"
            aria-label="Carregando"
          />

          <span>Carregando informações...</span>
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

          <h2>Não foi possível carregar o dashboard</h2>

          <p>
            Verifique se o servidor de dados está funcionando
            e tente novamente.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">
            Visão geral
          </span>

          <h2>
            Bem-vinda à plataforma, Myllena.
          </h2>

          <p>
            Aqui você acompanha os principais indicadores
            da sua plataforma de cursos.
          </p>
        </div>

        <div className="dashboard-welcome-icon">
          <i className="bi bi-mortarboard" />
        </div>
      </section>

      <section className="dashboard-stats">
        <StatCard
          label="Cursos"
          value={stats.cursos}
          icon="bi-book"
          description="cursos cadastrados"
        />

        <StatCard
          label="Categorias"
          value={stats.categorias}
          icon="bi-collection"
          description="categorias disponíveis"
        />

        <StatCard
          label="Usuários"
          value={stats.usuarios}
          icon="bi-people"
          description="usuários cadastrados"
        />

        <StatCard
          label="Matrículas"
          value={stats.matriculas}
          icon="bi-person-check"
          description="matrículas realizadas"
        />
      </section>

      <section className="dashboard-content-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-eyebrow">
                Plataforma
              </span>

              <h3>Resumo geral</h3>
            </div>

            <div className="dashboard-panel-icon">
              <i className="bi bi-bar-chart-line" />
            </div>
          </div>

          <div className="dashboard-summary-list">
            <div className="dashboard-summary-item">
              <div>
                <span>Cursos disponíveis</span>
                <small>
                  Conteúdos cadastrados na plataforma
                </small>
              </div>

              <strong>{stats.cursos}</strong>
            </div>

            <div className="dashboard-summary-item">
              <div>
                <span>Categorias</span>
                <small>
                  Organização dos conteúdos
                </small>
              </div>

              <strong>{stats.categorias}</strong>
            </div>

            <div className="dashboard-summary-item">
              <div>
                <span>Usuários</span>
                <small>
                  Pessoas cadastradas no sistema
                </small>
              </div>

              <strong>{stats.usuarios}</strong>
            </div>

            <div className="dashboard-summary-item">
              <div>
                <span>Matrículas</span>
                <small>
                  Inscrições realizadas nos cursos
                </small>
              </div>

              <strong>{stats.matriculas}</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-panel dashboard-panel-highlight">
          <div className="dashboard-highlight-icon">
            <i className="bi bi-lightbulb" />
          </div>

          <span className="dashboard-panel-eyebrow">
            Próximos passos
          </span>

          <h3>
            Continue evoluindo a plataforma
          </h3>

          <p>
            A plataforma será expandida com módulos,
            aulas, trilhas de aprendizagem, progresso
            dos alunos e certificados.
          </p>

          <div className="dashboard-highlight-list">
            <span>
              <i className="bi bi-check2" />
              Cursos estruturados
            </span>

            <span>
              <i className="bi bi-check2" />
              Trilhas de aprendizagem
            </span>

            <span>
              <i className="bi bi-check2" />
              Progresso dos alunos
            </span>

            <span>
              <i className="bi bi-check2" />
              Backend e banco de dados
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}