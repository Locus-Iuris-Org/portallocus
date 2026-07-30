import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const { usuario } = useAuth()

  async function sair() {
    await supabase.auth.signOut()
  }

  const nome = usuario?.nome_completo || usuario?.nome || 'usuário'

  return (
    <div style={estilos.container}>
      <header style={estilos.header}>
        <h1 style={estilos.titulo}>Bem-vindo, {nome}</h1>
        <button type="button" onClick={sair} style={estilos.botao}>
          Sair
        </button>
      </header>
    </div>
  )
}

const estilos = {
  container: { padding: 24 },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  titulo: { margin: 0, fontSize: 22 },
  botao: {
    padding: '8px 14px',
    borderRadius: 8,
    border: 'none',
    background: '#1f2937',
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer',
  },
}
