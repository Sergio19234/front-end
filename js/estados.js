export function renderizarEstado(estado, dados = null) {
  const regiaoStatus = document.getElementById("status-aplicacao");
  const secaoFiltros = document.getElementById("secao-filtros");
  const secaoQuadro = document.getElementById("secao-quadro");

  if (!regiaoStatus) {
    return;
  }

  regiaoStatus.className = "";

  switch (estado) {

    case "carregando":
      esconder(secaoFiltros);
      esconder(secaoQuadro);

      regiaoStatus.classList.add("estado-carregando");
      regiaoStatus.textContent = "Carregando tarefas...";
      break;

    case "sucesso":
      mostrar(secaoFiltros);
      mostrar(secaoQuadro);

      regiaoStatus.classList.add("estado-sucesso");
      regiaoStatus.textContent = dados;
      break;

    case "vazio":
      esconder(secaoFiltros);
      esconder(secaoQuadro);

      regiaoStatus.classList.add("estado-vazio");
      regiaoStatus.textContent =
        "Não há tarefas cadastradas na fonte de dados.";
      break;

    case "erro":
      esconder(secaoFiltros);
      esconder(secaoQuadro);

      regiaoStatus.classList.add("estado-erro");
      regiaoStatus.textContent = dados;
      break;

    default:
      esconder(secaoFiltros);
      esconder(secaoQuadro);

      regiaoStatus.classList.add("estado-erro");
      regiaoStatus.textContent =
        "Estado desconhecido da aplicação.";
  }
}

function esconder(elemento) {
  if (elemento) {
    elemento.hidden = true;
  }
}

function mostrar(elemento) {
  if (elemento) {
    elemento.hidden = false;
  }
}
