import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const TAMANHO_MINIMO_SENHA = 6

/**
 * Lê os parâmetros do link de recuperação.
 *
 * O Supabase entrega o token de formas diferentes conforme o flow do projeto:
 * - implicit: no hash  -> #access_token=...&refresh_token=...&type=recovery
 * - PKCE:     na query -> ?code=...
 * - verify:   na query -> ?token_hash=...&type=recovery
 * Por isso lemos hash e query e damos preferência ao que existir.
 */
function lerParametrosDaUrl() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const query = new URLSearchParams(window.location.search)
  const pegar = (chave) => hash.get(chave) || query.get(chave) || ''

  return {
    accessToken: pegar('access_token'),
    refreshToken: pegar('refresh_token'),
    code: pegar('code'),
    tokenHash: pegar('token_hash'),
    tipo: pegar('type'),
    erro: pegar('error_description') || pegar('error'),
  }
}

// Tira o token da barra de endereço para não ficar em histórico/print.
function limparUrl() {
  window.history.replaceState({}, document.title, window.location.pathname)
}

export default function RedefinirSenha() {
  const navigate = useNavigate()
  // verificando -> pronto | invalido | sucesso
  const [estado, setEstado] = useState('verificando')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    let ativo = true

    function falhar(mensagem) {
      if (!ativo) return
      setErro(mensagem)
      setEstado('invalido')
    }

    async function preparar() {
      const p = lerParametrosDaUrl()

      // O próprio Supabase já devolveu um erro no link (expirado, já usado...).
      if (p.erro) {
        limparUrl()
        falhar(decodeURIComponent(p.erro.replace(/\+/g, ' ')))
        return
      }

      // 1) Implicit flow: os tokens vêm prontos no hash.
      if (p.accessToken && p.refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: p.accessToken,
          refresh_token: p.refreshToken,
        })
        limparUrl()
        if (!ativo) return
        if (error) return falhar(error.message)
        setEstado('pronto')
        return
      }

      // 2) PKCE: troca o code por uma sessão.
      if (p.code) {
        const { error } = await supabase.auth.exchangeCodeForSession(p.code)
        limparUrl()
        if (!ativo) return
        if (error) return falhar(error.message)
        setEstado('pronto')
        return
      }

      // 3) Link de verificação: valida o token_hash como recovery.
      if (p.tokenHash) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: p.tokenHash,
          type: p.tipo || 'recovery',
        })
        limparUrl()
        if (!ativo) return
        if (error) return falhar(error.message)
        setEstado('pronto')
        return
      }

      // 4) Nada na URL: pode ser que o supabase-js já tenha consumido o hash
      //    sozinho (detectSessionInUrl) antes desta página montar.
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!ativo) return

      if (session) {
        setEstado('pronto')
        return
      }

      falhar(
        'Link de redefinição inválido ou expirado. Solicite um novo email de recuperação.'
      )
    }

    // Rede de segurança: se o detectSessionInUrl terminar depois da checagem
    // acima, o evento de recovery ainda libera o formulário.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento, session) => {
      if (!ativo) return
      if (evento === 'PASSWORD_RECOVERY' || (session && estado === 'verificando')) {
        setErro('')
        setEstado('pronto')
      }
    })

    preparar()

    return () => {
      ativo = false
      subscription.unsubscribe()
    }
    // Roda uma única vez, na montagem: a URL só é lida nesse momento.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Depois do sucesso, dá tempo de ler a mensagem e manda pro login.
  useEffect(() => {
    if (estado !== 'sucesso') return
    const timer = setTimeout(() => navigate('/login', { replace: true }), 2500)
    return () => clearTimeout(timer)
  }, [estado, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (senha.length < TAMANHO_MINIMO_SENHA) {
      setErro(`A senha precisa ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`)
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setEnviando(true)

    const { error } = await supabase.auth.updateUser({ password: senha })

    if (error) {
      setEnviando(false)
      setErro(error.message)
      return
    }

    // Encerra a sessão de recuperação: o acesso normal é pelo login.
    await supabase.auth.signOut()
    setEnviando(false)
    setEstado('sucesso')
  }

  if (estado === 'verificando') {
    return (
      <div style={estilos.container}>
        <div style={estilos.card}>
          <p style={estilos.texto}>Validando o link de redefinição...</p>
        </div>
      </div>
    )
  }

  if (estado === 'sucesso') {
    return (
      <div style={estilos.container}>
        <div style={estilos.card}>
          <h1 style={estilos.titulo}>Senha definida!</h1>
          <p style={estilos.texto}>Você já pode fazer login.</p>
          <button
            type="button"
            onClick={() => navigate('/login', { replace: true })}
            style={estilos.botao}
          >
            Ir para o login
          </button>
        </div>
      </div>
    )
  }

  if (estado === 'invalido') {
    return (
      <div style={estilos.container}>
        <div style={estilos.card}>
          <h1 style={estilos.titulo}>Link inválido</h1>
          <p style={estilos.erro}>{erro}</p>
          <button
            type="button"
            onClick={() => navigate('/login', { replace: true })}
            style={estilos.botao}
          >
            Voltar para o login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={estilos.container}>
      <form onSubmit={handleSubmit} style={estilos.card}>
        <h1 style={estilos.titulo}>Definir nova senha</h1>

        <label style={estilos.label}>
          Nova senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="new-password"
            style={estilos.input}
          />
        </label>

        <label style={estilos.label}>
          Confirmar nova senha
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            autoComplete="new-password"
            style={estilos.input}
          />
        </label>

        {erro && <p style={estilos.erro}>{erro}</p>}

        <button type="submit" disabled={enviando} style={estilos.botao}>
          {enviando ? 'Salvando...' : 'Salvar nova senha'}
        </button>
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
}
