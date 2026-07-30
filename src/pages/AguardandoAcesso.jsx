import { supabase } from '../lib/supabase'

export default function AguardandoAcesso() {
  async function sair() {
    await supabase.auth.signOut()
  }

  return (
    <div style={estilos.container}>
      <div style={estilos.card}>
        <h1 style={estilos.titulo}>Aguardando liberação</h1>
        <p style={estilos.texto}>
          Sua conta está aguardando liberação pelo administrador.
        </p>
        <button type="button" onClick={sair} style={estilos.botao}>
          Sair
        </button>
      </div>
    </div>
  )
}

const estilos = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: 16,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
    maxWidth: 420,
    padding: 24,
    border: '1px solid #e2e2e2',
    borderRadius: 12,
    textAlign: 'center',
  },
  titulo: { margin: 0, fontSize: 22 },
  texto: { margin: 0, fontSize: 15, lineHeight: 1.5 },
  botao: {
    padding: '10px 12px',
    borderRadius: 8,
    border: 'none',
    background: '#1f2937',
    color: '#fff',
    fontSize: 15,
    cursor: 'pointer',
  },
}
