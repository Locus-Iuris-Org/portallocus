import Header from '../components/Header'
import Card from '../components/Card'
import { useAuth } from '../hooks/useAuth'
import { AREAS, CARD_ADMIN } from '../areas'
import './Homepage.css'

export default function Homepage() {
  const { usuario, isAdmin } = useAuth()

  const nomeCompleto = usuario?.nome_completo || usuario?.nome || ''
  const primeiroNome = nomeCompleto.trim().split(/\s+/)[0]

  return (
    <>
      <Header />

      <main className="fundo-portal tema-amarelo">
        <div className="home__conteudo">
          <p className="home__saudacao">
            {primeiroNome ? `Olá, ${primeiroNome}` : 'Bem-vindo'}
          </p>

          <h1 className="home__titulo">
            Portal
            <strong>Locus Iuris</strong>
          </h1>

          <p className="home__subtitulo">
            Inteligência comercial da Locus Iuris. Escolha uma área para
            começar.
          </p>

          <div className="home__divisor" />

          <div className="home__grade">
            {AREAS.map((area) => (
              <Card
                key={area.slug}
                para={`/${area.slug}`}
                icone={area.icone}
                titulo={area.nome}
                descricao={area.descricao}
                acao="Acessar área"
              />
            ))}

            {isAdmin && (
              <Card
                para={`/${CARD_ADMIN.slug}`}
                icone={CARD_ADMIN.icone}
                titulo={CARD_ADMIN.nome}
                descricao={CARD_ADMIN.descricao}
                acao="Gerenciar portal"
              />
            )}
          </div>
        </div>
      </main>
    </>
  )
}
