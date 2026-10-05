import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"

import AppLayout from "../components/layout/AppLayout"
import ProtectedRoute from "../components/auth/ProtectedRoute"

import Login from "../pages/Login"
import Home from "../pages/Home"
import Dashboard from "../pages/Dashboard"
import Cursos from "../pages/Cursos"
import Trilhas from "../pages/Trilhas"
import Usuarios from "../pages/Usuarios"
import Categorias from "../pages/Categorias"
import Matriculas from "../pages/Matriculas"
import Certificados from "../pages/Certificados"
import PlanosAssinaturas from "../pages/PlanosAssinaturas"
import Avaliacoes from "../pages/Avaliacoes"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/cursos"
              element={<Cursos />}
            />

            <Route
              path="/trilhas"
              element={<Trilhas />}
            />

            <Route
              path="/avaliacoes"
              element={<Avaliacoes />}
            />

            <Route
              path="/home"
              element={<Home />}
            />

            <Route
              element={
                <ProtectedRoute
                  perfis={[
                    "ALUNO",
                    "ADMIN",
                  ]}
                />
              }
            >
              <Route
                path="/matriculas"
                element={<Matriculas />}
              />

              <Route
                path="/certificados"
                element={<Certificados />}
              />

              <Route
                path="/planos"
                element={
                  <PlanosAssinaturas />
                }
              />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  perfis={["ADMIN"]}
                />
              }
            >
              <Route
                path="/categorias"
                element={<Categorias />}
              />

              <Route
                path="/usuarios"
                element={<Usuarios />}
              />
            </Route>
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}