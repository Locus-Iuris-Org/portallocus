import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Carregando from '../components/Carregando'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { formatarData } from '../formato'
import './Perfil.css'

const TAMANHO_MAXIMO = 2 * 1024 * 1024 // 2 MB
const BUCKET = 'avatares'

function iniciaisDe(nome, email) {
  const partes = (nome || '').trim().split(/\s+/).filter(Boolean)
  if (partes.length >= 2) {
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
  }
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (email || '?').slice(0, 2).toUpperCase()
}

/**
 * Tira da linha do banco só os campos que o formulário edita.
 * Usada ao carregar a tela e ao cancelar a edição — por isso é uma
 * função pura, longe do estado.
 */
function camposDe(linha) {
  return {
    nome: linha?.nome || '',
    telefone: linha?.telefone || '',
    // O banco devolve a data como 'AAAA-MM-DD', que é justamente o
    // formato que o seletor de data do navegador espera.
    aniversario: (linha?.aniversario || '').slice(0, 10),
  }
}

/** Valor para o modo leitura: vazio vira travessão. */
function ouTraco(valor) {
  return valor?.trim() ? valor : '—'
}

export default function Perfil() {
  const { sessao, carregando: carregandoSessao } = useAuth()
  const inputFoto = useRef(null)

  const [perfil, setPerfil] = useState(null)
  const [carregando, setCarregando] = useState(true)

  // Dados pessoais: a seção abre em leitura e só vira formulário
  // quando o usuário clica em "Editar".
  const [editando, setEditando] = useState(false)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [aniversario, setAniversario] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [aviso, setAviso] = useState(null)

  // Foto
  const [enviandoFoto, setEnviandoFoto] = useState(false)

  // Senha: escondida atrás do botão "Alterar senha".
  const [trocaAberta, setTrocaAberta] = useState(false)
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [trocandoSenha, setTrocandoSenha] = useState(false)
  const [avisoSenha, setAvisoSenha] = useState(null)

  const email = sessao?.user?.email ?? ''

  useEffect(() => {
    if (!sessao) return
    let ativo = true

    async function carregarPerfil() {
      setCarregando(true)

      // A área do usuário vem pelo cargo:
      //   usuarios.cargo_id -> cargos.area_visao_id -> areas.nome
      // O `!area_visao_id` diz por qual chave estrangeira fazer o join,
      // caso `cargos` aponte para `areas` por mais de uma coluna.
      let { data, error } = await supabase
        .from('usuarios')
        .select('*, cargos(*, area:areas!area_visao_id(nome))')
        .eq('id', sessao.user.id)
        .single()

      // Se o join falhar (nome de chave diferente do esperado), ainda
      // assim carrega o perfil — só a área fica sem nome.
      if (error) {
        console.warn('Perfil: join com áreas falhou ->', error.message)
        ;({ data, error } = await supabase
          .from('usuarios')
          .select('*, cargos(*)')
          .eq('id', sessao.user.id)
          .single())
      }

      if (!ativo) return

      if (error) {
        console.error('Perfil: erro ao carregar ->', error.message)
        setAviso({ tipo: 'erro', texto: 'Não foi possível carregar seu perfil.' })
      } else {
        setPerfil(data)
        const campos = camposDe(data)
        setNome(campos.nome)
        setTelefone(campos.telefone)
        setAniversario(campos.aniversario)
      }
      setCarregando(false)
    }

    carregarPerfil()
    return () => {
      ativo = false
    }
  }, [sessao])

  async function salvarDados(e) {
    e.preventDefault()
    setAviso(null)

    if (!nome.trim()) {
      setAviso({ tipo: 'erro', texto: 'O nome não pode ficar vazio.' })
      return
    }

    setSalvando(true)

    // Campos em branco viram null, para combinar com o "—" da leitura.
    const novos = {
      nome: nome.trim(),
      telefone: telefone.trim() || null,
      aniversario: aniversario || null,
    }

    // Grava direto na própria linha. O filtro por id garante que
    // ninguém escreve no perfil de outro.
    const { error } = await supabase
      .from('usuarios')
      .update(novos)
      .eq('id', sessao.user.id)

    setSalvando(false)

    if (error) {
      console.error('Perfil: erro ao salvar ->', error.message)
      setAviso({ tipo: 'erro', texto: `Não foi possível salvar: ${error.message}` })
      return
    }

    setPerfil((atual) => ({ ...atual, ...novos }))
    setEditando(false)
    setAviso({ tipo: 'ok', texto: 'Dados salvos.' })
  }

  function cancelarEdicao() {
    // Devolve os campos ao que veio do banco, jogando fora o digitado.
    const campos = camposDe(perfil)
    setNome(campos.nome)
    setTelefone(campos.telefone)
    setAniversario(campos.aniversario)
    setAviso(null)
    setEditando(false)
  }

  function fecharTrocaDeSenha() {
    setSenha('')
    setConfirmarSenha('')
    setAvisoSenha(null)
    setTrocaAberta(false)
  }

  async function enviarFoto(evento) {
    const arquivo = evento.target.files?.[0]
    evento.target.value = '' // permite reenviar o mesmo arquivo
    if (!arquivo) return

    setAviso(null)

    if (!arquivo.type.startsWith('image/')) {
      setAviso({ tipo: 'erro', texto: 'Escolha um arquivo de imagem.' })
      return
    }
    if (arquivo.size > TAMANHO_MAXIMO) {
      setAviso({ tipo: 'erro', texto: 'A imagem precisa ter no máximo 2 MB.' })
      return
    }

    setEnviandoFoto(true)

    // A pasta é o ID do usuário — é isso que a regra do bucket confere.
    const caminho = `${sessao.user.id}/avatar`

    const { error: erroUpload } = await supabase.storage
      .from(BUCKET)
      .upload(caminho, arquivo, {
        upsert: true,
        contentType: arquivo.type,
      })

    if (erroUpload) {
      setEnviandoFoto(false)
      console.error('Perfil: erro no upload ->', erroUpload.message)
      setAviso({
        tipo: 'erro',
        texto:
          'Não foi possível enviar a foto. Se o bucket "avatares" ainda não existe, rode o arquivo supabase/2026-07-30-perfil.sql.',
      })
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(caminho)

    // O ?v= força o navegador a buscar a imagem nova em vez da do cache.
    const urlComVersao = `${publicUrl}?v=${Date.now()}`

    const { error: erroSalvar } = await supabase.rpc('atualizar_meu_perfil', {
      p_nome_completo: null,
      p_telefone: telefone,
      p_avatar_url: urlComVersao,
    })

    setEnviandoFoto(false)

    if (erroSalvar) {
      console.error('Perfil: erro ao salvar a foto ->', erroSalvar.message)
      setAviso({ tipo: 'erro', texto: 'A foto subiu, mas não foi possível salvá-la no perfil.' })
      return
    }

    setPerfil((atual) => ({ ...atual, avatar_url: urlComVersao }))
    setAviso({ tipo: 'ok', texto: 'Foto atualizada.' })
  }

  async function trocarSenha(e) {
    e.preventDefault()
    setAvisoSenha(null)

    if (senha.length < 8) {
      setAvisoSenha({ tipo: 'erro', texto: 'A senha precisa ter ao menos 8 caracteres.' })
      return
    }
    if (senha !== confirmarSenha) {
      setAvisoSenha({ tipo: 'erro', texto: 'As senhas não coincidem.' })
      return
    }

    setTrocandoSenha(true)
    const { error } = await supabase.auth.updateUser({ password: senha })
    setTrocandoSenha(false)

    if (error) {
      setAvisoSenha({ tipo: 'erro', texto: error.message })
      return
    }

    setSenha('')
    setConfirmarSenha('')
    setTrocaAberta(false)
    setAvisoSenha({ tipo: 'ok', texto: 'Senha alterada.' })
  }

  if (carregandoSessao || carregando) {
    return (
      <>
        <Header />
        <Carregando />
      </>
    )
  }

  const nomeExibido = perfil?.nome_completo || perfil?.nome || 'Sem nome'
  const cargoNome = perfil?.cargos?.nome || '—'
  const areaNome = perfil?.cargos?.area?.nome || '—'

  return (
    <>
      <Header />

      <main className="perfil">
        <div className="perfil__conteudo">
          <Link to="/" className="area__voltar">
            <span aria-hidden="true">←</span> Voltar
          </Link>

          {/* --- Cabeçalho --- */}
          <div className="perfil__cabecalho">
            <button
              type="button"
              className="perfil__foto"
              onClick={() => inputFoto.current?.click()}
              disabled={enviandoFoto}
              aria-label="Trocar foto de perfil"
            >
              {perfil?.avatar_url ? (
                <img src={perfil.avatar_url} alt="" />
              ) : (
                <span className="perfil__iniciais">
                  {iniciaisDe(nomeExibido, email)}
                </span>
              )}

              <span className="perfil__foto-capa">
                {enviandoFoto ? 'Enviando…' : 'Trocar'}
              </span>
            </button>

            <input
              ref={inputFoto}
              type="file"
              accept="image/*"
              onChange={enviarFoto}
              hidden
            />

            <div className="perfil__identificacao">
              <h1 className="perfil__nome">{nomeExibido}</h1>
              <p className="perfil__email">{email}</p>

              <div className="perfil__etiquetas">
                <span className="etiqueta">
                  <span className="etiqueta__rotulo">Cargo</span>
                  {cargoNome}
                </span>
                <span className="etiqueta">
                  <span className="etiqueta__rotulo">Área</span>
                  {areaNome}
                </span>
              </div>

              <p className="perfil__nota">
                Cargo e área são definidos pelo administrador do portal.
              </p>
            </div>
          </div>

          {/* --- Dados pessoais: leitura por padrão, edição sob pedido --- */}
          {editando ? (
            <form className="cartao" onSubmit={salvarDados}>
              <div className="cartao__topo">
                <h2 className="cartao__titulo">Dados pessoais</h2>
              </div>

              <label className="campo">
                Nome completo
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </label>

              <label className="campo">
                Telefone
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 90000-0000"
                />
              </label>

              <label className="campo">
                Aniversário
                <input
                  type="date"
                  value={aniversario}
                  onChange={(e) => setAniversario(e.target.value)}
                />
              </label>

              {aviso && <p className={`aviso aviso--${aviso.tipo}`}>{aviso.texto}</p>}

              <div className="cartao__acoes">
                <button
                  type="button"
                  className="botao-neutro"
                  onClick={cancelarEdicao}
                  disabled={salvando}
                >
                  Cancelar
                </button>
                <button type="submit" className="botao-dourado" disabled={salvando}>
                  {salvando ? 'Salvando…' : 'Salvar alterações'}
                </button>
              </div>
            </form>
          ) : (
            <section className="cartao">
              <div className="cartao__topo">
                <h2 className="cartao__titulo">Dados pessoais</h2>
                <button
                  type="button"
                  className="botao-pequeno"
                  onClick={() => {
                    setAviso(null)
                    setEditando(true)
                  }}
                >
                  Editar
                </button>
              </div>

              <dl className="dados">
                <div className="dados__linha">
                  <dt>Nome completo</dt>
                  <dd>{ouTraco(perfil?.nome)}</dd>
                </div>
                <div className="dados__linha">
                  <dt>Telefone</dt>
                  <dd>{ouTraco(perfil?.telefone)}</dd>
                </div>
                <div className="dados__linha">
                  <dt>Aniversário</dt>
                  <dd>
                    {perfil?.aniversario
                      ? formatarData(perfil.aniversario.slice(0, 10))
                      : '—'}
                  </dd>
                </div>
              </dl>

              {aviso && <p className={`aviso aviso--${aviso.tipo}`}>{aviso.texto}</p>}
            </section>
          )}

          {/* --- Senha: os campos só aparecem quando pedidos --- */}
          {trocaAberta ? (
            <form className="cartao" onSubmit={trocarSenha}>
              <div className="cartao__topo">
                <h2 className="cartao__titulo">Senha</h2>
              </div>

              <label className="campo">
                Nova senha
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>

              <label className="campo">
                Confirmar nova senha
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>

              {avisoSenha && (
                <p className={`aviso aviso--${avisoSenha.tipo}`}>{avisoSenha.texto}</p>
              )}

              <div className="cartao__acoes">
                <button
                  type="button"
                  className="botao-neutro"
                  onClick={fecharTrocaDeSenha}
                  disabled={trocandoSenha}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="botao-dourado"
                  disabled={trocandoSenha}
                >
                  {trocandoSenha ? 'Alterando…' : 'Confirmar nova senha'}
                </button>
              </div>
            </form>
          ) : (
            <section className="cartao">
              <div className="cartao__topo">
                <h2 className="cartao__titulo">Senha</h2>
                <button
                  type="button"
                  className="botao-pequeno"
                  onClick={() => setTrocaAberta(true)}
                >
                  Alterar senha
                </button>
              </div>

              {avisoSenha && (
                <p className={`aviso aviso--${avisoSenha.tipo}`}>{avisoSenha.texto}</p>
              )}
            </section>
          )}
        </div>
      </main>
    </>
  )
}
