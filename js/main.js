import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";

async function iniciarAplicacao() {
  renderizarEstado("carregando");

  let tarefas;

  try {
    tarefas = await carregarTarefas();

  } catch (erro) {

    if (erro.name === "TypeError") {

      renderizarEstado(
        "erro",
        "Não foi possível carregar as tarefas. Verifique o servidor local e a conexão."
      );

      return;
    }

    if (erro.name === "SyntaxError") {

      renderizarEstado(
        "erro",
        "Não foi possível carregar as tarefas porque o arquivo JSON possui um formato inválido."
      );

      return;
    }

    if (erro.name === "FormatoError") {

      renderizarEstado(
        "erro",
        "Não foi possível carregar as tarefas porque os dados do JSON estão em formato incorreto."
      );

      return;
    }

    if (erro.name === "HttpError") {

      renderizarEstado(
        "erro",
        `Não foi possível carregar as tarefas. O servidor respondeu com ${erro.message}.`
      );

      return;
    }

    renderizarEstado(
      "erro",
      "Ocorreu um erro inesperado ao carregar as tarefas."
    );

    return;
  }

  if (tarefas.length === 0) {
    renderizarEstado("vazio");
    return;
  }

  renderizarEstado("sucesso", tarefas);
}

iniciarAplicacao();
