// seletores globais
const popup = document.getElementById('popupDetalhes');
const popupNovoQuadro = document.getElementById('popupNovoQuadro');
const popupBox = document.querySelector('#popupDetalhes .popup-box');
const form = document.querySelector('#popupDetalhes .popup-form');

const footerEditar = document.getElementById('footer-editar');
const footerCriar = document.getElementById('footer-criar');
const footerDesistencia = document.getElementById('footer-desistencia');

const containerDados = document.getElementById('container-dados');
const containerDesistencia = document.getElementById('container-desistencia');
const inputOutro = document.getElementById('input-outro');
const btnAgendar = document.getElementById('btn-agendar');
const inputAgendamento = document.getElementById('input-agendamento');

// funções
function resetaVisualizacao() {
    popupBox.classList.remove('popup-compacto');
    containerDados.classList.remove('hidden');
    containerDesistencia.classList.add('hidden');
    inputOutro.classList.add('input-hidden');
    inputOutro.classList.remove('input-visible');
}

function abrirCriar() {
    form.reset();
    resetaVisualizacao();
    // esconde tudo de edição
    footerEditar.classList.add('hidden');
    footerDesistencia.classList.add('hidden');
    // mostra só o criar
    footerCriar.classList.remove('hidden');
    popup.classList.add('aberto');
}

function abrirEditar(temAgendamento) {
    resetaVisualizacao();
    footerCriar.classList.add('hidden');
    footerDesistencia.classList.add('hidden');
    footerEditar.classList.remove('hidden');

    if (temAgendamento) {
        btnAgendar.classList.remove('hidden-element');
    } else {
        btnAgendar.classList.add('hidden-element');
    }
    popup.classList.add('aberto');
}

function fecharPopup() { popup.classList.remove('aberto'); }

function mostrarDesistencia() {
    containerDados.classList.add('hidden');
    containerDesistencia.classList.remove('hidden');
    footerEditar.classList.add('hidden');
    footerCriar.classList.add('hidden');
    footerDesistencia.classList.remove('hidden');
    popupBox.classList.add('popup-compacto');
}

function cancelarDesistencia() {
    resetaVisualizacao();
    footerDesistencia.classList.add('hidden');
    footerEditar.classList.remove('hidden');
}

function confirmarDesistencia() { alert("Desistência registrada!"); fecharPopup(); }

function toggleOutroInput(checkbox) {
    if (checkbox.checked) {
        inputOutro.classList.remove('input-hidden');
        inputOutro.classList.add('input-visible');
        inputOutro.focus();
    } else {
        inputOutro.classList.add('input-hidden');
        inputOutro.classList.remove('input-visible');
    }
}

function abrirNovoQuadro() { popupNovoQuadro.classList.add('aberto'); }
function fecharNovoQuadro() { popupNovoQuadro.classList.remove('aberto'); }
function validarColunas(input) {
    let val = parseInt(input.value);
    if (val > 4) input.value = 4;
    if (val < 1 && input.value !== "") input.value = 1;
}

function abrirCalendario() {
    if (inputAgendamento.showPicker) { inputAgendamento.showPicker(); }
    else { inputAgendamento.focus(); inputAgendamento.click(); }
}

function abrirConfirmacao() { document.getElementById('popupConfirmacao').classList.add('aberto'); }
function fecharConfirmacao() { document.getElementById('popupConfirmacao').classList.remove('aberto'); }
function confirmarExclusao() { fecharConfirmacao(); fecharPopup(); }

// dropdown & Filtro
function toggleDropdown() { document.getElementById("meuDropdown").classList.toggle("show"); }
function toggleFilterMenu() {
    const menu = document.getElementById("filterMenu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}
function filtrarCards(responsavel) {
    const cards = document.querySelectorAll('.card-aluno');
    cards.forEach(card => {
        const icon = card.querySelector('.card-user-icon');
        if (icon) {
            const donoDoCard = icon.getAttribute('data-tooltip');
            if (responsavel === 'todos' || donoDoCard === responsavel) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
    document.getElementById("filterMenu").style.display = "none";
}

// fechar ao clicar fora
window.onclick = function (event) {
    if (event.target == popup) fecharPopup();
    if (event.target == popupNovoQuadro) fecharNovoQuadro();
    if (event.target == document.getElementById('popupConfirmacao')) fecharConfirmacao();

    if (!event.target.closest('.profile-area')) {
        const menu = document.getElementById("profileMenu");
        if (menu && menu.classList.contains('show')) menu.classList.remove('show');
    }
    if (!event.target.closest('.btn-filter') && document.getElementById("filterMenu")) {
        document.getElementById("filterMenu").style.display = "none";
    }
}