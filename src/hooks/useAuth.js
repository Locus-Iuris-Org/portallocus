import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Hook central de autenticação.
 *
 * Premissas de schema (ajuste aqui se seu banco divergir):
 * - `usuarios.id` == `auth.users.id` (vínculo por id).
 * - `usuarios.cargo_id` -> `cargos.id` (join many-to-one).
 * - `usuarios.is_admin_tecnico` é um boolean na própria linha do usuário.
 */
export function useAuth() {
  const [sessao, setSessao] = useState(null)
  const [usuario, setUsuario] = useState(null)
  const [cargo, setCargo] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    async function carregar() {
      setCarregando(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Sem sessão: zera tudo.
      if (!session) {
        if (ativo) {
          setSessao(null)
          setUsuario(null)
          setCargo(null)
          setCarregando(false)
        }
        return
      }

      if (ativo) setSessao(session)

      // Linha do usuário + join com cargos (todas as permissões).
      const { data, error } = await supabase
        .from('usuarios')
        .select('*, cargos(*)')
        .eq('id', session.user.id)
        .single()

      if (!ativo) return

      if (error) {
        console.error('useAuth: erro ao carregar usuário ->', error.message)
        setUsuario(null)
        setCargo(null)
      } else {
        setUsuario(data)
        setCargo(data?.cargos ?? null)
      }
      setCarregando(false)
    }

    carregar()

    // Reage a login/logout em tempo real.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      carregar()
    })

    return () => {
      ativo = false
      subscription.unsubscribe()
    }
  }, [])

  const isAdmin = !!usuario?.is_admin_tecnico

  /**
   * `sessao` é o login em si (Supabase Auth) e é o que decide se a
   * pessoa entra no portal. `usuario`/`cargo` são a linha na tabela
   * `usuarios` — servem para nome, avatar e permissões de EDIÇÃO, e
   * podem faltar sem que isso barre o acesso.
   */
  return { sessao, usuario, cargo, isAdmin, carregando }
}
