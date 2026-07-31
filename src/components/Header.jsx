import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import './Header.css'

/**
 * Carimbo para furar o cache da foto, calculado UMA VEZ por
 * carregamento da página.
 *
 * Não pode ser Date.now() na hora de desenhar: mudaria a cada
 * redesenho e o navegador buscaria a imagem de novo toda vez, fazendo
 * o avatar piscar. Assim, dentro da mesma página o endereço é estável,
 * e um F5 traz a foto atual.
 */
const CARIMBO_DA_PAGINA = Date.now()

/**
 * Monta as iniciais do avatar: "Davi Motta" -> "DM".
 * Cai no e-mail quando não há nome cadastrado.
 */
function iniciaisDe(usuario) {
  const nome = usuario?.nome_completo || usuario?.nome || ''
  const partes = nome.trim().split(/\s+/).filter(Boolean)

  if (partes.length >= 2) {
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
  }
  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase()
  }
  return (usuario?.email || '?').slice(0, 2).toUpperCase()
}

export default function Header() {
  const { usuario, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [aberto, setAberto] = useState(false)
  const contaRef = useRef(null)

  // Fecha o dropdown ao clicar fora ou apertar Esc.
  useEffect(() => {
    if (!aberto) return

    function aoClicarFora(evento) {
      if (!contaRef.current?.contains(evento.target)) {
        setAberto(false)
      }
    }
    function aoTeclar(evento) {
      if (evento.key === 'Escape') setAberto(false)
    }

    document.addEventListener('mousedown', aoClicarFora)
    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.removeEventListener('mousedown', aoClicarFora)
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [aberto])

  async function sair() {
    setAberto(false)
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="header">
      <Link to="/" className="header__logo" aria-label="Portal Locus Iuris">
        <img src="/logoportal.png" alt="Locus Iuris" />
      </Link>

      <div className="header__conta" ref={contaRef}>
        <button
          type="button"
          className="header__avatar"
          onClick={() => setAberto((estava) => !estava)}
          aria-haspopup="menu"
          aria-expanded={aberto}
          aria-label="Abrir menu da conta"
        >
          {usuario?.avatar_url ? (
            <img
              className="header__avatar-foto"
              src={`${usuario.avatar_url}?t=${CARIMBO_DA_PAGINA}`}
              alt=""
            />
          ) : (
            iniciaisDe(usuario)
          )}
        </button>

        {aberto && (
          <div className="header__menu" role="menu">
            <Link
              to="/perfil"
              role="menuitem"
              className="header__item"
              onClick={() => setAberto(false)}
            >
              Meu perfil
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                role="menuitem"
                className="header__item"
                onClick={() => setAberto(false)}
              >
                Painel de admin
              </Link>
            )}

            <div className="header__separador" />

            <button
              type="button"
              role="menuitem"
              className="header__item header__item--sair"
              onClick={sair}
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
