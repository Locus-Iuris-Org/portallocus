import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import EsqueciSenha from './pages/EsqueciSenha'
import RedefinirSenha from './pages/RedefinirSenha'
import Homepage from './pages/Homepage'
import Dashboard from './pages/Dashboard'
import EmConstrucao from './pages/EmConstrucao'
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

  return cargoSemAcesso ? <AguardandoAcesso /> : <Homepage />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        {/* Públicas: quem redefine a senha ainda não tem login normal. */}
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route
          path="/"
          element={
            <RotaProtegida>
              <Home />
            </RotaProtegida>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />

        {/* Telas ainda não construídas — placeholders para os links não
            caírem em tela branca. Trocar pela tela real quando existir. */}
        <Route
          path="/perfil"
          element={
            <RotaProtegida>
              <EmConstrucao
                titulo="Meu perfil"
                texto="Aqui você vai ver e editar seus dados de conta: nome, foto e senha."
              />
            </RotaProtegida>
          }
        />
        <Route
          path="/meus-resultados"
          element={
            <RotaProtegida>
              <EmConstrucao
                titulo="Meus Resultados"
                texto="Seu desempenho individual e suas metas do semestre vão ficar nesta tela."
              />
            </RotaProtegida>
          }
        />
        <Route
          path="/biblia-de-vendas"
          element={
            <RotaProtegida>
              <EmConstrucao
                titulo="Bíblia de Vendas"
                texto="O registro detalhado de cada venda do semestre vai ficar nesta tela."
              />
            </RotaProtegida>
          }
        />
        <Route
          path="/admin"
          element={
            <RotaProtegida>
              <EmConstrucao
                titulo="Administração"
                texto="Gestão de usuários, cargos, semestres e configurações do portal."
              />
            </RotaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
