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

function adicionarCard(
    colunaId,
    nomeCliente,
    idCliente,
    nomeUsuario,
    idUsuario,
    corIconeUsuario,
    data = null,
    hora = null
) {
    // Não use HTML id=idCliente ou idUsuario, visto que podem ter o mesmo valor (id pode ser 1 na tabela de cliente e usuario e id no html deve ser único).
    // Podemos usar id="cliente-${id}", mas isso dificulta retornar o id para o backend, seria necessário fazer strip da da parte numerica toda vez.
    // Portanto, usaremos um atributo data-id-cliente/data-id-usuario, desse modo pegamos o melhor dos dois mundos.
    // Ref: https://www.reddit.com/r/webdev/comments/1lo3deu/html_identifiers_for_dynamic_data/

    const coluna = document.getElementById(colunaId);

    const userIconHTML = `
        <div class="card-user-icon bg-azul" data-tooltip="${nomeUsuario}" data-id-usuario="${idUsuario}">
            <svg><use href="#icon-user"></use></svg>
        </div>
    `;

    let html = "";

    if (!data) {
        // TIPO 1: em contato
        html = `
            <div class="card-aluno" data-id-cliente="${idCliente}" onclick="abrirEditar(false)">
                <div class="card-header">
                    <svg class="card-icon"><use href="#icon-3dots"></use></svg>
                    <div class="name-icon-row">
                        <span class="card-nome" style="margin: 0;">${nomeCliente}</span>
                        ${userIconHTML}
                    </div>
                </div>
            </div>
        `;
    } else {
        // TIPO 2: agendado
        html = `
            <div class="card-aluno" data-id-cliente="${idCliente}" onclick="abrirEditar(true)">
                <div class="card-header">
                    <svg class="card-icon"><use href="#icon-3dots"></use></svg>
                    <span class="card-nome">${nomeCliente}</span>
                </div>
                <div class="card-footer-tags">
                    <div class="card-tags-container">
                        <div class="card-tag">
                            <svg><use href="#icon-calendar"></use></svg><span>${data}</span>
                        </div>
                        <div class="card-tag tag-time">
                            <svg><use href="#icon-clock"></use></svg><span>${hora}</span>
                        </div>
                    </div>
                    ${userIconHTML}
                </div>
            </div>
        `;
    }

    coluna.innerHTML += html;
}

async function popularQuadros() {
    try {
        const response = await fetch("http://localhost:3000/cards");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Provisório, necessário criação de novos campos na api e bd (caso for implementar histórico para etapa em arquivados).
        // TODO: substituir "lista-contato" por cliente.status, "Clara Maria" por usuario.nome e "red" por usuario.color
        for (const cliente of data) {
            adicionarCard(
                "lista-contato",
                cliente.nome,
                cliente.id,
                "Clara Maria",
                Math.floor(Math.random() * 100),
                "red"
            );
        }
        adicionarDragDrop();
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Ref: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Kanban_board
// Idealmente, utilizariamos o objeto dataTransfer, mas ele não é acessível no dragover: https://issues.chromium.org/issues/40617527

let activeDragCardId = null;

// TODO: Integrar com endpoint de mudança de status
function adicionarDragDrop() {
    cards = document.querySelectorAll(".card-aluno[data-id-cliente]");
    columns = document.querySelectorAll(".kanban-column");

    cards.forEach((card) => {
        card.setAttribute("draggable", "true");

        // Armazena ID para uso no drop
        card.addEventListener("dragstart", (event) => {
            if (
                !card.hasAttribute("data-id-cliente") ||
                !card.dataset.idCliente
            ) {
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
    });

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
            column.children[1].insertBefore(draggedCard, dragPlaceholder);
            cardList = column.querySelector(".card-list");
            cardList.insertBefore(draggedCard, dragPlaceholder);
            dragPlaceholder.remove();
        });
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

// correção: removido o parenteses para não executar a função imediatamente apenas passar a referência
document.addEventListener("DOMContentLoaded", popularQuadros);
