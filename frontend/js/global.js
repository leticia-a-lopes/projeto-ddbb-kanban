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

// Ref: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Kanban_board, https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData e https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/getData
function adicionarDragDrop() {
    cards = document.querySelectorAll(".card-aluno");
    cardsLists = document.querySelectorAll(".kanban-column");

    // Draggable para todos cards
    cards.forEach((card) => {
        card.setAttribute("draggable", "true");

        card.addEventListener("dragstart", (event) => {
            // Pemitir ação de apenas de mover o item
            event.dataTransfer.effectAllowed = "move";

            // Armazena o id do cliente no event no formato "text/plain"
            event.dataTransfer.setData("text/plain", card.dataset.idCliente);
        });
    });

    cardsLists.forEach((list) => {
        list.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        list.addEventListener("drop", (event) => {
            event.preventDefault();

            // Recupera os dados que estavam no evento (data-id-cliente)
            const cardIdCliente = event.dataTransfer.getData("text/plain");
            const cardElement = document.querySelector(
                `[data-id-cliente="${cardIdCliente}"]`
            );

            list.appendChild(cardElement);
        });
    });
}

document.addEventListener("DOMContentLoaded", popularQuadros());
