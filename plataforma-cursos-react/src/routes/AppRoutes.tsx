import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "../components/Navbar"

import Home from "../pages/Home"
import Cursos from "../pages/Cursos"
import Usuarios from "../pages/Usuarios"
import Categorias from "../pages/Categorias"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/categorias" element={<Categorias />} />
      </Routes>
    </BrowserRouter>
  )
}