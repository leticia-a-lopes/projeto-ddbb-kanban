function habilitarEdicao() {
    const inputs = document.querySelectorAll('#form-perfil .input-field');
    inputs.forEach(input => {
        input.disabled = false;
        input.style.borderColor = "var(--azul)";
    });
    inputs[0].focus();
    document.getElementById('btn-editar').classList.add('hidden');
    document.getElementById('btn-salvar').classList.remove('hidden');
}

function salvarEdicao() {
    alert("Dados atualizados com sucesso!");
    // aqui entraria a chamada para o back-end
    
    const inputs = document.querySelectorAll('#form-perfil .input-field');
    inputs.forEach(input => {
        input.disabled = true;
        input.style.borderColor = "";
    });
    document.getElementById('btn-salvar').classList.add('hidden');
    document.getElementById('btn-editar').classList.remove('hidden');
}