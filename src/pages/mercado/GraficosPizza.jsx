import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { ORIGEM_LEAD, SERVICOS_VENDIDOS } from './dadosFicticios'

/* Paleta categórica validada para daltonismo (deutan/protan/tritan) e
   contraste contra o fundo claro do card. A ORDEM é fixa: a fatia 1 é
   sempre azul, a 2 sempre laranja, e assim por diante. Não embaralhe —
   é a ordem que garante que fatias vizinhas sejam distinguíveis. */
const CORES = ['#2a78d6', '#eb6834', '#1baf7a', '#4a3aa7']

function Balao({ active, payload }) {
  if (!active || !payload?.length) return null
  const fatia = payload[0]

  return (
    <div className="gb__balao">
      <p className="gb__balao-rotulo">{fatia.name}</p>
      <p className="gb__balao-valor">{fatia.value}%</p>
    </div>
  )
}

/** Escreve a porcentagem dentro da fatia, quando ela é grande o bastante. */
function rotuloNaFatia({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.13) return null

  const raio = innerRadius + (outerRadius - innerRadius) * 0.62
  const rad = -midAngle * (Math.PI / 180)
  const x = cx + raio * Math.cos(rad)
  const y = cy + raio * Math.sin(rad)

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      fontSize={13}
      fontWeight={600}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {Math.round(percent * 100)}%
    </text>
  )
}

function Pizza({ titulo, dados }) {
  return (
    <section className="painel">
      <h2 className="painel__titulo">{titulo}</h2>

      <div className="grafico" style={{ height: 232 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dados}
              dataKey="valor"
              nameKey="nome"
              cx="50%"
              cy="50%"
              outerRadius="88%"
              paddingAngle={2}
              stroke="#fff"
              strokeWidth={2}
              labelLine={false}
              label={rotuloNaFatia}
              isAnimationActive={false}
            >
              {dados.map((fatia, i) => (
                <Cell key={fatia.nome} fill={CORES[i % CORES.length]} />
              ))}
            </Pie>
            <Tooltip content={<Balao />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda com o nome escrito: a cor sozinha nunca carrega a
          identidade da fatia. */}
      <ul className="legenda">
        {dados.map((fatia, i) => (
          <li key={fatia.nome} className="legenda__item">
            <span
              className="legenda__cor"
              style={{ background: CORES[i % CORES.length] }}
              aria-hidden="true"
            />
            <span className="legenda__nome">{fatia.nome}</span>
            <span className="legenda__valor">{fatia.valor}%</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function GraficosPizza() {
  return (
    <div className="pizzas">
      <Pizza titulo="Origem do Lead" dados={ORIGEM_LEAD} />
      <Pizza titulo="Serviços Vendidos" dados={SERVICOS_VENDIDOS} />
    </div>
  )
}
