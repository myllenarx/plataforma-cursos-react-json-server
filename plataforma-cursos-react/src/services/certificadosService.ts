import api from "./api"

export type Certificado = {
  id: string
  idUsuario: string
  idCurso: string
  usuario: string
  curso: string
  codigo: string
  dataEmissao: string
}

export const getCertificados = () =>
  api.get<Certificado[]>("/certificados")

export const createCertificado = (
  data: Omit<Certificado, "id">
) =>
  api.post<Certificado>(
    "/certificados",
    data
  )

export const deleteCertificado = (
  id: string
) =>
  api.delete(`/certificados/${id}`)