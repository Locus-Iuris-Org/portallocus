import { useState, useEffect } from 'react'
import {
  VENDAS,
  GERENTES,
  SERVICOS,
  ORIGENS,
  MESES_COM_VENDA,
} from './dadosFicticios'
import { formatarMoeda, formatarData, formatarMesAno } from '../../formato'

const FILTROS_VAZIOS = { gerente: [], servico: [], origem: [] }

/** Painel lateral de filtros. */
function Filtros({ aberto, aoFechar, filtros, aoAlternar, aoLimpar, quantos }) {
  // Esc fecha o painel.
  useEffect(() => {
    if (!aberto) return

    function aoTeclar(evento) {
      if (evento.key === 'Escape') aoFechar()
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aberto, aoFechar])

  if (!aberto) return null

  const grupos = [
    { chave: 'gerente', titulo: 'Gerente', opcoes: GERENTES },
    { chave: 'servico', titulo: 'Serviço', opcoes: SERVICOS },
    { chave: 'origem', titulo: 'Origem', opcoes: ORIGENS },
  ]

  return (
    <>
      <div className="drawer__fundo" onClick={aoFechar} />

      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Filtros da Bíblia de Vendas"
      >
        <div className="drawer__topo">
          <h3 className="drawer__titulo">Filtros</h3>
          <button
            type="button"
            className="drawer__fechar"
            onClick={aoFechar}
            aria-label="Fechar filtros"
          >
            ✕
          </button>
        </div>

        <div className="drawer__corpo">
          {grupos.map((grupo) => (
            <div key={grupo.chave} className="drawer__grupo">
              <p className="drawer__grupo-titulo">{grupo.titulo}</p>

              {grupo.opcoes.map((opcao) => (
                <label key={opcao} className="drawer__opcao">
                  <input
                    type="checkbox"
                    checked={filtros[grupo.chave].includes(opcao)}
                    onChange={() => aoAlternar(grupo.chave, opcao)}
                  />
                  <span>{opcao}</span>
                </label>
              ))}
            </div>
          ))}
        </div>

        <div className="drawer__rodape">
          <button
            type="button"
            className="botao-secundario"
            onClick={aoLimpar}
            disabled={quantos === 0}
          >
            Limpar filtros
          </button>
          <button type="button" className="botao-principal" onClick={aoFechar}>
            Ver resultados
          </button>
        </div>
      </aside>
    </>
  )
}

export default function BibliaDeVendas() {
  const [indiceMes, setIndiceMes] = useState(0)
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS)
  const [aberto, setAberto] = useState(false)

  const mes = MESES_COM_VENDA[indiceMes]

  // Lista vazia num grupo = "não filtra por isso".
  function passaNoFiltro(venda) {
    return (
      (filtros.gerente.length === 0 || filtros.gerente.includes(venda.gerente)) &&
      (filtros.servico.length === 0 || filtros.servico.includes(venda.servico)) &&
      (filtros.origem.length === 0 || filtros.origem.includes(venda.origem))
    )
  }

  const linhas = VENDAS.filter(
    (venda) => venda.data.startsWith(mes) && passaNoFiltro(venda),
  )
  const total = linhas.reduce((soma, venda) => soma + venda.valor, 0)
  const quantosFiltros =
    filtros.gerente.length + filtros.servico.length + filtros.origem.length

  function alternar(chave, opcao) {
    setFiltros((atual) => {
      const lista = atual[chave]
      return {
        ...atual,
        [chave]: lista.includes(opcao)
          ? lista.filter((item) => item !== opcao)
          : [...lista, opcao],
      }
    })
  }

  return (
    <section className="painel">
      <div className="painel__topo">
        <div>
          <h2 className="painel__titulo">Bíblia de Vendas</h2>
          <p className="painel__periodo">{formatarMesAno(mes)}</p>
        </div>

        <div className="painel__controles">
          <button
            type="button"
            className="botao-secundario"
            onClick={() => setAberto(true)}
          >
            Filtros
            {quantosFiltros > 0 && (
              <span className="contador">{quantosFiltros}</span>
            )}
          </button>

          <div className="navegador">
            <button
              type="button"
              className="navegador__seta"
              onClick={() => setIndiceMes((i) => i + 1)}
              disabled={indiceMes >= MESES_COM_VENDA.length - 1}
            >
              ← Mês anterior
            </button>
            <button
              type="button"
              className="navegador__seta"
              onClick={() => setIndiceMes((i) => i - 1)}
              disabled={indiceMes === 0}
            >
              Mês seguinte →
            </button>
          </div>
        </div>
      </div>

      <div className="tabela-rolagem">
        <table className="tabela">
          <thead>
            <tr>
              <th>Data</th>
              <th>Gerente</th>
              <th>Serviço</th>
              <th>Origem</th>
              <th className="tabela__num">Valor</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((venda) => (
              <tr key={venda.id}>
                <td>{formatarData(venda.data)}</td>
                <td>{venda.gerente}</td>
                <td>{venda.servico}</td>
                <td>{venda.origem}</td>
                <td className="tabela__num">{formatarMoeda(venda.valor)}</td>
              </tr>
            ))}

            {linhas.length === 0 && (
              <tr>
                <td colSpan={5} className="tabela__vazio">
                  Nenhuma venda neste mês com os filtros escolhidos.
                </td>
              </tr>
            )}
          </tbody>

          {linhas.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={4}>
                  {linhas.length} {linhas.length === 1 ? 'venda' : 'vendas'}
                </td>
                <td className="tabela__num">{formatarMoeda(total)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <Filtros
        aberto={aberto}
        aoFechar={() => setAberto(false)}
        filtros={filtros}
        aoAlternar={alternar}
        aoLimpar={() => setFiltros(FILTROS_VAZIOS)}
        quantos={quantosFiltros}
      />
    </section>
  )
}
