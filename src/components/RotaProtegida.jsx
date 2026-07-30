import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Carregando from './Carregando'

export default function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return <Carregando />
  }

  // Sem sessão -> manda pro login.
  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  // Autenticado -> segue pra página.
  return children
}
