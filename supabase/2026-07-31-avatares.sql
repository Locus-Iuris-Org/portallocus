-- =====================================================================
-- FOTO DE PERFIL — onde as imagens moram e quem pode mexer nelas
--
-- RODE ESTE ARQUIVO SÓ DEPOIS que o código novo estiver no ar. O
-- passo 5 apaga a função antiga; se rodar antes, o upload de foto fica
-- quebrado no intervalo.
--
--   painel do projeto -> SQL Editor -> New query -> cole tudo -> Run
--
-- Pode rodar de novo sem medo.
--
-- ATENÇÃO: o bucket 'avatares' provavelmente JÁ EXISTE — ele foi criado
-- em 2026-07-30-perfil.sql. Este arquivo então ATUALIZA o que já está
-- lá (acrescentando limite de tamanho e tipos aceitos) e SUBSTITUI as
-- políticas antigas em vez de duplicá-las.
--
-- A ideia é a mesma da tabela usuarios, aplicada a arquivos:
-- cada pessoa mexe só no que é dela. Na tabela, "seu" é a linha com
-- seu id. No Storage, "seu" é a pasta com o seu id.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. O bucket
--
-- public = true: quem tiver o link abre a imagem sem estar logado. É o
-- padrão para foto de crachá e evita ter que gerar link temporário a
-- cada exibição.
--
-- O limite de 2 MB e a lista de tipos são a segunda linha de defesa:
-- a tela já confere antes de enviar, mas quem chamasse a API direto
-- passaria por cima dessa checagem. Aqui não passa.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatares',
  'avatares',
  true,
  2097152,                                        -- 2 MB, em bytes
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
   set public             = excluded.public,
       file_size_limit    = excluded.file_size_limit,
       allowed_mime_types = excluded.allowed_mime_types;


-- ---------------------------------------------------------------------
-- 2. Fora as políticas da versão anterior, para não ficarem duplicadas
--    fazendo a mesma coisa com nomes diferentes.
-- ---------------------------------------------------------------------
drop policy if exists "avatares: qualquer um vê"            on storage.objects;
drop policy if exists "avatares: envia só na própria pasta" on storage.objects;
drop policy if exists "avatares: troca só a própria"        on storage.objects;
drop policy if exists "avatares: apaga só a própria"        on storage.objects;


-- ---------------------------------------------------------------------
-- 3. Leitura: livre
--
-- O bucket é público de qualquer forma; esta política deixa isso
-- explícito para quem for ler as regras depois.
-- ---------------------------------------------------------------------
drop policy if exists "avatares: leitura publica" on storage.objects;
create policy "avatares: leitura publica"
  on storage.objects for select
  using ( bucket_id = 'avatares' );


-- ---------------------------------------------------------------------
-- 4. Escrita: cada um só na PRÓPRIA pasta
--
-- O arquivo é gravado como "<id-do-usuario>/avatar".
-- storage.foldername(name) quebra esse caminho em pedaços, e o
-- pedaço [1] é a pasta — o id. Comparando com auth.uid(), ninguém
-- consegue enviar, substituir ou apagar a foto de outra pessoa.
--
-- Sem isto, bastaria mandar o arquivo com o nome de outro para
-- trocar a foto dele.
-- ---------------------------------------------------------------------
drop policy if exists "avatares: envia na propria pasta" on storage.objects;
create policy "avatares: envia na propria pasta"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatares: substitui a propria" on storage.objects;
create policy "avatares: substitui a propria"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatares: apaga a propria" on storage.objects;
create policy "avatares: apaga a propria"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ---------------------------------------------------------------------
-- 5. Apaga a função antiga
--
-- `atualizar_meu_perfil` era o jeito antigo de gravar o perfil. O
-- código não a chama mais em lugar nenhum: nome, telefone, aniversário
-- e agora a foto usam UPDATE direto na própria linha.
--
-- Vale apagar porque ela é `security definer` — roda com poderes de
-- dono e passa por cima dos grants de coluna criados em
-- 2026-07-31-perfil-rls.sql. Não era falha (ela só escrevia colunas
-- pessoais), mas é um caminho paralelo que ninguém mais vigia.
--
-- Se preferir manter por enquanto, apague só esta linha.
-- ---------------------------------------------------------------------
drop function if exists public.atualizar_meu_perfil(text, text, text);


-- ---------------------------------------------------------------------
-- 6. Conferência
-- ---------------------------------------------------------------------

-- (a) O bucket deve aparecer com limite e tipos preenchidos.
--
-- select id, public, file_size_limit, allowed_mime_types
--   from storage.buckets where id = 'avatares';

-- (b) Devem sobrar 4 políticas de avatares: leitura, envia,
--     substitui, apaga.
--
-- select policyname, cmd from pg_policies
--  where schemaname = 'storage' and tablename = 'objects'
--    and policyname like 'avatares%'
--  order by cmd;

-- (c) A função não deve mais existir — zero linhas.
--
-- select proname from pg_proc where proname = 'atualizar_meu_perfil';
