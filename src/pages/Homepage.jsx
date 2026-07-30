import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../hooks/useAuth'
import './Homepage.css'

/* Ícones desenhados inline para não depender de biblioteca externa. */
const iconeGrafico = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M7 15l4-5 3.5 3L21 6" />
  </svg>
)

const iconeAlvo = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
)

const iconeLivro = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
    <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5" />
  </svg>
)

const iconeEngrenagem = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

function Card({ para, icone, titulo, descricao, acao }) {
  return (
    <Link to={para} className="card">
      <span className="card__icone">{icone}</span>
      <span className="card__titulo">{titulo}</span>
      <span className="card__descricao">{descricao}</span>
      <span className="card__seta">
        {acao} <span aria-hidden="true">→</span>
      </span>
    </Link>
  )
}

export default function Homepage() {
  const { usuario, isAdmin } = useAuth()

  const nomeCompleto = usuario?.nome_completo || usuario?.nome || ''
  const primeiroNome = nomeCompleto.trim().split(/\s+/)[0]

  // Perfil pessoal só aparece para conta com identidade de vendas.
  const temIdentidadeDeVendas = !!usuario?.gerente_id

  return (
    <>
      <Header />

      <main className="fundo-portal">
        <div className="home__conteudo">
          <p className="home__saudacao">
            {primeiroNome ? `Olá, ${primeiroNome}` : 'Bem-vindo'}
          </p>

          <h1 className="home__titulo">
            Portal
            <strong>Locus Iuris</strong>
          </h1>

          <p className="home__subtitulo">
            Inteligência comercial da Locus Iuris. Escolha por onde começar.
          </p>

          <div className="home__divisor" />

          <div className="home__grade">
            <Card
              para="/dashboard"
              icone={iconeGrafico}
              titulo="Dashboard de Vendas"
              descricao="KPIs, metas, gráficos e o progresso do semestre."
              acao="Abrir dashboard"
            />

            {temIdentidadeDeVendas && (
              <Card
                para="/meus-resultados"
                icone={iconeAlvo}
                titulo="Meus Resultados"
                descricao="Seu desempenho individual e suas metas."
                acao="Ver meus números"
              />
            )}

            <Card
              para="/biblia-de-vendas"
              icone={iconeLivro}
              titulo="Bíblia de Vendas"
              descricao="Registro detalhado de cada venda do semestre."
              acao="Consultar registros"
            />

            {isAdmin && (
              <Card
                para="/admin"
                icone={iconeEngrenagem}
                titulo="Administração"
                descricao="Usuários, cargos, semestres e configurações."
                acao="Gerenciar portal"
              />
            )}
          </div>
        </div>
      </main>
    </>
  )
}
