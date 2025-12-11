import express from "express";
import crypto from "crypto";
import { findUserByEmail, saveRecoveryToken } from "../database/CRUDuser.js";
import { enviarEmail } from "../api/email.js";

const router = express.Router();

//Rota: /auth/esqueci-senha
router.post("/esqueci-senha", async (req, res) => {
  try {
    const { email } = req.body;
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    //Gera token (ex: 6 caracteres)
    const token = crypto.randomBytes(3).toString("hex").toUpperCase();

    //Salva no banco
    await saveRecoveryToken(user._id.toString(), token);

    //Manda email
    await enviarEmail(
      email,
      "Recuperação de Senha",
      `Seu código de recuperação é: ${token} (Válido por 30 minutos)`
    );

    res.json({ mensagem: "Email de recuperação enviado." });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ erro: "Erro interno ao recuperar senha." });
  }
});

export default router;
