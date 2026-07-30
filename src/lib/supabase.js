import { createClient } from '@supabase/supabase-js'

// As variáveis precisam do prefixo VITE_ para o Vite expô-las ao front-end.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Falha cedo e com mensagem clara se o .env.local não estiver configurado.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.local'
  )
}

// Instância única do cliente, reutilizada em toda a aplicação.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
