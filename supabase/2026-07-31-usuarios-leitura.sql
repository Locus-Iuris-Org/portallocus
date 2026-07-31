-- =====================================================================
-- LEITURA DA TABELA usuarios PARA QUALQUER PESSOA LOGADA
--
-- JÁ FOI RODADO no SQL Editor em 31/07/2026. Este arquivo é o
-- registro do que está no banco — rodar de novo não faz mal.
--
-- POR QUE: contas não-admin não conseguiam nem CARREGAR o próprio
-- perfil. A leitura da tabela era restrita, e o perfil-crachá (nome,
-- foto, cargo) é informação pública entre quem trabalha na Locus.
--
-- O QUE MUDA: qualquer pessoa logada LÊ as linhas de `usuarios`.
--
-- O QUE NÃO MUDA: a ESCRITA continua restrita. Cada um só altera a
-- própria linha, e só nas colunas pessoais — ver
-- 2026-07-31-perfil-rls.sql. Ler é livre; escrever não.
--
-- OBSERVAÇÃO DE PRIVACIDADE: `using (true)` libera a LINHA INTEIRA,
-- não apenas os campos de crachá. Na prática, qualquer pessoa logada
-- consegue ler telefone, aniversário e is_admin_tecnico de todo mundo
-- pela API — não só o que a tela mostra. Se um dia isso incomodar, o
-- caminho é uma view com as colunas públicas (ou uma política por
-- coluna), e a tela passa a ler dessa view.
--
-- Nota: esta política SOMA com as de leitura que já existiam. No
-- Postgres, políticas permissivas se somam — basta uma liberar.
-- =====================================================================

drop policy if exists "leitura de perfis para logados" on public.usuarios;
create policy "leitura de perfis para logados"
  on public.usuarios for select to authenticated
  using ( true );


-- ---------------------------------------------------------------------
-- Conferência — deve listar esta política ao lado das outras
-- ---------------------------------------------------------------------
-- select policyname, cmd, roles
--   from pg_policies
--  where schemaname = 'public' and tablename = 'usuarios'
--  order by cmd, policyname;
