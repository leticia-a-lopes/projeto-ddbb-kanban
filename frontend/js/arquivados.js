// arquivados.js - Lógica específica da página de Arquivados

// --- SELETORES ---
const popup = document.getElementById('popupDetalhes');
const popupVejaMais = document.getElementById('popupVejaMais');
const popupNovoQuadro = document.getElementById('popupNovoQuadro');
const tituloVejaMais = document.getElementById('titulo-veja-mais');

// --- FUNÇÕES DE POPUP ---
function abrirArquivado() { 
    popup.classList.add('aberto'); 
}

function fecharPopup() { 
    popup.classList.remove('aberto'); 
}

function abrirVejaMais(titulo) {
    tituloVejaMais.innerText = titulo;
    popupVejaMais.classList.add('aberto');
    // TODO: Aqui o Back-end faria o fetch da lista completa
}

function fecharVejaMais() { 
    popupVejaMais.classList.remove('aberto'); 
}

// --- LÓGICA DE FILTRO E PESQUISA ---
function filtrarLista(texto) {
    const termo = texto.toLowerCase();
    document.querySelectorAll('.item-lista-aluno').forEach(item => {
        const nome = item.querySelector('.nome-lista').innerText.toLowerCase();
        item.style.display = nome.includes(termo) ? 'flex' : 'none';
    });
}

// --- NOVO QUADRO ---
function abrirNovoQuadro() { 
    popupNovoQuadro.classList.add('aberto'); 
}

function fecharNovoQuadro() { 
    popupNovoQuadro.classList.remove('aberto'); 
}

function validarColunas(input) {
    let val = parseInt(input.value);
    if (val > 4) input.value = 4;
    if (val < 1 && input.value !== "") input.value = 1;
}

// --- CONFIRMAÇÃO E EXCLUSÃO ---
function abrirConfirmacao() { 
    document.getElementById('popupConfirmacao').classList.add('aberto'); 
}

function fecharConfirmacao() { 
    document.getElementById('popupConfirmacao').classList.remove('aberto'); 
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
    if (event.target == document.getElementById('popupConfirmacao')) fecharConfirmacao();

    // Fecha menu de perfil (Global)
    if (!event.target.closest('.profile-area')) {
        const menu = document.getElementById("profileMenu");
        if (menu && menu.classList.contains('show')) menu.classList.remove('show');
    }
    
    // Fecha dropdown de navegação
    if (!event.target.matches('.dropdown-trigger') && !event.target.closest('.dropdown-container')) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}