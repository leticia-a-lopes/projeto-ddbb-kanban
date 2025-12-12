// arquivados.js - Lógica específica da página de Arquivados

// --- SELETORES ---
const popup = document.getElementById("popupDetalhes");
const popupVejaMais = document.getElementById("popupVejaMais");
const popupNovoQuadro = document.getElementById("popupNovoQuadro");
const tituloVejaMais = document.getElementById("titulo-veja-mais");

// --- FUNÇÕES DE POPUP ---
function abrirArquivado() {
    popup.classList.add("aberto");
}

function fecharPopup() {
    popup.classList.remove("aberto");
}

function abrirVejaMais(titulo) {
    tituloVejaMais.innerText = titulo;
    popupVejaMais.classList.add("aberto");
    // TODO: Aqui o Back-end faria o fetch da lista completa
}

function fecharVejaMais() {
    popupVejaMais.classList.remove("aberto");
}

// --- LÓGICA DE FILTRO E PESQUISA ---
function filtrarLista(texto) {
    const termo = texto.toLowerCase();
    document.querySelectorAll(".item-lista-aluno").forEach((item) => {
        const nome = item.querySelector(".nome-lista").innerText.toLowerCase();
        item.style.display = nome.includes(termo) ? "flex" : "none";
    });
}

// --- CONFIRMAÇÃO E EXCLUSÃO ---
function abrirConfirmacao() {
    document.getElementById("popupConfirmacao").classList.add("aberto");
}

function fecharConfirmacao() {
    document.getElementById("popupConfirmacao").classList.remove("aberto");
}

function confirmarExclusao() {
    // TODO: Back-end deleta o registro aqui
    alert("Excluído!");
    fecharConfirmacao();
    fecharPopup();
}

// --- DROPDOWN MENU ---
function toggleDropdown() {
    document.getElementById("meuDropdown").classList.toggle("show");
}

// --- FECHAR AO CLICAR FORA (Overlay) ---
window.onclick = function (event) {
    // Fecha os popups da página
    if (event.target == popup) fecharPopup();
    if (event.target == popupVejaMais) fecharVejaMais();
    if (event.target == popupNovoQuadro) fecharNovoQuadro();
    if (event.target == document.getElementById("popupConfirmacao"))
        fecharConfirmacao();

    // Fecha menu de perfil (Global)
    if (!event.target.closest(".profile-area")) {
        const menu = document.getElementById("profileMenu");
        if (menu && menu.classList.contains("show"))
            menu.classList.remove("show");
    }

    // Fecha dropdown de navegação
    if (
        !event.target.matches(".dropdown-trigger") &&
        !event.target.closest(".dropdown-container")
    ) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
};

async function desistirCliente(id, motivo, colunaAtual) {
    try {
        const token = localStorage.getItem("kanban_token");
        
        const bodyData = {
            motivoDesistencia: motivo,
            colunaAtual: colunaAtual
        };

        const response = await fetch(`${API_URL}/cliente/arquivar/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(bodyData)
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.mensagem || "Erro ao arquivar cliente");
        }

        const dados = await response.json();
        alert("Cliente movido para desistentes/arquivados com sucesso!");
        
        window.location.reload(); 
        
    } catch (error) {
        console.error("Erro ao desistir:", error);
        alert("Erro: " + error.message);
    }
}

//Função para Matricular
async function matricularCliente(id, colunaDeDestino) {
    try {
        const token = localStorage.getItem("kanban_token");
        const bodyData = {
            colunaDeOrigem: colunaDeDestino 
        };

        const response = await fetch(`${API_URL}/cliente/desarquivar/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(bodyData)
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.mensagem || "Erro ao desarquivar cliente");
        }

        const dados = await response.json();
        alert("Cliente matriculado/desarquivado com sucesso!");
        
        // Atualiza a tela
        window.location.reload();

    } catch (error) {
        console.error("Erro ao matricular:", error);
        alert("Erro: " + error.message);
    }
}

async function popularQuadroArquivados() {
    try {
        const token = localStorage.getItem("kanban_token");

        const clienteResponse = await fetch(`${API_URL}/clientes`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!clienteResponse.ok) {
            const dados = await clienteResponse.json();
            throw new Error(
                `Erro HTTP ao fazer fetch de clientes arquivados"! status: ${dados}`
            );
        }
        const clientes = await clienteResponse.json();

        clientesArquivados = clientes.filter(
            (cliente) => cliente.estaArquivado
        );

        for (const cliente of clientesArquivados) {
            const usuarioResponse = await fetch(
                `${API_URL}/usuarios/${cliente.id_usuario}/`
            );

            if (!usuarioResponse.ok) {
                const dados = await usuarioResponse.json();
                throw new Error(
                    `Erro HTTP ao fazer fetch de usuarios! status: ${dados}`
                );
            }

            const usuario = await usuarioResponse.json();

            const card = criarCardEl(cliente, usuario);

            const listaCards = "lista-" + cliente.colunaAtual;

            adicionarCard(card, listaCards);
            configurarDragDropCard(card);
        }
    } catch (error) {
        console.error("Erro ao popular quadros:", error);
    }
}

//Botão para confirmar a DESISTÊNCIA (Arquivar)
async function handleBotaoDesistir() {
    if (!clienteSelecionadoId) return;

    const motivoInput = document.getElementById("input-motivo").value;

    if (!motivoInput) {
        alert("Por favor, informe o motivo da desistência.");
        return;
    }

    await desistirCliente(clienteSelecionadoId, motivoInput, clienteSelecionadoColuna);
    
    fecharPopup();
}

//Botão para confirmar a matícula
async function handleBotaoMatricular() {
    if (!clienteSelecionadoId) return;

    // Define para qual coluna o card vai ao ser matriculado
    const colunaDestino = "Matriculados"; 

    await matricularCliente(clienteSelecionadoId, colunaDestino);
    
    fecharPopup();
}

document.addEventListener("DOMContentLoaded", popularQuadroArquivados);
