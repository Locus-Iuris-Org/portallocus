/** Formatação de números e datas, em português do Brasil. */

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const moedaCurta = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** 4230 -> "R$ 4.230,00" */
export function formatarMoeda(valor) {
  return moeda.format(valor)
}

/** 847320 -> "R$ 847,3 mil" (para eixos de gráfico, onde não cabe o valor cheio) */
export function formatarMoedaCurta(valor) {
  return moedaCurta.format(valor)
}

/** '2026-07-14' -> "14/07/2026" */
export function formatarData(iso) {
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

/** '2026-07' -> "Julho de 2026" */
export function formatarMesAno(chave) {
  const [ano, mes] = chave.split('-')
  return `${MESES[Number(mes) - 1]} de ${ano}`
}
