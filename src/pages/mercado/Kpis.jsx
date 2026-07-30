import { KPIS } from './dadosFicticios'
import { formatarMoeda } from '../../formato'

/**
 * Linha de indicadores do topo. Número grande, rótulo pequeno.
 * O número é o herói do card, então nada compete com ele em peso.
 */
export default function Kpis() {
  const indicadores = [
    { rotulo: 'Faturamento Total', valor: formatarMoeda(KPIS.faturamentoTotal) },
    { rotulo: 'Ticket Médio', valor: formatarMoeda(KPIS.ticketMedio) },
    { rotulo: 'Número de Vendas', valor: String(KPIS.numeroVendas) },
    {
      rotulo: 'Taxa de Conversão',
      valor: `${Math.round(KPIS.taxaConversao * 100)}%`,
    },
  ]

  return (
    <div className="kpis">
      {indicadores.map((item) => (
        <div key={item.rotulo} className="kpi">
          <p className="kpi__valor">{item.valor}</p>
          <p className="kpi__rotulo">{item.rotulo}</p>
        </div>
      ))}
    </div>
  )
}
