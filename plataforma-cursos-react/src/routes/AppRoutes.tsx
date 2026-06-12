import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "../components/Navbar"

import Home from "../pages/Home"
import Cursos from "../pages/Cursos"
import Usuarios from "../pages/Usuarios"
import Categorias from "../pages/Categorias"
import Matriculas from "../pages/Matriculas"
import Certificados from "../pages/Certificados"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/matriculas" element={<Matriculas />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/certificados" element={<Certificados />} />
      </Routes>
    </BrowserRouter>
  )
}