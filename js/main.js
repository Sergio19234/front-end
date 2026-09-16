import { carregarTarefas } from "./api.js";
import { renderizarTarefas } from "./renderizacao.js";
import { renderizarEstado } from "./estados.js";


/* =========================================
   ESTADO ÚNICO DA APLICAÇÃO
   ========================================= */

const estado = {
  tarefas: [],
  busca: "",
  status: "todos",
  prioridade: "todas",
  ordenacao: "nenhuma",
  carregamento: "carregando",
  erro: null
};


/* =========================================
   VALORES INICIAIS
   ========================================= */

const estadoInicialFiltros = {
  busca: "",
  status: "todos",
  prioridade: "todas",
  ordenacao: "nenhuma"
};


/* =========================================
   ELEMENTOS DA INTERFACE
   ========================================= */

const campoBusca = document.getElementById("campo-busca");
const campoOrdenacao = document.getElementById("campo-ordenacao");

const botaoLimpar = document.getElementById("botao-limpar");

const formFiltros = document.getElementById("form-filtros");


/* =========================================
   DERIVAÇÃO DA LISTA VISÍVEL
   ========================================= */

function derivarTarefasVisiveis(estadoAtual) {

  let tarefasVisiveis = estadoAtual.tarefas.filter(tarefa => {

    const titulo = tarefa.titulo.toLocaleLowerCase();
    const busca = estadoAtual.busca.toLocaleLowerCase().trim();

    const correspondeBusca =
      titulo.includes(busca);

    const correspondeStatus =
      estadoAtual.status === "todos" ||
      tarefa.status === estadoAtual.status;

    const correspondePrioridade =
      estadoAtual.prioridade === "todas" ||
      tarefa.prioridade === estadoAtual.prioridade;

    return (
      correspondeBusca &&
      correspondeStatus &&
      correspondePrioridade
    );
  });


  /* Ordenação em uma cópia */

  if (estadoAtual.ordenacao === "prazo-crescente") {

    tarefasVisiveis = [...tarefasVisiveis].sort(
      (a, b) => a.prazo.localeCompare(b.prazo)
    );

  } else if (estadoAtual.ordenacao === "prazo-decrescente") {

    tarefasVisiveis = [...tarefasVisiveis].sort(
      (a, b) => b.prazo.localeCompare(a.prazo)
    );
  }


  return tarefasVisiveis;
}


/* =========================================
   CICLO ÚNICO DE RENDERIZAÇÃO
   ========================================= */

function renderizarAplicacao() {

  if (estado.carregamento === "carregando") {
    renderizarEstado("carregando");
    return;
  }

  if (estado.carregamento === "erro") {
    renderizarEstado("erro", estado.erro);
    return;
  }


  /* A lista visível é derivada UMA vez */

  const tarefasVisiveis =
    derivarTarefasVisiveis(estado);


  /* Fonte original vazia */

  if (estado.tarefas.length === 0) {
    renderizarEstado("vazio");
    return;
  }


  /* Resultado vazio */

  if (tarefasVisiveis.length === 0) {

    renderizarTarefas([]);

    renderizarEstado(
      "sucesso",
      `0 de ${estado.tarefas.length} tarefas. Nenhuma tarefa corresponde aos critérios atuais.`
    );

    return;
  }


  /* Resultado encontrado */

  renderizarTarefas(tarefasVisiveis);

  renderizarEstado(
    "sucesso",
    `${tarefasVisiveis.length} de ${estado.tarefas.length} tarefas.`
  );

  sincronizarControles();
}


/* =========================================
   SINCRONIZAÇÃO DOS CONTROLES
   ========================================= */

function sincronizarControles() {

  if (campoBusca.value !== estado.busca) {
    campoBusca.value = estado.busca;
  }

  if (campoOrdenacao.value !== estado.ordenacao) {
    campoOrdenacao.value = estado.ordenacao;
  }


  const radioStatus =
    document.querySelector(
      `input[name="status"][value="${estado.status}"]`
    );

  if (radioStatus) {
    radioStatus.checked = true;
  }


  const radioPrioridade =
    document.querySelector(
      `input[name="prioridade"][value="${estado.prioridade}"]`
    );

  if (radioPrioridade) {
    radioPrioridade.checked = true;
  }
}


/* =========================================
   EVENTO DA BUSCA
   ========================================= */

campoBusca.addEventListener("input", evento => {

  estado.busca = evento.target.value;

  renderizarAplicacao();
});


/* =========================================
   EVENTO DOS FILTROS
   ========================================= */

document
  .querySelectorAll('input[name="status"]')
  .forEach(radio => {

    radio.addEventListener("change", evento => {

      estado.status = evento.target.value;

      renderizarAplicacao();
    });
  });


document
  .querySelectorAll('input[name="prioridade"]')
  .forEach(radio => {

    radio.addEventListener("change", evento => {

      estado.prioridade = evento.target.value;

      renderizarAplicacao();
    });
  });


/* =========================================
   EVENTO DA ORDENAÇÃO
   ========================================= */

campoOrdenacao.addEventListener("change", evento => {

  estado.ordenacao = evento.target.value;

  renderizarAplicacao();
});


/* =========================================
   BOTÃO APLICAR FILTROS
   ========================================= */

formFiltros.addEventListener("submit", evento => {

  evento.preventDefault();

  renderizarAplicacao();
});


/* =========================================
   BOTÃO LIMPAR FILTROS
   ========================================= */

botaoLimpar.addEventListener("click", () => {

  estado.busca = estadoInicialFiltros.busca;
  estado.status = estadoInicialFiltros.status;
  estado.prioridade = estadoInicialFiltros.prioridade;
  estado.ordenacao = estadoInicialFiltros.ordenacao;

  sincronizarControles();

  renderizarAplicacao();
});


/* =========================================
   INICIALIZAÇÃO
   ========================================= */

async function iniciarAplicacao() {

  estado.carregamento = "carregando";
  estado.erro = null;

  renderizarAplicacao();


  try {

    const tarefas = await carregarTarefas();

    estado.tarefas = tarefas;
    estado.carregamento = "sucesso";
    estado.erro = null;

  } catch (erro) {

    estado.carregamento = "erro";


    if (erro.name === "TypeError") {

      estado.erro =
        "Não foi possível carregar as tarefas. Verifique o servidor local ou a conexão.";

    } else if (erro.name === "SyntaxError") {

      estado.erro =
        "O arquivo JSON possui um formato inválido.";

    } else if (erro.name === "FormatoError") {

      estado.erro =
        "Os dados do JSON estão em um formato incorreto.";

    } else if (erro.name === "HttpError") {

      estado.erro =
        `Não foi possível carregar as tarefas. ${erro.message}.`;

    } else {

      estado.erro =
        "Ocorreu um erro inesperado ao carregar as tarefas.";
    }
  }


  renderizarAplicacao();
}


/* =========================================
   TESTE DO ESTADO NO CONSOLE
   ========================================= */

window.estado = estado;


/* Inicia */

iniciarAplicacao();
