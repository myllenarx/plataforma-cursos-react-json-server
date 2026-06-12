import api from "./api"

export const getCertificados = () =>
  api.get("/certificados")

export const createCertificado = (data: any) =>
  api.post("/certificados", data)