# CLAUDE.md — Portal Locus Iuris

> Este arquivo é lido automaticamente pelo Claude Code em toda sessão.
> Ele carrega o contexto do projeto para você não precisar reexplicar tudo.

## Quem sou eu e como trabalhar comigo

- Sou o Davi, coordenador/diretor de mercado na Locus Iuris. **Não tenho experiência com programação** e estou aprendendo pelo caminho.
- **Explique antes de fazer.** Antes de escrever ou mudar código, me diga em português simples o que vai fazer e por quê. Prefiro entender o plano a receber um monte de código pronto.
- **Um passo de cada vez.** Não faça cinco coisas de uma vez. Faça uma, me mostre, confirme comigo, siga.
- Quando eu pedir algo que pode quebrar segurança ou dados, **me avise em vez de obedecer cegamente.**

## O que é o portal

Portal de inteligência comercial da Locus Iuris: um dashboard de vendas com KPIs, gráficos, metas, acompanhamento de progresso e registro detalhado de vendas ("Bíblia de Vendas"). Estamos **reconstruindo do zero** uma versão anterior que tinha falhas críticas de segurança.

## A lição que originou esta reconstrução

A versão antiga falava **direto** com o Google Sheets e expunha credenciais/endpoints sem autenticação (qualquer um escrevia no backend). **Segurança e modelo de dados vêm primeiro, telas por último.** Nunca repita os padrões antigos.

## Stack

- **Frontend:** React + Vite (ainda não montado — é a Fase 2)
- **Banco/Backend:** Supabase (Postgres + Auth + RLS) — **já criado e configurado**
- **Hospedagem:** Vercel (repo `davimot/dashboard-locus`, sob GitHub Organization institucional)
- **Fonte de dados de venda:** Google Sheets → sincronização de **mão única** para o Supabase
- Rodo local com `vercel dev` (não `npm run dev`).

## Regras de segurança inegociáveis

1. **Segredos NUNCA no frontend.** Chaves (Google service account, `service_role` do Supabase, futuras RD Station/Pipefy) só em variáveis de ambiente na Vercel, usadas só em funções de backend. O navegador só conhece a `anon key` pública.
2. **Sincronização Sheets → Supabase é de mão única.** O portal só LÊ vendas; nunca escreve no Sheets. E **ninguém escreve na tabela `vendas` pelo app** — só a função de sync, que roda com poderes de servidor.
3. **Toda proteção mora no banco (RLS)**, não em `if` no frontend.

## As três coisas separadas (alicerce do sistema)

- **Conta** = login (email @locus, Supabase Auth) → tabela `usuarios`.
- **Cargo** = a "tag" de permissões, trocável → `usuarios.cargo_id` → `cargos`.
- **Identidade de vendas** = quem aparece vendendo, PERMANENTE → `usuarios.gerente_id` → `gerentes`.

Uma conta tem um cargo (trocável) e pode ter um `gerente_id` (fixo, opcional). Qualquer cargo pode ter identidade de vendas.

**Admin NÃO é um cargo.** É o interruptor `usuarios.is_admin_tecnico` (true/false), separado do cargo. Davi hoje: cargo `Gerente Comercial` + `is_admin_tecnico = true`.

## Dimensões que são "etiquetas" (nunca hardcode)

- **Semestre:** deduzido da data. Tabela `semestres`; metas/eventos apontam para `semestre_id`. Trocar = filtrar, nunca migrar/resetar.
- **Área:** tabela `areas` (Mercado, com Comercial e Marketing como filhas via `area_pai_id`). Área nova = uma linha.

## Vínculo conta ↔ gerente (crítico)

Nunca casar por nome. As vendas do Sheets são traduzidas para `gerente_id` na sincronização, via tabela `apelidos` (nomes alternativos → gerente). Nome que não casa vai com `gerente_id` nulo (balde de "não identificados") para o admin resolver — nunca inventar, nunca descartar. No Sheets, usar menu suspenso (data validation) para reduzir divergência.

## PERMISSÕES — como REALMENTE funciona (versão final)

