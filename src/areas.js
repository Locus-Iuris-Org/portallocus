/**
 * MAPA DAS ÁREAS DO PORTAL
 *
 * Este é o único lugar que precisa ser editado para mudar o menu:
 * a Homepage, as telas de área e as rotas (src/App.jsx) leem tudo daqui.
 *
 * Campos de cada área:
 *   slug      -> pedaço do endereço. 'mercado' vira /mercado
 *   nome      -> o que aparece escrito no card e no título da tela
 *   tema      -> cor da tela: 'vermelho', 'verde', 'amarelo' ou 'azul'
 *                (as cores estão definidas em src/index.css)
 *   icone     -> nome do desenho, de src/components/icones.jsx
 *   descricao -> linha de apoio embaixo do nome, no card
 *   sub       -> lista de subcards. Área sem subcards (lista vazia)
 *                mostra uma tela "Em construção" com a cor dela.
 */
export const AREAS = [
  {
    slug: 'mercado',
    nome: 'Mercado',
    tema: 'vermelho',
    icone: 'mercado',
    descricao: 'Comercial, marketing e a diretoria da área.',
    sub: [
      {
        slug: 'diretoria',
        nome: 'Mercado Diretoria',
        icone: 'diretoria',
        descricao: 'Visão consolidada da diretoria de Mercado.',
      },
      {
        slug: 'comercial',
        nome: 'Comercial',
        icone: 'grafico',
        descricao: 'Vendas, metas e acompanhamento do funil.',
      },
      {
        slug: 'marketing',
        nome: 'Marketing',
        icone: 'megafone',
        descricao: 'Campanhas, conteúdo e geração de demanda.',
      },
    ],
  },
  {
    slug: 'gestao-pessoas',
    nome: 'Gestão de Pessoas',
    tema: 'azul',
    icone: 'pessoas',
    descricao: 'Time, cultura e processos de pessoas.',
    sub: [],
  },
  {
    slug: 'projetos',
    nome: 'Projetos',
    tema: 'verde',
    icone: 'projetos',
    descricao: 'Operações, relacionamentos e a diretoria da área.',
    sub: [
      {
        slug: 'diretoria',
        nome: 'Projetos Diretoria',
        icone: 'diretoria',
        descricao: 'Visão consolidada da diretoria de Projetos.',
      },
      {
        slug: 'operacoes',
        nome: 'Operações',
        icone: 'engrenagem',
        descricao: 'Execução e entrega dos projetos.',
      },
      {
        slug: 'relacionamentos',
        nome: 'Relacionamentos',
        icone: 'aperto',
        descricao: 'Clientes, parcerias e pós-venda.',
      },
    ],
  },
  {
    slug: 'presidencia',
    nome: 'Presidência',
    tema: 'amarelo',
    icone: 'presidencia',
    descricao: 'Presidência e vice-presidência.',
    sub: [
      {
        slug: 'presidencia',
        nome: 'Presidência',
        icone: 'presidencia',
        descricao: 'Visão institucional e indicadores gerais.',
      },
      {
        slug: 'vice',
        nome: 'Vice-Presidência',
        icone: 'diretoria',
        descricao: 'Pautas e acompanhamento da vice-presidência.',
      },
    ],
  },
]

/** Card de Administração — fora da lista porque só aparece para admin. */
export const CARD_ADMIN = {
  slug: 'admin',
  nome: 'Administração',
  tema: 'amarelo',
  icone: 'engrenagem',
  descricao: 'Usuários, cargos, semestres e configurações.',
}

export function buscarArea(slug) {
  return AREAS.find((area) => area.slug === slug)
}
