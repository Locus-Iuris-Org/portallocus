-- =====================================================================
-- CADA PESSOA SALVA O PRÓPRIO PERFIL
--
-- Rode este arquivo UMA VEZ no Supabase:
--   painel do projeto -> SQL Editor -> New query -> cole tudo -> Run
--
-- Pode rodar de novo sem medo.
--
-- O PROBLEMA: hoje só o admin consegue salvar o perfil, porque a
-- tabela `usuarios` não tem política de UPDATE para usuário comum —
-- quem salva passa pela política "admin total".
--
-- A SOLUÇÃO SÃO DUAS TRAVAS DE NATUREZAS DIFERENTES:
--
--   1. RLS  -> decide QUAL LINHA a pessoa pode alterar (a própria)
--   2. GRANT -> decide QUAIS COLUNAS podem ser escritas (as pessoais)
--
-- Só a primeira não bastaria: o RLS não distingue coluna, então
-- "pode editar a própria linha" incluiria `is_admin_tecnico`, e
-- qualquer pessoa se promoveria a admin pelo console do navegador.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Política: cada um mexe só na PRÓPRIA linha
--
-- `using`      -> quais linhas podem ser alcançadas
-- `with check` -> como a linha pode ficar depois (impede "mudar de dono")
--
-- Esta política SOMA com a "admin total" que já existe; ela não
-- substitui nem enfraquece a outra. No Postgres, políticas permissivas
-- se somam: basta uma permitir. O admin continua com passe livre nas
-- LINHAS.
-- ---------------------------------------------------------------------
drop policy if exists "usuario edita a propria linha" on public.usuarios;
create policy "usuario edita a propria linha"
  on public.usuarios for update to authenticated
  using      ( id = auth.uid() )
  with check ( id = auth.uid() );


-- ---------------------------------------------------------------------
-- 2. Colunas: o navegador só escreve nas pessoais
--
-- ATENÇÃO: isto vale para TODO MUNDO que entra pelo navegador,
-- inclusive o admin — é intencional. Colunas sensíveis (cargo_id,
-- is_admin_tecnico, ativo, id, email, criado_em) passam a ser
-- alteráveis só aqui pelo SQL Editor ou, no futuro, por função de
-- servidor.
--
-- CONSEQUÊNCIA A LEMBRAR: quando o painel de admin for trocar o cargo
-- de alguém, ele NÃO vai conseguir por UPDATE direto do navegador.
-- Vai precisar de uma função `security definer`.
--
-- O `revoke` mexe só no UPDATE — a leitura (select) continua como está.
-- ---------------------------------------------------------------------
revoke update on public.usuarios from authenticated, anon;

grant update (nome, telefone, aniversario, avatar_url)
  on public.usuarios to authenticated;


-- ---------------------------------------------------------------------
-- 3. Conferência — rode depois e veja o resultado
-- ---------------------------------------------------------------------

-- (a) Deve listar exatamente 4 linhas: nome, telefone, aniversario,
--     avatar_url. Se aparecer mais alguma, algo deu errado.
--
-- select column_name
--   from information_schema.column_privileges
--  where table_schema = 'public'
--    and table_name   = 'usuarios'
--    and grantee      = 'authenticated'
--    and privilege_type = 'UPDATE'
--  order by column_name;

-- (b) Deve mostrar a política nova ao lado da de admin.
--
-- select policyname, cmd, roles
--   from pg_policies
--  where schemaname = 'public' and tablename = 'usuarios';

-- (c) A PROVA DA TRAVA: este comando tem que FALHAR.
--     Erro esperado: permission denied for column is_admin_tecnico
--
-- set local role authenticated;
-- update public.usuarios set is_admin_tecnico = true where id = auth.uid();
-- reset role;


-- ---------------------------------------------------------------------
-- 4. Pendência anotada para a etapa da foto
--
-- A função `atualizar_meu_perfil` (criada em 2026-07-30-perfil.sql) é
-- `security definer`: roda com poderes de dono e PASSA POR CIMA dos
-- grants de coluna acima. Não é falha de segurança — ela só escreve
-- nome/telefone/avatar_url, nunca em coluna sensível — mas é um
-- caminho paralelo que não deveria continuar existindo.
--
-- Como o grant acima já inclui `avatar_url`, na etapa da foto dá para
-- trocar a chamada por UPDATE direto e então remover a função:
--
--   drop function if exists public.atualizar_meu_perfil(text, text, text);
--
-- Não faça isso ainda: o upload de foto ainda depende dela.
-- ---------------------------------------------------------------------
