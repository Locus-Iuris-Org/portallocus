import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Dashboard from './pages/Dashboard'
import AguardandoAcesso from './pages/AguardandoAcesso'
import RotaProtegida from './components/RotaProtegida'
import { useAuth } from './hooks/useAuth'

// Decide qual tela mostrar para quem já está autenticado.
function Home() {
  const { cargo, carregando } = useAuth()

  if (carregando) {
    return null
  }

  // Premissa: cargo.nome === 'Sem acesso' bloqueia o acesso (cargo nulo também).
  const cargoSemAcesso = !cargo || cargo.nome === 'Sem acesso'

  return cargoSemAcesso ? <AguardandoAcesso /> : <Dashboard />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/"
          element={
            <RotaProtegida>
              <Home />
            </RotaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
