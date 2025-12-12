const API_URL = "http://localhost:3000";
const botaoLogin = document.querySelector(".login");
const statusElement = document.querySelector(".status");
const botaoCadastrar = document.querySelector(".continuar");

botaoLogin.addEventListener("click", () => {
    window.location.href = "tela-login.html";
});

botaoCadastrar.addEventListener("click", cadastrar);

async function cadastrar() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    if (!nome || !email || !senha || !confirmarSenha) {
        mostrarStatus("Por favor, preencha todos os campos", "red");
        return;
    }

    if (senha !== confirmarSenha) {
        mostrarStatus("As senhas não coincidem", "red");
        return;
    }

    if (senha.length < 6) {
        mostrarStatus("A senha deve ter pelo menos 6 caracteres", "red");
        return;
    }

    mostrarStatus("Criando conta...", "blue");

    const dadosCadastro = {
        nome_usuario: nome,
        email_usuario: email,
        senha: senha,
        isAdmin: true,
    };

    try {
        const cadastrarResponse = await fetch(`${API_URL}/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosCadastro),
        });

        if (!cadastrarResponse.ok) {
            const dados = await cadastrarResponse.json();
            if (dados.mensagem) {
                mostrarStatus(dados.mensagem, "red");
                console.log({ success: false, error: dados.mensagem });
            } else {
                mostrarStatus("Erro ao fazer login! Tente novamente.", "red");
                console.log({ success: false, error: dados.erro });
            }
            return;
        }

        mostrarStatus(
            "Usuário admin cadastrado! Redirecionando para página de login...",
            "green"
        );

        // Limpar token de login
        localStorage.setItem("kanban_token", "");

        // Redirecionar após 2 segundos
        setTimeout(() => {
            window.location.href = "tela-login.html";
        }, 2000);
    } catch (error) {
        console.log("Erro ao fazer cadastro de usuário admin: ", error.message);
    }
}

function mostrarStatus(message, cor = "black") {
    statusElement.innerText = message;
    statusElement.style.color = cor;
}
