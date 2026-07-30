import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import Kpis from './Kpis'
import GraficoBarras from './GraficoBarras'
import GraficosPizza from './GraficosPizza'
import BibliaDeVendas from './BibliaDeVendas'
import './Diretoria.css'

/**
 * Mercado Diretoria — visão completa da área, sem filtro por subárea.
 * Os números vêm de ./dadosFicticios.js (mock); trocar aquele arquivo
 * por consultas ao Supabase não exige mexer nesta tela.
 */
export default function Diretoria() {
  return (
    <>
      <Header />

      <main className="fundo-portal tema-vermelho">
        <div className="diretoria">
          <Link to="/mercado" className="area__voltar">
            <span aria-hidden="true">←</span> Voltar
          </Link>

          <h1 className="diretoria__titulo">Mercado Diretoria</h1>
          <p className="diretoria__subtitulo">
            Visão completa da área de Mercado.
          </p>

          <Kpis />
          <GraficoBarras />
          <GraficosPizza />
          <BibliaDeVendas />
        </div>
      </main>
    </>
  )
}
