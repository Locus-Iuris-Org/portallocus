import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Card from '../components/Card'
import EmConstrucao from './EmConstrucao'
import './Area.css'

/**
 * Tela intermediária de uma área: título da área + os subcards dela.
 * Recebe uma das entradas de src/areas.js.
 *
 * Área sem subcards cai direto na tela "Em construção", já pintada
 * com a cor da própria área.
 */
export default function Area({ area }) {
  if (!area.sub || area.sub.length === 0) {
    return (
      <EmConstrucao
        titulo={area.nome}
        texto={`A área de ${area.nome} ainda está sendo construída.`}
        tema={area.tema}
      />
    )
  }

  return (
    <>
      <Header />

      <main className={`fundo-portal tema-${area.tema}`}>
        <div className="area__conteudo">
          <Link to="/" className="area__voltar">
            <span aria-hidden="true">←</span> Voltar
          </Link>

          <h1 className="area__titulo">{area.nome}</h1>
          <p className="area__subtitulo">{area.descricao}</p>

          <div className="area__divisor" />

          <div className="area__grade">
            {area.sub.map((sub) => (
              <Card
                key={sub.slug}
                para={`/${area.slug}/${sub.slug}`}
                icone={sub.icone}
                titulo={sub.nome}
                descricao={sub.descricao}
                acao="Acessar"
              />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
