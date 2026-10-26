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



function obterSaudacao(hora) {
  if (hora < 12) {
    return "Bom dia";        
  } else if (hora < 18) {
    return "Boa tarde";      
  } else {
    return "Boa noite";   
  }
}


function mostrarSaudacao() {
  const horaAtual = new Date().getHours();
  document.getElementById("saudacao").textContent = obterSaudacao(horaAtual);
}



function alternarMenu() {

  const menuAberto = menuPrincipal.classList.toggle("menu--aberto");

  botaoMenu.setAttribute("aria-expanded", menuAberto);
  botaoMenu.setAttribute(
    "aria-label",
    menuAberto ? "Fechar menu de navegação" : "Abrir menu de navegação"
  );
}


function fecharMenu() {
  menuPrincipal.classList.remove("menu--aberto");
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu de navegação");
}



function alternarTema() {
  const modoEscuro = document.body.classList.toggle("tema-escuro");
  localStorage.setItem("tema", modoEscuro ? "escuro" : "claro");
}


function carregarTemaSalvo() {
  if (localStorage.getItem("tema") === "escuro") {
    document.body.classList.add("tema-escuro");
  }
}



function mostrarErro(campo, idErro, texto) {
  document.getElementById(idErro).textContent = texto;
  campo.closest(".campo").classList.add("campo--invalido");
}


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


function tratarEnvioFormulario(evento) {
 
  evento.preventDefault();
  mensagemSucesso.textContent = "";

  if (validarFormulario()) {
    mensagemSucesso.textContent = "Mensagem enviada com sucesso! Obrigado pelo contato.";
    formContato.reset();  
  }
}



function inserirAno() {
  document.getElementById("ano").textContent = new Date().getFullYear();
}



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
