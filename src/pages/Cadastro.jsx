import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const DOMINIO_PERMITIDO = '@locusiuris.com.br'
const URL_CONFIRMACAO = 'https://portallocus.vercel.app/login'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    // Validação de domínio ANTES de qualquer chamada ao Supabase.
    if (!email.trim().toLowerCase().endsWith(DOMINIO_PERMITIDO)) {
      setErro(`Cadastro permitido apenas com email corporativo terminado em ${DOMINIO_PERMITIDO}.`)
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setEnviando(true)

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: senha,
      options: {
        data: { nome_completo: nome.trim() },
        emailRedirectTo: URL_CONFIRMACAO,
      },
    })

    setEnviando(false)

    if (error) {
      setErro(error.message)
      return
    }

    setSucesso(true)
  }

  if (sucesso) {
    return (
      <div style={estilos.container}>
        <div style={estilos.card}>
          <h1 style={estilos.titulo}>Conta criada!</h1>
          <p style={estilos.texto}>
            Verifique seu email para confirmar o acesso.
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
        <h1 style={estilos.titulo}>Criar conta</h1>

        <label style={estilos.label}>
          Nome completo
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={estilos.input}
          />
        </label>

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

        <label style={estilos.label}>
          Confirmar senha
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            style={estilos.input}
          />
        </label>

        {erro && <p style={estilos.erro}>{erro}</p>}

        <button type="submit" disabled={enviando} style={estilos.botao}>
          {enviando ? 'Criando...' : 'Criar conta'}
        </button>

        <p style={estilos.rodape}>
          Já tem conta? <Link to="/login">Voltar para o login</Link>
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
