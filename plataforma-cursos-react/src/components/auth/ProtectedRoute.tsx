import { Navigate, Outlet } from "react-router-dom"
import {
  getUsuarioLogado,
  type PerfilUsuario,
} from "../../services/auth"

interface ProtectedRouteProps {
  perfis?: PerfilUsuario[]
}

export default function ProtectedRoute({
  perfis,
}: ProtectedRouteProps) {
  const usuario = getUsuarioLogado()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (
    perfis &&
    !perfis.includes(usuario.perfil)
  ) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}