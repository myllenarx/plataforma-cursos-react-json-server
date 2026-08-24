import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"

import AppLayout from "../components/layout/AppLayout"

import Home from "../pages/Home"
import Dashboard from "../pages/Dashboard"
import Cursos from "../pages/Cursos"
import Trilhas from "../pages/Trilhas"
import Usuarios from "../pages/Usuarios"
import Categorias from "../pages/Categorias"
import Matriculas from "../pages/Matriculas"
import Certificados from "../pages/Certificados"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
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
            path="/categorias"
            element={<Categorias />}
          />

          <Route
            path="/matriculas"
            element={<Matriculas />}
          />

          <Route
            path="/certificados"
            element={<Certificados />}
          />

          <Route
            path="/usuarios"
            element={<Usuarios />}
          />

          <Route
            path="/home"
            element={<Home />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}