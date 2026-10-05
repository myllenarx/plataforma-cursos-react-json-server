import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  createPlano,
  deletePlano,
  getPlanos,
  type Plano,
} from "../services/planosService"

import {
  createAssinatura,
  deleteAssinatura,
  getAssinaturas,
  type Assinatura,
} from "../services/assinaturasService"

import {
  createPagamento,
  getPagamentos,
  type MetodoPagamento,
  type Pagamento,
} from "../services/pagamentosService"

import {
  getUsuarioLogado,
} from "../services/auth"

export default function PlanosAssinaturas() {
  const usuario = getUsuarioLogado()
  const ehAdmin = usuario?.perfil === "ADMIN"
  const ehAluno = usuario?.perfil === "ALUNO"

  const [planos, setPlanos] = useState<Plano[]>([])
  const [assinaturas, setAssinaturas] =
    useState<Assinatura[]>([])
  const [pagamentos, setPagamentos] =
    useState<Pagamento[]>([])

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [preco, setPreco] = useState("")
  const [duracao, setDuracao] = useState("1")

  const [carregando, setCarregando] =
    useState(true)
  const [erro, setErro] = useState("")

  async function carregarDados() {
    try {
      setCarregando(true)
      setErro("")

      const planosResponse = await getPlanos()
      setPlanos(planosResponse.data)

      if (ehAluno || ehAdmin) {
        const [
          assinaturasResponse,
          pagamentosResponse,
        ] = await Promise.all([
          getAssinaturas(),
          getPagamentos(),
        ])

        setAssinaturas(
          assinaturasResponse.data,
        )

        setPagamentos(
          pagamentosResponse.data,
        )
      }
    } catch (error) {
      console.error(error)
      setErro(
        "Não foi possível carregar os dados.",
      )
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    void carregarDados()
  }, [])

  const assinaturaAtiva = useMemo(() => {
    if (!ehAluno) {
      return null
    }

    const agora = new Date()

    return (
      assinaturas.find(
        (assinatura) =>
          new Date(assinatura.dataFim) >= agora,
      ) ?? null
    )
  }, [assinaturas, ehAluno])

  async function handleCriarPlano(
    event: React.FormEvent,
  ) {
    event.preventDefault()

    if (!ehAdmin) {
      return
    }

    try {
      setErro("")

      await createPlano({
        nome,
        descricao,
        preco: Number(preco),
        duracaoMeses: Number(duracao),
      })

      setNome("")
      setDescricao("")
      setPreco("")
      setDuracao("1")

      await carregarDados()
    } catch (error) {
      console.error(error)
      setErro(
        "Não foi possível criar o plano.",
      )
    }
  }

  async function handleExcluirPlano(
    id: string,
  ) {
    if (!ehAdmin) {
      return
    }

    if (
      !window.confirm(
        "Deseja realmente excluir este plano?",
      )
    ) {
      return
    }

    try {
      setErro("")
      await deletePlano(id)
      await carregarDados()
    } catch (error) {
      console.error(error)
      setErro(
        "Não foi possível excluir o plano. Verifique se ele possui assinaturas.",
      )
    }
  }

  async function handleAssinar(plano: Plano) {
    if (!ehAluno || !usuario) {
      return
    }

    if (assinaturaAtiva) {
      setErro(
        "Você já possui uma assinatura ativa.",
      )
      return
    }

    try {
      setErro("")

      await createAssinatura(
        String(usuario.sub),
        plano.id,
      )

      await carregarDados()
    } catch (error) {
      console.error(error)
      setErro(
        "Não foi possível realizar a assinatura.",
      )
    }
  }

  async function handlePagamento(
    assinatura: Assinatura,
    metodo: MetodoPagamento,
  ) {
    if (!assinatura.plano) {
      return
    }

    try {
      setErro("")

      await createPagamento(
        assinatura.id,
        assinatura.plano.preco,
        metodo,
      )

      await carregarDados()
    } catch (error) {
      console.error(error)
      setErro(
        "Não foi possível registrar o pagamento.",
      )
    }
  }

  async function handleExcluirAssinatura(
    id: string,
  ) {
    if (!ehAdmin) {
      return
    }

    if (
      !window.confirm(
        "Deseja realmente excluir esta assinatura?",
      )
    ) {
      return
    }

    try {
      setErro("")
      await deleteAssinatura(id)
      await carregarDados()
    } catch (error) {
      console.error(error)
      setErro(
        "Não foi possível excluir a assinatura.",
      )
    }
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString(
      "pt-BR",
    )
  }

  function formatarPreco(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
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
          <h1>Planos e Assinaturas</h1>
          <p>
            Gerencie os planos e acompanhe as
            assinaturas da plataforma.
          </p>
        </div>
      </div>

      {erro && (
        <div className="alert alert-danger">
          {erro}
        </div>
      )}

      {ehAdmin && (
        <div className="crud-form-card mb-4">
          <h2>Novo plano</h2>

          <form
            onSubmit={handleCriarPlano}
            className="row g-3"
          >
            <div className="col-md-6">
              <label className="form-label">
                Nome
              </label>

              <input
                className="form-control"
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value)
                }
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">
                Preço
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={preco}
                onChange={(e) =>
                  setPreco(e.target.value)
                }
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">
                Duração (meses)
              </label>

              <input
                type="number"
                min="1"
                className="form-control"
                value={duracao}
                onChange={(e) =>
                  setDuracao(e.target.value)
                }
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">
                Descrição
              </label>

              <textarea
                className="form-control"
                value={descricao}
                onChange={(e) =>
                  setDescricao(e.target.value)
                }
              />
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="crud-btn"
              >
                Criar plano
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="crud-list-card">
        <h2>Planos disponíveis</h2>

        {planos.length === 0 ? (
          <p>Nenhum plano cadastrado.</p>
        ) : (
          <div className="row g-3">
            {planos.map((plano) => (
              <div
                key={plano.id}
                className="col-md-6 col-xl-4"
              >
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="h5">
                      {plano.nome}
                    </h3>

                    <p>
                      {plano.descricao ||
                        "Sem descrição."}
                    </p>

                    <strong>
                      {formatarPreco(plano.preco)}
                    </strong>

                    <p className="mt-2 mb-3">
                      {plano.duracaoMeses} mês(es)
                    </p>

                    {ehAluno && (
                      <button
                        type="button"
                        className="crud-btn"
                        disabled={
                          assinaturaAtiva !== null
                        }
                        onClick={() =>
                          handleAssinar(plano)
                        }
                      >
                        {assinaturaAtiva
                          ? "Assinatura ativa"
                          : "Assinar plano"}
                      </button>
                    )}

                    {ehAdmin && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          handleExcluirPlano(
                            plano.id,
                          )
                        }
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(ehAluno || ehAdmin) && (
        <div className="crud-list-card mt-4">
          <h2>
            {ehAluno
              ? "Minhas assinaturas"
              : "Assinaturas"}
          </h2>

          {assinaturas.length === 0 ? (
            <p>Nenhuma assinatura encontrada.</p>
          ) : (
            assinaturas.map((assinatura) => {
              const pagamentosDaAssinatura =
                pagamentos.filter(
                  (pagamento) =>
                    pagamento.idAssinatura ===
                    assinatura.id,
                )

              return (
                <div
                  key={assinatura.id}
                  className="card mb-3"
                >
                  <div className="card-body">
                    <h3 className="h5">
                      {assinatura.plano?.nome ??
                        "Plano"}
                    </h3>

                    {ehAdmin && (
                      <p>
                        Usuário:{" "}
                        {assinatura.usuario}
                      </p>
                    )}

                    <p>
                      Período:{" "}
                      {formatarData(
                        assinatura.dataInicio,
                      )}{" "}
                      até{" "}
                      {formatarData(
                        assinatura.dataFim,
                      )}
                    </p>

                    <p>
                      Pagamentos registrados:{" "}
                      {
                        pagamentosDaAssinatura.length
                      }
                    </p>

                    {ehAluno &&
                      pagamentosDaAssinatura.length ===
                        0 &&
                      assinatura.plano && (
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            type="button"
                            className="crud-btn"
                            onClick={() =>
                              handlePagamento(
                                assinatura,
                                "PIX",
                              )
                            }
                          >
                            Pagar com PIX
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() =>
                              handlePagamento(
                                assinatura,
                                "CARTAO",
                              )
                            }
                          >
                            Cartão
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() =>
                              handlePagamento(
                                assinatura,
                                "BOLETO",
                              )
                            }
                          >
                            Boleto
                          </button>
                        </div>
                      )}

                    {pagamentosDaAssinatura.map(
                      (pagamento) => (
                        <div
                          key={pagamento.id}
                          className="mt-2"
                        >
                          <small>
                            {
                              pagamento.metodoPagamento
                            }{" "}
                            —{" "}
                            {formatarPreco(
                              pagamento.valorPago,
                            )}{" "}
                            —{" "}
                            {formatarData(
                              pagamento.dataPagamento,
                            )}
                          </small>
                        </div>
                      ),
                    )}

                    {ehAdmin && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm mt-3"
                        onClick={() =>
                          handleExcluirAssinatura(
                            assinatura.id,
                          )
                        }
                      >
                        Excluir assinatura
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}