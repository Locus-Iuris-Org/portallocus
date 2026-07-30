import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import EsqueciSenha from './pages/EsqueciSenha'
import RedefinirSenha from './pages/RedefinirSenha'
import Homepage from './pages/Homepage'
import Area from './pages/Area'
import Dashboard from './pages/Dashboard'
import EmConstrucao from './pages/EmConstrucao'
import AguardandoAcesso from './pages/AguardandoAcesso'
import RotaProtegida from './components/RotaProtegida'
import Carregando from './components/Carregando'
import { AREAS } from './areas'
import { useAuth } from './hooks/useAuth'

/**
 * Telas com gráficos são carregadas só quando alguém as abre.
 * Motivo: a biblioteca de gráficos (recharts) é pesada, e quem só
 * usa a Homepage não tem por que baixá-la junto com o portal.
 */
const Diretoria = lazy(() => import('./pages/mercado/Diretoria'))

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

// Envelope curto para não repetir <RotaProtegida> em toda rota.
function protegida(tela) {
  return <RotaProtegida>{tela}</RotaProtegida>
}

/**
 * Subáreas que já têm tela de verdade. A chave é 'area/subarea',
 * igual ao endereço. Quem não está aqui cai na tela "Em construção".
 * Conforme as telas ficarem prontas, é só acrescentar uma linha.
 */
const TELAS_PRONTAS = {
  'mercado/diretoria': <Diretoria />,
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Suspense mostra a rodinha enquanto uma tela carregada sob
          demanda (as com gráficos) chega da rede. */}
      <Suspense fallback={<Carregando />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          {/* Públicas: quem redefine a senha ainda não tem login normal. */}
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />

          <Route path="/" element={protegida(<Home />)} />

          {/* As rotas das áreas e subáreas saem do mapa em src/areas.js.
              Cada área vira /slug, e cada subárea vira /slug/subslug —
              tela pronta se estiver em TELAS_PRONTAS, senão "Em
              construção" na cor da área. */}
          {AREAS.map((area) => (
            <Route key={area.slug}>
              <Route
                path={`/${area.slug}`}
                element={protegida(<Area area={area} />)}
              />

              {area.sub.map((sub) => (
                <Route
                  key={sub.slug}
                  path={`/${area.slug}/${sub.slug}`}
                  element={protegida(
                    TELAS_PRONTAS[`${area.slug}/${sub.slug}`] ?? (
                      <EmConstrucao
                        titulo={sub.nome}
                        texto={sub.descricao}
                        tema={area.tema}
                        voltarPara={`/${area.slug}`}
                        rotuloVolta={`Voltar para ${area.nome}`}
                      />
                    ),
                  )}
                />
              ))}
            </Route>
          ))}

          {/* Telas soltas que ainda não foram construídas. */}
          <Route path="/dashboard" element={protegida(<Dashboard />)} />
          <Route
            path="/perfil"
            element={protegida(
              <EmConstrucao
                titulo="Meu perfil"
                texto="Aqui você vai ver e editar seus dados de conta: nome, foto e senha."
              />,
            )}
          />
          <Route
            path="/admin"
            element={protegida(
              <EmConstrucao
                titulo="Administração"
                texto="Gestão de usuários, cargos, semestres e configurações do portal."
              />,
            )}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
