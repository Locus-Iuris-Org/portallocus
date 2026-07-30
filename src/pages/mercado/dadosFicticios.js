/**
 * DADOS FICTÍCIOS DA TELA DE MERCADO DIRETORIA
 *
 * Nada aqui é real — são números inventados para desenhar a tela.
 *
 * Quando o Supabase entrar, este é o ÚNICO arquivo que precisa mudar:
 * cada constante abaixo vira uma consulta ao banco, no mesmo formato.
 * Os componentes da tela não sabem de onde os dados vêm, então eles
 * continuam funcionando sem alteração.
 */

/* --- 1. KPIs do topo ------------------------------------------------ */

export const KPIS = {
  faturamentoTotal: 847320,
  ticketMedio: 4230,
  numeroVendas: 200,
  // Placeholder: ainda não existe tabela de leads para calcular isto.
  taxaConversao: 0.34,
}

/* --- 2. Série do gráfico de barras ---------------------------------- */

/** Os 12 meses somam exatamente o faturamento total acima. */
export const VENDAS_POR_MES = [
  { rotulo: 'ago/25', valor: 58400 },
  { rotulo: 'set/25', valor: 62150 },
  { rotulo: 'out/25', valor: 71300 },
  { rotulo: 'nov/25', valor: 66800 },
  { rotulo: 'dez/25', valor: 74250 },
  { rotulo: 'jan/26', valor: 69900 },
  { rotulo: 'fev/26', valor: 81500 },
  { rotulo: 'mar/26', valor: 63700 },
  { rotulo: 'abr/26', valor: 77200 },
  { rotulo: 'mai/26', valor: 84600 },
  { rotulo: 'jun/26', valor: 68320 },
  { rotulo: 'jul/26', valor: 69200 },
]

export const VENDAS_POR_SEMANA = [
  { rotulo: '06–12 abr', valor: 17300 },
  { rotulo: '13–19 abr', valor: 21450 },
  { rotulo: '20–26 abr', valor: 15900 },
  { rotulo: '27 abr–03 mai', valor: 22550 },
  { rotulo: '04–10 mai', valor: 19800 },
  { rotulo: '11–17 mai', valor: 24100 },
  { rotulo: '18–24 mai', valor: 18650 },
  { rotulo: '25–31 mai', valor: 22050 },
  { rotulo: '01–07 jun', valor: 16400 },
  { rotulo: '08–14 jun', valor: 20750 },
  { rotulo: '15–21 jun', valor: 17900 },
  { rotulo: '22–28 jun', valor: 13270 },
  { rotulo: '29 jun–05 jul', valor: 19500 },
  { rotulo: '06–12 jul', valor: 23200 },
  { rotulo: '13–19 jul', valor: 16800 },
  { rotulo: '20–26 jul', valor: 9700 },
]

/* --- 3. Gráficos de pizza ------------------------------------------- */

export const ORIGEM_LEAD = [
  { nome: 'Indicação', valor: 40 },
  { nome: 'Instagram', valor: 30 },
  { nome: 'LinkedIn', valor: 20 },
  { nome: 'Outros', valor: 10 },
]

export const SERVICOS_VENDIDOS = [
  { nome: 'Assessoria', valor: 45 },
  { nome: 'Consultoria', valor: 35 },
  { nome: 'Mentoria', valor: 20 },
]

/* --- 4. Bíblia de Vendas -------------------------------------------- */

/** Nomes inventados — não correspondem a ninguém da Locus. */
export const VENDAS = [
  { id: 1, data: '2026-07-24', gerente: 'Ana Ribeiro', servico: 'Assessoria', origem: 'Indicação', valor: 6800 },
  { id: 2, data: '2026-07-21', gerente: 'Bruno Tavares', servico: 'Consultoria', origem: 'LinkedIn', valor: 4200 },
  { id: 3, data: '2026-07-17', gerente: 'Carla Mendes', servico: 'Mentoria', origem: 'Instagram', valor: 2900 },
  { id: 4, data: '2026-07-15', gerente: 'Ana Ribeiro', servico: 'Assessoria', origem: 'Indicação', valor: 7400 },
  { id: 5, data: '2026-07-10', gerente: 'Diego Alves', servico: 'Consultoria', origem: 'Outros', valor: 3650 },
  { id: 6, data: '2026-07-08', gerente: 'Marina Lopes', servico: 'Assessoria', origem: 'Instagram', valor: 5100 },
  { id: 7, data: '2026-07-03', gerente: 'Bruno Tavares', servico: 'Mentoria', origem: 'LinkedIn', valor: 2500 },

  { id: 8, data: '2026-06-27', gerente: 'Carla Mendes', servico: 'Assessoria', origem: 'Indicação', valor: 8200 },
  { id: 9, data: '2026-06-23', gerente: 'Ana Ribeiro', servico: 'Consultoria', origem: 'Instagram', valor: 3900 },
  { id: 10, data: '2026-06-19', gerente: 'Diego Alves', servico: 'Assessoria', origem: 'LinkedIn', valor: 6350 },
  { id: 11, data: '2026-06-16', gerente: 'Marina Lopes', servico: 'Mentoria', origem: 'Indicação', valor: 2750 },
  { id: 12, data: '2026-06-11', gerente: 'Bruno Tavares', servico: 'Consultoria', origem: 'Outros', valor: 4480 },
  { id: 13, data: '2026-06-05', gerente: 'Carla Mendes', servico: 'Assessoria', origem: 'Indicação', valor: 9800 },
  { id: 14, data: '2026-06-02', gerente: 'Ana Ribeiro', servico: 'Mentoria', origem: 'Instagram', valor: 3100 },

  { id: 15, data: '2026-05-28', gerente: 'Diego Alves', servico: 'Consultoria', origem: 'LinkedIn', valor: 5600 },
  { id: 16, data: '2026-05-25', gerente: 'Marina Lopes', servico: 'Assessoria', origem: 'Indicação', valor: 7150 },
  { id: 17, data: '2026-05-20', gerente: 'Bruno Tavares', servico: 'Assessoria', origem: 'Instagram', valor: 6900 },
  { id: 18, data: '2026-05-14', gerente: 'Carla Mendes', servico: 'Consultoria', origem: 'Outros', valor: 4050 },
  { id: 19, data: '2026-05-11', gerente: 'Ana Ribeiro', servico: 'Assessoria', origem: 'LinkedIn', valor: 8600 },
  { id: 20, data: '2026-05-07', gerente: 'Diego Alves', servico: 'Mentoria', origem: 'Indicação', valor: 2400 },
  { id: 21, data: '2026-05-04', gerente: 'Marina Lopes', servico: 'Consultoria', origem: 'Instagram', valor: 5250 },
]

/** Listas para o painel de filtros, montadas a partir das vendas. */
export const GERENTES = [...new Set(VENDAS.map((v) => v.gerente))].sort()
export const SERVICOS = [...new Set(VENDAS.map((v) => v.servico))].sort()
export const ORIGENS = [...new Set(VENDAS.map((v) => v.origem))].sort()

/** Meses que têm venda, do mais recente para o mais antigo: ['2026-07', ...] */
export const MESES_COM_VENDA = [...new Set(VENDAS.map((v) => v.data.slice(0, 7)))].sort().reverse()
