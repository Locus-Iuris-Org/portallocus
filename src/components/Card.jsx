import { Link } from 'react-router-dom'
import { ICONES } from './icones'
import './Card.css'

/**
 * Card de vidro fosco usado na Homepage e nas telas de área.
 * A cor do fio de cima e da seta vem do tema da tela (--area),
 * definido pela classe tema-* em src/index.css.
 */
export default function Card({ para, icone, titulo, descricao, acao }) {
  return (
    <Link to={para} className="card">
      <span className="card__icone">{ICONES[icone] ?? ICONES.relogio}</span>
      <span className="card__titulo">{titulo}</span>
      <span className="card__descricao">{descricao}</span>
      <span className="card__seta">
        {acao} <span aria-hidden="true">→</span>
      </span>
    </Link>
  )
}
