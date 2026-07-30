import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { ICONES } from '../components/icones'
import './EmConstrucao.css'

/**
 * Placeholder das telas que ainda não foram construídas.
 *
 *   titulo      -> nome da seção
 *   texto       -> linha curta do que virá ali
 *   tema        -> cor da tela ('vermelho', 'verde', 'azul', 'amarelo')
 *   voltarPara  -> para onde o botão volta (padrão: a homepage)
 *   rotuloVolta -> texto do botão
 *
 * Quando a tela real ficar pronta, é só trocar na rota (src/App.jsx).
 */
export default function EmConstrucao({
  titulo,
  texto,
  tema = 'amarelo',
  voltarPara = '/',
  rotuloVolta = 'Voltar ao início',
}) {
  return (
    <>
      <Header />

      <main className={`fundo-portal tema-${tema}`}>
        <div className="obra">
          <div className="obra__card">
            <span className="obra__icone">{ICONES.relogio}</span>

            <p className="obra__selo">Em construção</p>
            <h1 className="obra__titulo">{titulo}</h1>
            <p className="obra__texto">{texto}</p>

            <Link to={voltarPara} className="obra__voltar">
              <span aria-hidden="true">←</span> {rotuloVolta}
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
