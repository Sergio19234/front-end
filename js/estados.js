import { renderizarTarefas } from "./renderizacao.js";

export function renderizarEstado(estado, dados = []) {
  const status = document.querySelector("#status-aplicacao");

  const quadro = document.querySelector("#titulo-quadro")
    ?.parentElement;

  if (!status) {
    return;
  }

  switch (estado) {
    case "carregando":
      status.textContent = "Carregando tarefas...";
      break;

    case "sucesso":
      status.textContent = `${dados.length} tarefas carregadas.`;
      renderizarTarefas(dados);
      break;

    case "vazio":
      status.textContent = "Não há tarefas cadastradas.";
      renderizarTarefas([]);
      break;

    case "erro":
      status.textContent = dados;
      break;
  }
}