A visão geral do dashboard (KPIs, gráficos, totais, vendas) é **livre para todo mundo logado**. As ÚNICAS coisas que dependem de permissão são:

1. **Edição** — controlada por 3 caixinhas booleanas em `cargos`:
   - `edita_estrutura` → semestres, serviços, origens, áreas, cargos
   - `edita_metas_oficiais` → eventos (EDL, WW, Vórtice, ConCEJ)
   - `edita_metas_comerciais` → metas (por gerente + interna)
2. **Perfil individual sensível do gerente** (taxa de conversão, etc. — AINDA NÃO EXISTE) — controlado pela caixinha `cargos.e_lideranca`: só o próprio gerente e as lideranças veem.

Cargos atuais (todos com visão geral livre; diferença está nas caixinhas):

| Cargo | e_lideranca | edita_estrutura | edita_metas_oficiais | edita_metas_comerciais |
|---|---|---|---|---|
| Presidência | ✅ | ✅ | ✅ | ✅ |
| Diretor de Mercado | ✅ | ❌ | ✅ | ✅ |
| Coordenador Comercial | ✅ | ❌ | ❌ | ✅ |
| Gerente Comercial | ❌ | ❌ | ❌ | ❌ |
| Assessor de Marketing | ❌ | ❌ | ❌ | ❌ |
| Sem acesso (padrão de conta nova) | ❌ | ❌ | ❌ | ❌ |

- ConCEJ = **R$307.500** (não R$325k).
- Perfil pessoal (meus resultados) aparece para qualquer conta com `gerente_id`.

## Invariantes de segurança de gestão

- **Sempre ≥ 1 admin.** O sistema nunca deixa o último admin se apagar/rebaixar.
- **Handoff:** admin que sai promove o que entra ANTES de sair.
- **Break-glass:** conta institucional dona do projeto no Supabase é a recuperação final.
- Conta nova nasce com cargo "Sem acesso" (gatilho `handle_new_user`) até um admin atribuir a tag.

## Estado atual do banco (feito nesta sessão)

**11 tabelas, todas com RLS ligado:**
`areas`, `cargos`, `gerentes`, `usuarios` (estrutura) + `semestres`, `servicos`, `origens`, `eventos`, `metas`, `vendas`, `apelidos` (venda/config).

**Funções ajudantes de RLS:** `is_admin()`, `e_lideranca()`, `edita_estrutura()`, `edita_metas_oficiais()`, `edita_metas_comerciais()`.

**Políticas de RLS instaladas:**
- Admin: passe livre ("admin total ...") em todas as tabelas.
- Leitura: liberada para todo logado em todas (vendas, estrutura, config). `usuarios` = só o próprio (+ admin lê todos).
- Escrita: estrutura → `edita_estrutura`; eventos → `edita_metas_oficiais`; metas → `edita_metas_comerciais`. `vendas` sem escrita de usuário (só sync).

**Dados semente:** áreas (Mercado/Comercial/Marketing), 6 cargos, 1 semestre ('2026/2', ativo), a conta+gerente do Davi. Listas de serviços/origens e valores de metas/eventos serão preenchidos por Davi pelo painel de admin (Fase 5).

## Pendências conhecidas (para as próximas fases)

- **Fase 2:** montar o projeto React + Vite, conectar ao Supabase (anon key), estrutura de pastas.
- Restringir cadastro ao domínio @locus (config em Authentication).
- Bucket `avatares` no Storage + tela de cadastro com foto (`usuarios.avatar_url` já existe).
- **Dados sensíveis do perfil individual** (taxa de conversão etc.): quando existirem, criar tabela própria (ex: `resultados_gerente`) e proteger com regra "próprio gerente OU `e_lideranca()` OU admin" — usando o ajudante `e_lideranca()` já criado.
- Ranking com nome/total por gerente: removido por ora; se voltar, revisar exposição de dados por gerente.
- Função de sync Sheets → Supabase (Fase 4), com a tradução via `apelidos`.
- Função de totais agregados para KPIs (soma, sem expor linha sensível).
