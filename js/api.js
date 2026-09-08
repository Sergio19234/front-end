export async function carregarTarefas() {
  const resposta = await fetch("../dados.json");

  if (!resposta.ok) {
    throw new Error(`Erro HTTP: ${resposta.status}`);
  }

  const dados = await resposta.json();

  if (!dados || !Array.isArray(dados.tarefas)) {
    const erro = new Error("Formato de dados inválido.");
    erro.name = "TypeError";
    throw erro;
  }

  return dados.tarefas;
}
