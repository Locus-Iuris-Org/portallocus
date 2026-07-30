import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Carregando from './Carregando'

/**
 * Porteiro do portal: a única pergunta é "tem login?".
 *
 * Qualquer pessoa logada entra e vê todas as áreas, seja qual for o
 * cargo. Cargo não controla entrada — controla o que dá para EDITAR,
 * e isso é decidido dentro de cada tela (e garantido pelo RLS no
 * banco, não por `if` aqui).
 */
export default function RotaProtegida({ children }) {
  const { sessao, carregando } = useAuth()

  if (carregando) {
    return <Carregando />
  }

  // Sem sessão -> manda pro login.
  if (!sessao) {
    return <Navigate to="/login" replace />
  }

  // Logado -> segue pra página.
  return children
}
