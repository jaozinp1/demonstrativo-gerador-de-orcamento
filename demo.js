"use strict";

(() => {
  const LIMITE_SERVICOS = 3;
  const TEXTO_MARCA = "DEMONSTRAÇÃO";

  const lista = document.getElementById("listaServicos");
  const marcaDagua = document.querySelector(".marca-dagua");
  const campoNovoServico = document.getElementById("novoServico");
  const campoNovoValor = document.getElementById("novoValor");
  const botaoAdicionar = document.getElementById("adicionarServico");
  const statusVoz = document.getElementById("statusVoz");

  if (marcaDagua) {
    const bloco = document.createElement("div");
    bloco.className = "marca-dagua-texto";

    for (let i = 0; i < 14; i++) {
      const linha = document.createElement("div");
      linha.textContent = Array(6).fill(TEXTO_MARCA).join("   •   ");
      bloco.appendChild(linha);
    }

    marcaDagua.appendChild(bloco);
  }

  [campoNovoServico, campoNovoValor, botaoAdicionar].forEach(elemento => {
    if (!elemento) return;
    elemento.disabled = true;
    elemento.classList.add("bloqueado-demo");
  });

  if (campoNovoServico) {
    campoNovoServico.placeholder =
      "Serviços personalizados: disponível na versão completa";
  }

  const aviso = document.createElement("div");
  aviso.className = "aviso-demo";
  aviso.setAttribute("role", "status");
  aviso.hidden = true;
  document.body.appendChild(aviso);

  let temporizadorAviso = null;

  function mostrarAviso(mensagem) {
    aviso.textContent = mensagem;
    aviso.hidden = false;

    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => {
      aviso.hidden = true;
    }, 5000);
  }

  function contarSelecionados() {
    let total = 0;

    lista.querySelectorAll(".servico").forEach(linha => {
      const principal = linha.querySelector(":scope > .checkbox-servico");
      const temOpcoes = linha.querySelector(
        ":scope > .opcoes-polimento-motor"
      );

      if (temOpcoes) {
        total += linha.querySelectorAll(
          ".checkbox-opcao-servico:checked"
        ).length;
      } else if (principal && principal.checked) {
        total++;
      }
    });

    return total;
  }

  lista.addEventListener(
    "change",
    evento => {
      const alvo = evento.target;

      if (
        !(alvo instanceof HTMLInputElement) ||
        alvo.type !== "checkbox" ||
        !alvo.checked
      ) {
        return;
      }

      if (contarSelecionados() <= LIMITE_SERVICOS) {
        return;
      }

      alvo.checked = false;
      evento.stopImmediatePropagation();

      const mensagem =
        `A demonstração permite até ${LIMITE_SERVICOS} serviços por ` +
        "orçamento. Na versão completa, não há limite.";

      mostrarAviso(mensagem);

      if (statusVoz) {
        setTimeout(() => {
          statusVoz.textContent = mensagem;
        }, 0);
      }
    },
    true
  );
})();