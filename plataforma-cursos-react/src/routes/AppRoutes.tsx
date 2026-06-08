import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "../components/Navbar"
import Cursos from "../pages/Cursos"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<h1 className="container mt-4">Home</h1>} />
        <Route path="/cursos" element={<Cursos />} />
      </Routes>
    </BrowserRouter>
  )
}