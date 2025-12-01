// lógica de abas
function switchTab(tabName) {
    // esconde todos
    document.querySelectorAll('.tab-content').forEach(div => div.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // mostra o alvo
    document.getElementById('tab-' + tabName).classList.add('active');

    // atualiza estilo do botão
    const btns = document.querySelectorAll('.tab-btn');
    if (tabName === 'lista') btns[0].classList.add('active');
    else btns[1].classList.add('active');
}

// lógica do avatar colorido
function toggleGrid(userId) {
    // fecha outros grids abertos para n encavalar
    document.querySelectorAll('.avatar-grid-list').forEach(grid => {
        if (grid.id !== 'grid-' + userId) grid.classList.add('hidden');
    });
    document.getElementById('grid-' + userId).classList.toggle('hidden');
}

function mudarCor(userId, novaCor) {
    const btn = document.getElementById('btn-' + userId);
    
    // remove todas as cores anteriores
    btn.classList.remove('bg-azul', 'bg-roxo', 'bg-amarelo', 'bg-verde', 'bg-vermelho', 'bg-laranja', 'bg-turquesa', 'bg-rosa', 'bg-escuro');
    
    // add a nova
    btn.classList.add(novaCor);
    
    // fecha o grid
    document.getElementById('grid-' + userId).classList.add('hidden');
    
    // tem que enviar a nova cor para o Back-end salvar
}

function confirmarExclusao() {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
        alert("Usuário removido.");
        // aqui tem que chamar API de delete
    }
}

// fechar Grids ao clicar fora
window.addEventListener('click', function(event) {
    if (!event.target.closest('.avatar-wrapper')) {
        document.querySelectorAll('.avatar-grid-list').forEach(grid => grid.classList.add('hidden'));
    }
});