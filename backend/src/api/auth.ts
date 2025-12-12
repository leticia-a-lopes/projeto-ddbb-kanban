import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { findUserByEmail, saveRecoveryToken, updatePasswordByToken } from "../database/CRUDuser.js";
import { enviarEmail } from "../api/email.js";

const router = express.Router();

//Rota: /auth/esqueci-senha
router.post("/esqueci-senha", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email); 

    if (!user) {

      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }
    // Gera token (ex: 6 caracteres)
    const token = crypto.randomBytes(3).toString("hex").toUpperCase();

    await saveRecoveryToken(user._id.toString(), token);

    // Manda email
    await enviarEmail(
      email,
      "Recuperação de Senha",
      `Seu código de recuperação é: ${token} (Válido por 30 minutos)`
    );

    res.json({ mensagem: "Email de recuperação enviado." });
  } catch (err: any) {
    console.error("Erro no /esqueci-senha:", err); 
    res.status(500).json({ erro: "Erro interno ao recuperar senha." });
  }
});

// Rota: /auth/reset-senha
router.post("/reset-senha", async (req, res) => {
  const { email, token, novaSenha } = req.body;

  if (!email || !token || !novaSenha) {
    return res.status(400).json({ mensagem: "Email, código de recuperação e nova senha são obrigatórios." });
  }

  try {
    const user: any = await findUserByEmail(email);
    const tokenRecebido = token.toUpperCase();
    
    if (user.tokenRecuperacao !== tokenRecebido) { 
      return res.status(401).json({ mensagem: "Código de recuperação inválido." });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);

    await updatePasswordByToken(user._id.toString(), senhaHash); 

    res.json({ mensagem: "Senha redefinida com sucesso! Você já pode logar." });

  } catch (err: any) {
    console.error("Erro ao redefinir senha: " + err.message);
    res.status(500).json({ erro: "Erro interno do servidor ao redefinir senha." });
  }
});

export default router;
