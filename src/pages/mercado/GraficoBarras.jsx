import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { VENDAS_POR_MES, VENDAS_POR_SEMANA } from './dadosFicticios'
import { formatarMoeda, formatarMoedaCurta } from '../../formato'

/* Quantas barras aparecem de uma vez em cada modo. As setas deslizam
   essa janela sobre a série inteira. */
const JANELA = { mes: 6, semana: 8 }

function serieDe(modo) {
  return modo === 'mes' ? VENDAS_POR_MES : VENDAS_POR_SEMANA
}

function inicioMaisRecente(modo) {
  return Math.max(0, serieDe(modo).length - JANELA[modo])
}

/** Balãozinho que aparece ao passar o mouse numa barra. */
function Balao({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="gb__balao">
      <p className="gb__balao-rotulo">{label}</p>
      <p className="gb__balao-valor">{formatarMoeda(payload[0].value)}</p>
    </div>
  )
}

export default function GraficoBarras() {
  const [modo, setModo] = useState('mes')
  const [inicio, setInicio] = useState(() => inicioMaisRecente('mes'))

  const serie = serieDe(modo)
  const janela = JANELA[modo]
  const maxInicio = Math.max(0, serie.length - janela)
  const dados = serie.slice(inicio, inicio + janela)

  function trocarModo(novo) {
    setModo(novo)
    setInicio(inicioMaisRecente(novo))
  }

  const periodo = dados.length
    ? `${dados[0].rotulo} — ${dados[dados.length - 1].rotulo}`
    : ''

  return (
    <section className="painel">
      <div className="painel__topo">
        <div>
          <h2 className="painel__titulo">Vendas por período</h2>
          <p className="painel__periodo">{periodo}</p>
        </div>

        <div className="painel__controles">
          <div className="alternador" role="group" aria-label="Agrupar por">
            <button
              type="button"
              className={`alternador__opcao${modo === 'mes' ? ' alternador__opcao--ativa' : ''}`}
              onClick={() => trocarModo('mes')}
              aria-pressed={modo === 'mes'}
            >
              Mês
            </button>
            <button
              type="button"
              className={`alternador__opcao${modo === 'semana' ? ' alternador__opcao--ativa' : ''}`}
              onClick={() => trocarModo('semana')}
              aria-pressed={modo === 'semana'}
            >
              Semana
            </button>
          </div>

          <div className="navegador">
            <button
              type="button"
              className="navegador__seta"
              onClick={() => setInicio((i) => Math.max(0, i - janela))}
              disabled={inicio === 0}
              aria-label="Período anterior"
            >
              ←
            </button>
            <button
              type="button"
              className="navegador__seta"
              onClick={() => setInicio((i) => Math.min(maxInicio, i + janela))}
              disabled={inicio >= maxInicio}
              aria-label="Período seguinte"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="grafico" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid
              vertical={false}
              stroke="rgba(26, 29, 35, 0.09)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="rotulo"
              tickLine={false}
              axisLine={{ stroke: 'rgba(26, 29, 35, 0.18)' }}
              tick={{ fill: '#5c6070', fontSize: 12 }}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#5c6070', fontSize: 12 }}
              tickFormatter={formatarMoedaCurta}
              width={78}
            />
            <Tooltip
              content={<Balao />}
              cursor={{ fill: 'rgba(229, 57, 53, 0.07)' }}
            />
            <Bar
              dataKey="valor"
              name="Vendas"
              fill="#e53935"
              radius={[4, 4, 0, 0]}
              maxBarSize={54}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
