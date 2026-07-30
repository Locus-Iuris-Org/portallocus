import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '4px solid #ddd',
            borderTopColor: '#333',
            borderRadius: '50%',
            animation: 'girar 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes girar { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Sem sessão -> manda pro login.
  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  // Autenticado -> segue pra página.
  return children
}
