/* ============================================================
   script.js - INTERATIVIDADE (camada 3)

   USO DE IA (obrigatório declarar):
   TROQUE: ajuste este texto com a verdade. Exemplo:
   "Usei o Claude (IA) para montar o esqueleto do portfólio e para
   entender cada função. Li, testei e consigo explicar o código."

   Ordem do arquivo:
   1. Referências aos elementos do HTML
   2. Saudação dinâmica
   3. Menu hambúrguer
   4. Modo claro/escuro (+ localStorage)
   5. Validação do formulário
   6. Ano automático
   7. Botão "voltar ao topo" (bônus)
   8. Inicialização (liga tudo quando a página carrega)
   ============================================================ */


/* ---------- 1. REFERÊNCIAS AOS ELEMENTOS ----------
   Guardamos em variáveis os elementos que vamos usar.
   O texto entre aspas é o id que está no index.html. */
const botaoMenu = document.getElementById("botaoMenu");
const menuPrincipal = document.getElementById("menuPrincipal");
const botaoTema = document.getElementById("botaoTema");
const botaoTopo = document.getElementById("botaoTopo");
const formContato = document.getElementById("formContato");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoMensagem = document.getElementById("mensagem");
const campoConsentimento = document.getElementById("consentimento");
const mensagemSucesso = document.getElementById("mensagemSucesso");


/* ---------- 2. SAUDAÇÃO DINÂMICA ---------- */

// Recebe a hora (0 a 23) e devolve a saudação certa.
// Na defesa, o professor pode pedir para mudar estes horários!
function obterSaudacao(hora) {
  if (hora < 12) {
    return "Bom dia";        // de 0h até 11h
  } else if (hora < 18) {
    return "Boa tarde";      // de 12h até 17h
  } else {
    return "Boa noite";      // de 18h até 23h
  }
}

// Pega a hora atual do computador e escreve a saudação na página.
function mostrarSaudacao() {
  const horaAtual = new Date().getHours();
  document.getElementById("saudacao").textContent = obterSaudacao(horaAtual);
}


/* ---------- 3. MENU HAMBÚRGUER ---------- */

// Abre/fecha o menu no celular e atualiza o aria-expanded (leitores de tela).
function alternarMenu() {
  // toggle: se a classe existe, remove; se não existe, adiciona.
  // O retorno é true quando o menu ficou aberto.
  const menuAberto = menuPrincipal.classList.toggle("menu--aberto");

  botaoMenu.setAttribute("aria-expanded", menuAberto);
  botaoMenu.setAttribute(
    "aria-label",
    menuAberto ? "Fechar menu de navegação" : "Abrir menu de navegação"
  );
}

// Fecha o menu depois que o usuário clica em um link (melhora no celular).
function fecharMenu() {
  menuPrincipal.classList.remove("menu--aberto");
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu de navegação");
}


/* ---------- 4. MODO CLARO/ESCURO ---------- */

// Alterna a classe "tema-escuro" no <body>. O CSS troca as variáveis de cor.
// BÔNUS: salva a escolha no localStorage para lembrar na próxima visita.
function alternarTema() {
  const modoEscuro = document.body.classList.toggle("tema-escuro");
  localStorage.setItem("tema", modoEscuro ? "escuro" : "claro");
}

// Ao abrir a página, aplica o tema que foi salvo antes (se houver).
function carregarTemaSalvo() {
  if (localStorage.getItem("tema") === "escuro") {
    document.body.classList.add("tema-escuro");
  }
}


/* ---------- 5. VALIDAÇÃO DO FORMULÁRIO ---------- */

// Mostra uma mensagem de erro embaixo de um campo.
// idErro = id do <span class="erro"> daquele campo.
function mostrarErro(campo, idErro, texto) {
  document.getElementById(idErro).textContent = texto;
  campo.closest(".campo").classList.add("campo--invalido");
}

// Apaga todas as mensagens de erro (usada antes de validar de novo).
function limparErros() {
  const spansErro = document.querySelectorAll(".erro");
  spansErro.forEach(function (span) {
    span.textContent = "";
  });

  const camposInvalidos = document.querySelectorAll(".campo--invalido");
  camposInvalidos.forEach(function (campo) {
    campo.classList.remove("campo--invalido");
  });
}

// Confere o formulário inteiro. Retorna true (tudo certo) ou false (tem erro).
function validarFormulario() {
  limparErros();
  let formularioValido = true;

  // trim() tira espaços do começo e do fim ("   " conta como vazio)
  const nome = campoNome.value.trim();
  const email = campoEmail.value.trim();
  const mensagem = campoMensagem.value.trim();

  // 1) Campo vazio: nome
  if (nome === "") {
    mostrarErro(campoNome, "erroNome", "Por favor, digite seu nome.");
    formularioValido = false;
  }

  // 2) E-mail: vazio, ou sem "@" e "."
  if (email === "") {
    mostrarErro(campoEmail, "erroEmail", "Por favor, digite seu e-mail.");
    formularioValido = false;
  } else if (!email.includes("@") || !email.includes(".")) {
    mostrarErro(campoEmail, "erroEmail", "Digite um e-mail válido, com @ e ponto.");
    formularioValido = false;
  }

  // 3) Mensagem: vazia, ou com menos de 20 caracteres
  //    Na defesa, o professor pode pedir para mudar o número 20!
  if (mensagem === "") {
    mostrarErro(campoMensagem, "erroMensagem", "Por favor, escreva uma mensagem.");
    formularioValido = false;
  } else if (mensagem.length < 20) {
    mostrarErro(
      campoMensagem,
      "erroMensagem",
      "A mensagem precisa ter no mínimo 20 caracteres (agora tem " + mensagem.length + ")."
    );
    formularioValido = false;
  }

  // 4) Consentimento precisa estar marcado
  if (!campoConsentimento.checked) {
    mostrarErro(campoConsentimento, "erroConsentimento", "Você precisa concordar para enviar.");
    formularioValido = false;
  }

  return formularioValido;
}

// Roda quando o usuário clica em "Enviar mensagem".
function tratarEnvioFormulario(evento) {
  // Impede o comportamento padrão (recarregar a página). Não enviamos de verdade.
  evento.preventDefault();
  mensagemSucesso.textContent = "";

  if (validarFormulario()) {
    mensagemSucesso.textContent = "Mensagem enviada com sucesso! Obrigado pelo contato.";
    formContato.reset();   // limpa todos os campos
  }
}


/* ---------- 6. ANO AUTOMÁTICO ---------- */

// Escreve o ano atual no rodapé.
function inserirAno() {
  document.getElementById("ano").textContent = new Date().getFullYear();
}


/* ---------- 7. BOTÃO "VOLTAR AO TOPO" (BÔNUS) ---------- */

// Mostra o botão só depois de rolar 300px; esconde quando volta ao início.
function controlarBotaoTopo() {
  if (window.scrollY > 300) {
    botaoTopo.classList.add("botao-topo--visivel");
  } else {
    botaoTopo.classList.remove("botao-topo--visivel");
  }
}


/* ---------- 8. INICIALIZAÇÃO ----------
   Aqui "ligamos" cada função ao evento certo.
   Como o script usa defer, o HTML já está pronto quando chega aqui. */
carregarTemaSalvo();
mostrarSaudacao();
inserirAno();

botaoMenu.addEventListener("click", alternarMenu);
botaoTema.addEventListener("click", alternarTema);
formContato.addEventListener("submit", tratarEnvioFormulario);
window.addEventListener("scroll", controlarBotaoTopo);

// Fecha o menu ao clicar em qualquer link dele
menuPrincipal.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", fecharMenu);
});