import api from "./api"

export type Certificado = {
  id: string
  idUsuario: string
  idCurso: string
  idTrilha: string | null

  usuario: string
  curso: string
  trilha: string

  codigo: string
  dataEmissao: string
}

export type CreateCertificadoData = {
  idUsuario: string
  idCurso: string
  idTrilha?: string | null
}

type CertificadoBackend = {
  ID_Certificado: number
  ID_Usuario: number
  ID_Curso: number
  ID_Trilha?: number | null
  CodigoVerificacao: string
  DataEmissao: string

  usuario?: {
    name: string
  }

  curso?: {
    Titulo: string
  }

  trilha?: {
    Titulo: string
  } | null
}

function converterCertificado(
  certificado: CertificadoBackend
): Certificado {
  return {
    id: String(
      certificado.ID_Certificado
    ),

    idUsuario: String(
      certificado.ID_Usuario
    ),

    idCurso: String(
      certificado.ID_Curso
    ),

    idTrilha:
      certificado.ID_Trilha != null
        ? String(
          certificado.ID_Trilha
        )
        : null,

    usuario:
      certificado.usuario?.name ??
      "Usuário",

    curso:
      certificado.curso?.Titulo ??
      "Curso",

    trilha:
      certificado.trilha?.Titulo ??
      "",

    codigo:
      certificado.CodigoVerificacao,

    dataEmissao:
      certificado.DataEmissao,
  }
}

export const getCertificados =
  async () => {
    const response =
      await api.get<
        CertificadoBackend[]
      >("/certificados")

    return {
      ...response,
      data: response.data.map(
        converterCertificado
      ),
    }
  }

export const createCertificado =
  async (
    data: CreateCertificadoData
  ) => {
    const response =
      await api.post<CertificadoBackend>(
        "/certificados",
        {
          ID_Usuario: Number(
            data.idUsuario
          ),

          ID_Curso: Number(
            data.idCurso
          ),

          ...(data.idTrilha
            ? {
              ID_Trilha: Number(
                data.idTrilha
              ),
            }
            : {}),
        }
      )

    return {
      ...response,
      data: converterCertificado(
        response.data
      ),
    }
  }

export const deleteCertificado = (
  id: string
) =>
  api.delete(
    `/certificados/${id}`
  )