-- =====================================================================
-- TELA DE PERFIL — o que precisa existir no banco
--
-- Rode este arquivo UMA VEZ no Supabase:
--   painel do projeto -> SQL Editor -> New query -> cole tudo -> Run
--
-- Pode rodar de novo sem medo: tudo aqui é "se não existir".
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Coluna de telefone
-- ---------------------------------------------------------------------
alter table public.usuarios
  add column if not exists telefone text;


-- ---------------------------------------------------------------------
-- 2. A função que salva o perfil
--
-- POR QUE UMA FUNÇÃO, E NÃO UMA POLÍTICA DE UPDATE NA TABELA:
--
-- O RLS do Postgres controla QUAIS LINHAS a pessoa mexe, não quais
-- COLUNAS. Uma política do tipo "o usuário pode atualizar a própria
-- linha" libera a linha INTEIRA — inclusive `is_admin_tecnico`. Na
-- prática, qualquer funcionário poderia abrir o Console do navegador,
-- chamar a API e se tornar admin do portal. Também poderia trocar o
-- próprio `cargo_id` e o `gerente_id` (que é permanente por definição).
--
-- Esta função resolve isso: ela escreve em três colunas e só nelas.
-- Não existe caminho para escalar privilégio, porque a tabela
-- continua sem política de escrita para o usuário comum.
--
-- `security definer` = a função roda com poderes de dono, então
-- funciona mesmo sem política de UPDATE na tabela.
-- `set search_path` = trava o caminho de busca (sem isso, a função
-- security definer fica vulnerável a sequestro de schema).
-- ---------------------------------------------------------------------
create or replace function public.atualizar_meu_perfil(
  p_nome_completo text default null,
  p_telefone      text default null,
  p_avatar_url    text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.uid() é a pessoa logada. Nunca vem do frontend, então
  -- ninguém consegue editar o perfil de outro.
  update public.usuarios
     set nome_completo = coalesce(nullif(trim(p_nome_completo), ''), nome_completo),
         telefone      = nullif(trim(p_telefone), ''),
         avatar_url    = coalesce(p_avatar_url, avatar_url)
   where id = auth.uid();
end;
$$;

-- Só quem está logado pode chamar.
revoke all on function public.atualizar_meu_perfil(text, text, text) from public, anon;
grant execute on function public.atualizar_meu_perfil(text, text, text) to authenticated;


-- ---------------------------------------------------------------------
-- 3. O bucket das fotos
--
-- public = true significa que quem tiver o link da imagem consegue
-- abri-la sem estar logado. É o padrão para foto de perfil e mantém a
-- tela simples. Se preferir fechar, troque para false — aí a tela
-- precisa gerar links temporários e eu ajusto o código.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatares', 'avatares', true)
on conflict (id) do nothing;


-- ---------------------------------------------------------------------
-- 4. Regras do bucket
--
-- Cada pessoa só escreve dentro da pasta com o próprio ID. Sem isto,
-- um usuário conseguiria sobrescrever a foto de outro só mandando o
-- arquivo com o nome dele.
-- ---------------------------------------------------------------------
drop policy if exists "avatares: qualquer um vê" on storage.objects;
create policy "avatares: qualquer um vê"
  on storage.objects for select
  using (bucket_id = 'avatares');

drop policy if exists "avatares: envia só na própria pasta" on storage.objects;
create policy "avatares: envia só na própria pasta"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatares: troca só a própria" on storage.objects;
create policy "avatares: troca só a própria"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatares: apaga só a própria" on storage.objects;
create policy "avatares: apaga só a própria"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ---------------------------------------------------------------------
-- 5. Conferência (opcional) — deve devolver uma linha
-- ---------------------------------------------------------------------
-- select proname, prosecdef from pg_proc where proname = 'atualizar_meu_perfil';
-- select id, public from storage.buckets where id = 'avatares';
