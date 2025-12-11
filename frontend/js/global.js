const API_URL = "http://localhost:3000";

function carregarHeader() {
    const headerHTML = `
        <div class="logo-area" onclick="window.location.href='quadro_principal.html'" style="cursor: pointer;">
            DDBB Cursos
        </div>

        <div class="profile-area" onclick="toggleProfileMenu()">
            <div class="profile-icon-svg">
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#E0E0E0" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4ZM12 14C16.4183 14 20 17.5817 20 22H4C4 17.5817 7.58172 14 12 14Z"
                        fill="#757575" />
                </svg>
            </div>

            <div class="profile-dropdown-menu" id="profileMenu">
                <a href="perfil.html">Meu Perfil</a>
                <a href="admin_vendedores.html">Gerenciar Usuários</a>
                <a href="login.html" style="color: #FF6B6B;">Sair</a>
            </div>
        </div>
    `;

    const headerElement = document.querySelector(".app-header");
    if (headerElement) {
        headerElement.innerHTML = headerHTML;
    }
}

// lógica do Dropdown (global)
function toggleProfileMenu() {
    const menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("show");
}

// fecha o menu se clicar fora (global)
window.addEventListener("click", function (event) {
    if (!event.target.closest(".profile-area")) {
        const menu = document.getElementById("profileMenu");
        if (menu && menu.classList.contains("show")) {
            menu.classList.remove("show");
        }
    }
});

// executa assim que a página carregar
document.addEventListener("DOMContentLoaded", carregarHeader);

// Usaremos um atributo data-id-cliente/data-id-usuario, ao invés de id.
// Ref: https://www.reddit.com/r/webdev/comments/1lo3deu/html_identifiers_for_dynamic_data/

// Funções de Criar Card
function criarIconeUsuario(usuario) {
    return `
        <div class="card-user-icon" 
             style="background-color: ${usuario.corIcone};"
             data-tooltip="${usuario.nome_usuario}"
             data-id-usuario="${usuario.id}">
            <svg><use href="#icon-user"></use></svg>
        </div>
    `;
}

function criarCard(cliente, usuario) {
    const card = document.createElement("div");
    card.className = "card-aluno";
    card.dataset.idCliente = cliente.id;
    card.addEventListener("click", () => abrirEditar(false));

    const iconeUsuario = criarIconeUsuario(usuario);

    if (cliente.dataAgendamento != null) {
        card.innerHTML = `
            <div class="card-header">
                <svg class="card-icon"><use href="#icon-3dots"></use></svg>
                <span class="card-nome">${cliente.nome_cliente}</span>
            </div>
            <div class="card-footer-tags">
                <div class="card-tags-container">
                    <div class="card-tag">
                        <svg><use href="#icon-calendar"></use></svg>
                        <span>${cliente.agendamento.diaAgendamento}</span>
                    </div>
                    <div class="card-tag tag-time">
                        <svg><use href="#icon-clock"></use></svg>
                        <span>${cliente.agendamento.horaAgendamento}</span>
                    </div>
                </div>
                ${iconeUsuario}
            </div>
        `;
    } else if (cliente.estaArquivado) {
        card.innerHTML = `
            <div class="card-header">
                <svg class="card-icon" style="color: ${usuario.corIcone};">
                    <use href="#icon-3dots"></use>
                </svg>
                <div class="name-icon-row">
                    <span class="card-nome">${cliente.nome_cliente}</span>
                    ${iconeUsuario}
                </div>
            </div>
            ${
                cliente.motivoDesistencia
                    ? `
                <div class="card-motivo">
                    <small>Motivo: ${cliente.motivoDesistencia}</small>
                </div>
                `
                    : ""
            }
        `;
    } else {
        card.innerHTML = `
            <div class="card-header">
                <svg class="card-icon"><use href="#icon-3dots"></use></svg>
                <div class="name-icon-row">
                    <span class="card-nome">${cliente.nome_cliente}</span>
                    ${iconeUsuario}
                </div>
            </div>
        `;
    }

    return card;
}

function adicionarCard(card, coluna) {
    if (!coluna) {
        console.error(`Coluna não encontrada: ${coluna}`);
        return;
    }
    coluna.appendChild(card);
}

async function carregarQuadroPrincipal() {
    try {
        const quadroResponse = await fetch(`${API_URL}/quadro/`);
        if (!quadroResponse.ok) {
            throw new Error(
                `Erro HTTP ao fazer fetch de quadros! status: ${quadroResponse.status}`
            );
        }
        const quadros = await quadroResponse.json();

        for (const quadro of quadros) {
            if (quadro.nome_quadro == "quadro_principal") {
                configurarDragDropQuadro();
                popularQuadro(quadro);
                break;
            }
        }
    } catch (error) {
        console.error("Erro ao carregar quadro inicial:", error);
    }
}

