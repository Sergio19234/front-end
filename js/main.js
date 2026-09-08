import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";

async function iniciarAplicacao() {
  renderizarEstado("carregando");

  try {
    const tarefas = await carregarTarefas();

    if (tarefas.length === 0) {
      renderizarEstado("vazio");
      return;
    }

    renderizarEstado("sucesso", tarefas);

  } catch (erro) {
    if (erro.name === "TypeError") {
      renderizarEstado(
        "erro",
        "Não foi possível conectar ao servidor. Verifique sua conexão."
      );

    } else if (erro.name === "SyntaxError") {
      renderizarEstado(
        "erro",
        "Não foi possível carregar as tarefas porque o arquivo de dados está com formato inválido."
      );

    } else {
      renderizarEstado(
        "erro",
        "Não foi possível carregar as tarefas. Tente novamente mais tarde."
      );
    }
  }
}

iniciarAplicacao();
