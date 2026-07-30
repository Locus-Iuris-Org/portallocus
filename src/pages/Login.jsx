import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/**
 * O link de recuperação pode cair aqui em vez de /redefinir-senha quando o
 * Supabase usa a Site URL do projeto. O token vem no hash (implicit flow) ou
 * na query (PKCE/verify), então olhamos os dois.
 */
function temRecoveryNaUrl() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const query = new URLSearchParams(window.location.search)
  return hash.get('type') === 'recovery' || query.get('type') === 'recovery'
}

export default function Login() {
  const navigate = useNavigate()
  // Lido na montagem, antes do primeiro render, para não piscar o formulário.
  const [recovery] = useState(temRecoveryNaUrl)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!recovery) return
    // Leva search e hash intactos: quem valida o token é a tela de redefinição.
    const { search, hash } = window.location
    navigate(`/redefinir-senha${search}${hash}`, { replace: true })
  }, [recovery, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    setEnviando(false)

    if (error) {
      setErro('Email ou senha incorretos.')
      return
    }

    navigate('/')
  }

  // Redirecionando: não renderiza o login para não confundir o usuário.
  if (recovery) {
    return null
  }

  return (
    <div style={estilos.container}>
      <form onSubmit={handleSubmit} style={estilos.card}>
        <h1 style={estilos.titulo}>Entrar</h1>

        <label style={estilos.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={estilos.input}
          />
        </label>

        <label style={estilos.label}>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={estilos.input}
          />
        </label>

        {erro && <p style={estilos.erro}>{erro}</p>}

        <button type="submit" disabled={enviando} style={estilos.botao}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>

        <p style={estilos.rodape}>
          <Link to="/esqueci-senha">Esqueci minha senha</Link>
        </p>

        <p style={estilos.rodape}>
          Não tem conta? <Link to="/cadastro">Criar conta</Link>
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
