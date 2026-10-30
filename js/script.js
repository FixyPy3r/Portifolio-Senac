// Declaração de uso de IA: usei o Claude desenvolvido pela Antrhropic para montar a base do portfólio (HTML, CSS e JavaScript), tirar dúvidas, ajustar responsividade e ajustar as cores nos devidos lugares, além disso realizei a revisão do código e fiz os devidos testes e pedi para que fosse adicionado comentários dentro do js para orientação durante a revisão.

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

// Recebe a hora (0 a 23) e devolve "Bom dia", "Boa tarde" ou "Boa noite".
function obterSaudacao(hora) {
  if (hora < 12) {
    return "Bom dia";
  } else if (hora < 18) {
    return "Boa tarde";
  } else {
    return "Boa noite";
  }
}

// Escreve a saudação da hora atual na página.
function mostrarSaudacao() {
  const horaAtual = new Date().getHours();
  document.getElementById("saudacao").textContent = obterSaudacao(horaAtual);
}

// Abre ou fecha o menu no celular e atualiza o aria-expanded.
function alternarMenu() {
  const menuAberto = menuPrincipal.classList.toggle("menu--aberto");

  botaoMenu.setAttribute("aria-expanded", menuAberto);
  botaoMenu.setAttribute(
    "aria-label",
    menuAberto ? "Fechar menu de navegação" : "Abrir menu de navegação"
  );
}

// Fecha o menu depois que um link é clicado.
function fecharMenu() {
  menuPrincipal.classList.remove("menu--aberto");
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu de navegação");
}

// Alterna entre modo claro e escuro e salva a escolha no localStorage.
function alternarTema() {
  const modoEscuro = document.body.classList.toggle("tema-escuro");
  localStorage.setItem("tema", modoEscuro ? "escuro" : "claro");
}

// Aplica o tema salvo anteriormente, se houver.
function carregarTemaSalvo() {
  if (localStorage.getItem("tema") === "escuro") {
    document.body.classList.add("tema-escuro");
  }
}

// Mostra uma mensagem de erro abaixo de um campo.
function mostrarErro(campo, idErro, texto) {
  document.getElementById(idErro).textContent = texto;
  campo.closest(".campo").classList.add("campo--invalido");
}

// Apaga todas as mensagens de erro do formulário.
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

// Valida o formulário inteiro e retorna true (tudo certo) ou false (há erro).
function validarFormulario() {
  limparErros();
  let formularioValido = true;

  const nome = campoNome.value.trim();
  const email = campoEmail.value.trim();
  const mensagem = campoMensagem.value.trim();

  if (nome === "") {
    mostrarErro(campoNome, "erroNome", "Por favor, digite seu nome.");
    formularioValido = false;
  }

  if (email === "") {
    mostrarErro(campoEmail, "erroEmail", "Por favor, digite seu e-mail.");
    formularioValido = false;
  } else if (!email.includes("@") || !email.includes(".")) {
    mostrarErro(campoEmail, "erroEmail", "Digite um e-mail válido, com @ e ponto.");
    formularioValido = false;
  }

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

  if (!campoConsentimento.checked) {
    mostrarErro(campoConsentimento, "erroConsentimento", "Você precisa concordar para enviar.");
    formularioValido = false;
  }

  return formularioValido;
}

// Trata o envio do formulário: valida, mostra o sucesso e limpa os campos.
function tratarEnvioFormulario(evento) {
  evento.preventDefault();
  mensagemSucesso.textContent = "";

  if (validarFormulario()) {
    mensagemSucesso.textContent = "Mensagem enviada com sucesso! Obrigado pelo contato.";
    formContato.reset();
  }
}

// Escreve o ano atual no rodapé.
function inserirAno() {
  document.getElementById("ano").textContent = new Date().getFullYear();
}

// Mostra o botão de voltar ao topo só depois de rolar a página.
function controlarBotaoTopo() {
  if (window.scrollY > 300) {
    botaoTopo.classList.add("botao-topo--visivel");
  } else {
    botaoTopo.classList.remove("botao-topo--visivel");
  }
}

carregarTemaSalvo();
mostrarSaudacao();
inserirAno();

botaoMenu.addEventListener("click", alternarMenu);
botaoTema.addEventListener("click", alternarTema);
formContato.addEventListener("submit", tratarEnvioFormulario);
window.addEventListener("scroll", controlarBotaoTopo);

menuPrincipal.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", fecharMenu);
});
