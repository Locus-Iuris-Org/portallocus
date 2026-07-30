import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Usa a origem atual (localhost, preview ou produção) para não precisar
// trocar de URL entre ambientes. Todas precisam estar na lista de
// Redirect URLs do painel do Supabase.
const URL_REDEFINICAO = `${window.location.origin}/redefinir-senha`

export default function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: URL_REDEFINICAO,
    })

    setEnviando(false)

    // O Supabase não diferencia email inexistente (evita enumeração de contas);
    // erro aqui é problema real, tipo limite de envio atingido.
    if (error) {
      setErro(error.message)
      return
    }

    setEnviado(true)
  }

  if (enviado) {
    return (
      <div style={estilos.container}>
        <div style={estilos.card}>
          <h1 style={estilos.titulo}>Verifique seu email</h1>
          <p style={estilos.texto}>
            Se o email existir, você receberá um link para redefinir sua senha.
          </p>
          <p style={estilos.rodape}>
            <Link to="/login">Voltar para o login</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={estilos.container}>
      <form onSubmit={handleSubmit} style={estilos.card}>
        <h1 style={estilos.titulo}>Esqueci minha senha</h1>
        <p style={estilos.texto}>
          Informe seu email e enviaremos um link para criar uma nova senha.
        </p>

        <label style={estilos.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={estilos.input}
          />
        </label>

        {erro && <p style={estilos.erro}>{erro}</p>}

        <button type="submit" disabled={enviando} style={estilos.botao}>
          {enviando ? 'Enviando...' : 'Enviar link de redefinição'}
        </button>

        <p style={estilos.rodape}>
          <Link to="/login">Voltar para o login</Link>
        </p>
      </form>
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
    gap: 14,
    width: '100%',
    maxWidth: 360,
    padding: 24,
    border: '1px solid #e2e2e2',
    borderRadius: 12,
  },
  titulo: { margin: 0, fontSize: 24 },
  texto: { margin: 0, fontSize: 15, lineHeight: 1.5 },
  label: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 },
  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: 15,
  },
  botao: {
    padding: '10px 12px',
    borderRadius: 8,
    border: 'none',
    background: '#1f2937',
    color: '#fff',
    fontSize: 15,
    cursor: 'pointer',
  },
  erro: { color: '#b91c1c', margin: 0, fontSize: 14 },
  rodape: { margin: 0, fontSize: 14, textAlign: 'center' },
}
