const API_URL = "http://localhost:3000";
const botaoCadastro = document.querySelector(".cadastro");
const statusElement = document.querySelector(".status");
const botaoLogin = document.querySelector(".continuar");

botaoCadastro.addEventListener("click", () => {
    window.location.href = "tela-cadastro.html";
});

botaoLogin.addEventListener("click", login);

window.onload = function () {
    const token = localStorage.getItem("kanban_token");
    const lembrar = localStorage.getItem("lembrar");

    if (token && lembrar === "true") {
        // Redirecionar para quadro principal se já estiver logado
        window.location.href = "quadro_principal.html";
    }
};

async function login() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const lembrar = document.getElementById("lembrar").checked;

    if (!email || !senha) {
        mostrarStatus("Por favor, preencha email e senha", "red");
        return;
    }

    mostrarStatus("Carregando...");

    try {
        const loginResponse = await fetch(`${API_URL}/usuarios/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
        });

        if (!loginResponse.ok) {
            const dados = await loginResponse.json();
            if (dados.mensagem) {
                mostrarStatus(dados.mensagem, "red");
                console.log({ success: false, error: dados.mensagem });
            } else {
                mostrarStatus("Erro ao fazer login! Tente novamente.", "red");
                console.log({ success: false, error: dados.erro });
            }
            return;
        }

        const loginData = await loginResponse.json();
        localStorage.setItem("kanban_token", loginData.token);
        localStorage.setItem("user_id", loginData.usuario.id);
        if (lembrar) {
            localStorage.setItem("lembrar", "true");
        } else {
            localStorage.removeItem("lembrar");
        }

        mostrarStatus(
            "Login realizado com sucesso! Redirecionando...",
            "green"
        );

        // Redirecionar após 2 segundos
        setTimeout(() => {
            window.location.href = "quadro_principal.html";
        }, 2000);
    } catch (error) {
        console.log({ success: false, error: error.message });
    }
}

function mostrarStatus(message, cor = "black") {
    statusElement.innerText = message;
    statusElement.style.color = cor;
}
