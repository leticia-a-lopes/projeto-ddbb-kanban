import express from "express";
import crypto from "crypto";
//Necessário a implementação dessas duas funções para ajudar na recuperação de senhas
import { findUserByEmail, saveRecoveryToken } from "../database/CRUDuser.js";
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

    //Gera token (ex: 6 caracteres)
    const token = crypto.randomBytes(3).toString("hex").toUpperCase();

    //Calcula a data de expiração (30 minutos a partir de agora)
    const expiraEm = new Date();
    expiraEm.setMinutes(expiraEm.getMinutes() + 30);

    //Salva no banco
    const tokenData = { token, expiraEm };
    await saveRecoveryToken(user._id.toString(), tokenData);

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