async function popularQuadro(quadro) {
    try {
        const clienteResponse = await fetch(`${API_URL}/quadro/${quadro.id}`);
        if (!clienteResponse.ok) {
            throw new Error(
                `Erro HTTP ao fazer fetch de clientes no quadro "${quadro}"! status: ${clienteResponse.status}`
            );
        }
        const clientes = await clienteResponse.json();

        for (const cliente of clientes) {
            const usuarioResponse = await fetch(
                `${API_URL}/usuario/${cliente.id_usuario}/`
            );

            if (!usuarioResponse.ok) {
                throw new Error(
                    `Erro HTTP ao fazer fetch de usuarios! status: ${usuarioResponse.status}`
                );
            }

            const usuario = await usuarioResponse.json();

            const card = criarCard(cliente, usuario);
            const coluna = "lista-" + cliente.colunaAtual;

            adicionarCard(card, coluna);
            configurarDragDropCard(card);
        }
    } catch (error) {
        console.error("Erro ao popular quadros:", error);
    }
}

// Ref: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Kanban_board
// Idealmente, utilizariamos o objeto dataTransfer, mas ele não é acessível no dragover: https://issues.chromium.org/issues/40617527

let activeDragCardId = null;

// TODO: Integrar com endpoint de mudança de status
function configurarDragDropCard(card) {
    card.setAttribute("draggable", "true");

    // Armazena ID para uso no drop
    card.addEventListener("dragstart", (event) => {
        if (!card.hasAttribute("data-id-cliente") || !card.dataset.idCliente) {
            console.error(
                "Drag card: card não possui [data-id-cliente] válido:",
                card
            );
            return;
        }
        card.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";

        event.dataTransfer.setData("card-aluno", "");
        activeDragCardId = card.dataset.idCliente;
    });

    // Limpa ID armazenado após a ação de arrastar terminar
    card.addEventListener("dragend", () => {
        activeDragCardId = null;
        card.classList.remove("dragging");
    });
}

// Cria o elemento placeholder de acordo com o tamanho do card
function makeDragPlaceholder(draggedCard) {
    const dragPlaceholder = document.createElement("div");
    dragPlaceholder.classList.add("drag-placeholder");
    dragPlaceholder.style.height = `${draggedCard.offsetHeight}px`;
    return dragPlaceholder;
}

// Decide onde colocar o placeholder
function moveDragPlaceholder(event) {
    // Verifica se estamos lidando com o elemento correto (isso foi definido antes em dragstart)
    if (!event.dataTransfer.types.includes("card-aluno")) {
        return;
    }

    event.preventDefault();

    const draggedCard = document.querySelector(
        `[data-id-cliente="${activeDragCardId}"]`
    );

    if (!draggedCard) {
        console.error(
            `Drag card: Não foi possível encontrar card com ID "${activeDragCardId}"`
        );
        return;
    }

    const column = event.currentTarget;
    const cardList = column.querySelector(".card-list");

    if (!cardList) {
        console.error(
            `Drag card: Não foi possível achar elemento .card-list na coluna "${column}"`
        );
        return;
    }

    const existingDragPlaceholder = column.querySelector(".drag-placeholder");

    // Se o card já está "dentro" da posição do placeholder, não faça nada
    if (existingDragPlaceholder) {
        const dragPlaceholderRect =
            existingDragPlaceholder.getBoundingClientRect();

        if (
            event.clientY >= dragPlaceholderRect.top &&
            event.clientY <= dragPlaceholderRect.bottom
        ) {
            return;
        }
    }

    // Inserção do placeholder:

    // 1. Acha o primeiro card (que não é o próprio draggedCard) que está logo abaixo da posição do mouse e insere o placeholder antes dele
    for (const card of cardList.children) {
        if (card.getBoundingClientRect().bottom >= event.clientY) {
            if (card === existingDragPlaceholder) return;
            existingDragPlaceholder?.remove();
            if (
                card === draggedCard ||
                card.previousElementSibling === draggedCard
            )
                return;
            cardList.insertBefore(
                existingDragPlaceholder ?? makeDragPlaceholder(draggedCard),
                card
            );
            return;
        }
    }
    // 2. Se nenhum card for encontrado abaixo da posição do mouse (dentro da lista de cards atual), insere o placeholder no final da lista
    existingDragPlaceholder?.remove();
    if (cardList.lastElementChild === draggedCard) {
        return;
    }
    cardList.append(
        existingDragPlaceholder ?? makeDragPlaceholder(draggedCard)
    );
}

function configurarDragDropQuadro() {
    columns = document.querySelectorAll(".kanban-column");

    columns.forEach((column) => {
        column.addEventListener("dragover", moveDragPlaceholder);

        // Remove o placeholder quando o card sair da área
        column.addEventListener("dragleave", (event) => {
            if (column.contains(event.relatedTarget)) {
                return;
            }

            const dragPlaceholder = column.querySelector(".drag-placeholder");
            dragPlaceholder?.remove();
        });

        // Insere card na área de drop (inserimos ele acima do placeholder e logo em seguida removemos o placeholder)
        column.addEventListener("drop", (event) => {
            event.preventDefault();

            const draggedCard = document.querySelector(
                `[data-id-cliente="${activeDragCardId}"]`
            );

            const dragPlaceholder = column.querySelector(".drag-placeholder");
            if (!dragPlaceholder) return;
            draggedCard.remove();
            cardList = column.querySelector(".card-list");
            cardList.insertBefore(draggedCard, dragPlaceholder);
            dragPlaceholder.remove();
        });
    });
}

document.addEventListener("DOMContentLoaded", carregarQuadroPrincipal());
