import { Link } from 'react-router-dom'
import Header from '../components/Header'
import './EmConstrucao.css'

/**
 * Placeholder das telas que ainda não foram construídas.
 * Recebe o título da seção e um texto curto do que virá ali.
 * Quando a tela real ficar pronta, é só trocar na rota (src/App.jsx).
 */
export default function EmConstrucao({ titulo, texto }) {
  return (
    <>
      <Header />

      <main className="fundo-portal">
        <div className="obra">
          <div className="obra__card">
            <span className="obra__icone">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.5 2" />
              </svg>
            </span>

            <p className="obra__selo">Em construção</p>
            <h1 className="obra__titulo">{titulo}</h1>
            <p className="obra__texto">{texto}</p>

            <Link to="/" className="obra__voltar">
              <span aria-hidden="true">←</span> Voltar ao início
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
