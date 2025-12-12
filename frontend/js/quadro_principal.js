// seletores globais
const popup = document.getElementById("popupDetalhes");
const popupNovoQuadro = document.getElementById("popupNovoQuadro");
const popupBox = document.querySelector("#popupDetalhes .popup-box");
const form = document.querySelector("#popupDetalhes .popup-form");

const footerEditar = document.getElementById("footer-editar");
const footerCriar = document.getElementById("footer-criar");
const footerDesistencia = document.getElementById("footer-desistencia");

const containerDados = document.getElementById("container-dados");
const containerDesistencia = document.getElementById("container-desistencia");
const inputOutro = document.getElementById("input-outro");
const btnAgendar = document.getElementById("btn-agendar");
const inputAgendamento = document.getElementById("input-agendamento");

const inputNome = document.getElementById("input-nome");
const inputCPF = document.getElementById("input-cpf");
const inputEmail = document.getElementById("input-email");
const inputTelefone = document.getElementById("input-telefone");
const inputAnotacoes = document.getElementById("input-cpf");

// funções
function resetaVisualizacao() {
    popupBox.classList.remove("popup-compacto");
    containerDados.classList.remove("hidden");
    containerDesistencia.classList.add("hidden");
    inputOutro.classList.add("input-hidden");
    inputOutro.classList.remove("input-visible");
}

function abrirCriarCard(coluna) {
    form.reset();
    resetaVisualizacao();
    // esconde tudo de edição
    footerEditar.classList.add("hidden");
    footerDesistencia.classList.add("hidden");
    // mostra só o criar
    footerCriar.classList.remove("hidden");
    popup.classList.add("aberto");
    popup.dataset.coluna = coluna;
}

function abrirEditar(temAgendamento) {
    resetaVisualizacao();
    footerCriar.classList.add("hidden");
    footerDesistencia.classList.add("hidden");
    footerEditar.classList.remove("hidden");

    if (temAgendamento) {
        btnAgendar.classList.remove("hidden-element");
    } else {
        btnAgendar.classList.add("hidden-element");
    }
    popup.classList.add("aberto");
}

async function criarCard() {
    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const telefone = inputTelefone.value.trim();
    const cpf = inputCPF.value.trim();
    const anotacoes = inputAnotacoes.value.trim();

    if (!nome || !email || !cpf) {
        console.log("Por favor, preencha nome, email e cpf");
        return false;
    }

    if (!quadroEl.dataset.idQuadro) {
        console.log("Erro: Quadro não carregado. Recarregue a página.");
        return false;
    }

    try {
        const token = localStorage.getItem("kanban_token");

        const dadosCliente = {
            nome_cliente: nome,
            email_cliente: email,
            telefone: telefone,
            cpf_cliente: cpf,
            anotacoes: anotacoes || undefined,
            colunaAtual: popup.dataset.coluna,
            idQuadro: quadroEl.dataset.idQuadro,
            estaArquivado: false,
            id_usuario: localStorage.getItem("user_id"),
        };

        const clienteResponse = await fetch(`${API_URL}/clientes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dadosCliente),
        });

        if (!clienteResponse.ok) {
            const dados = await clienteResponse.json();
            console.log("Erro ao criar card: ", dados);
            return false;
        }

        const novoCliente = await clienteResponse.json();

        const usuarioResponse = await fetch(
            `${API_URL}/usuarios/${novoCliente.id_usuario}/`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!usuarioResponse.ok) {
            const dados = await usuarioResponse.json();
            throw new Error(
                `Erro HTTP ao fazer fetch de usuario! status: ${dados}`
            );
        }

        const usuario = await usuarioResponse.json();

        const cardEl = criarCardEl(novoCliente, usuario);
        const listaCards = document.getElementById(
            "lista-" + popup.dataset.coluna
        );

        adicionarCard(cardEl, listaCards);
        configurarDragDropCard(cardEl);

        fecharPopup();
        return true;
    } catch (error) {
        console.error("Erro:", error);
        return false;
    }
}

function fecharPopup() {
    popup.classList.remove("aberto");
}

function mostrarDesistencia() {
    containerDados.classList.add("hidden");
    containerDesistencia.classList.remove("hidden");
    footerEditar.classList.add("hidden");
    footerCriar.classList.add("hidden");
    footerDesistencia.classList.remove("hidden");
    popupBox.classList.add("popup-compacto");
}

function cancelarDesistencia() {
    resetaVisualizacao();
    footerDesistencia.classList.add("hidden");
    footerEditar.classList.remove("hidden");
}

function confirmarDesistencia() {
    alert("Desistência registrada!");
    fecharPopup();
}

function toggleOutroInput(checkbox) {
    if (checkbox.checked) {
        inputOutro.classList.remove("input-hidden");
        inputOutro.classList.add("input-visible");
        inputOutro.focus();
    } else {
        inputOutro.classList.add("input-hidden");
        inputOutro.classList.remove("input-visible");
    }
}

function abrirCalendario() {
    if (inputAgendamento.showPicker) {
        inputAgendamento.showPicker();
    } else {
        inputAgendamento.focus();
        inputAgendamento.click();
    }
}

function abrirConfirmacao() {
    document.getElementById("popupConfirmacao").classList.add("aberto");
}
function fecharConfirmacao() {
    document.getElementById("popupConfirmacao").classList.remove("aberto");
}
function confirmarExclusao() {
    fecharConfirmacao();
    fecharPopup();
}

// dropdown & Filtro
function toggleDropdown() {
    document.getElementById("meuDropdown").classList.toggle("show");
}
function toggleFilterMenu() {
    const menu = document.getElementById("filterMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}
function filtrarCards(responsavel) {
    const cards = document.querySelectorAll(".card-aluno");
    cards.forEach((card) => {
        const icon = card.querySelector(".card-user-icon");
        if (icon) {
            const donoDoCard = icon.getAttribute("data-tooltip");
            if (responsavel === "todos" || donoDoCard === responsavel) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        }
    });
    document.getElementById("filterMenu").style.display = "none";
}

// fechar ao clicar fora
window.onclick = function (event) {
    if (event.target == popup) fecharPopup();
    if (event.target == popupNovoQuadro) fecharNovoQuadro();
    if (event.target == document.getElementById("popupConfirmacao"))
        fecharConfirmacao();

    if (!event.target.closest(".profile-area")) {
        const menu = document.getElementById("profileMenu");
        if (menu && menu.classList.contains("show"))
            menu.classList.remove("show");
    }
    if (
        !event.target.closest(".btn-filter") &&
        document.getElementById("filterMenu")
    ) {
        document.getElementById("filterMenu").style.display = "none";
    }
};

async function carregarQuadroPrincipal() {
    try {
        const token = localStorage.getItem("kanban_token");

        const quadroResponse = await fetch(`${API_URL}/quadros`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!quadroResponse.ok) {
            const dados = await quadroResponse.json();
            throw new Error(
                `Erro HTTP ao fazer fetch de quadros! status: ${dados}`
            );
        }
        const quadros = await quadroResponse.json();
        const quadroPrincipal = quadros.find((quadro) => {
            const quadroNome = quadro.nome_quadro
                .replaceAll(" ", "")
                .toLowerCase();

            return quadroNome === "quadroprincipal";
        });

        if (quadroPrincipal) {
            await popularQuadroNormal(quadroPrincipal);
        } else {
            await popularQuadroNormal(quadros[0]);
        }
    } catch (error) {
        console.error("Erro ao carregar quadro principal:", error);
    }
}

document.addEventListener("DOMContentLoaded", carregarQuadroPrincipal);
