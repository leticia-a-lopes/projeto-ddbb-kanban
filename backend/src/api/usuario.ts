import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs"; // Importante para criptografia
import jwt from "jsonwebtoken";
import {
  insertUser,
  insertAdmin,
  readAllUsers,
  readUser,
  updateUser,
  deleteUser,
  findUserByEmail,
} from "../database/CRUDuser.js";
import { enviarEmail } from "../api/email.js";
import {
  verificarToken,
  verificarAdmin,
  AuthRequest,
} from "../middleware/auth.js";

// Usar o router para modularizar melhor as diferentes rotas
const router = express.Router();

//Login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    //Necessária a implementação dessa função no CRUDops
    const user: any = await findUserByEmail(email);
    if (!user)
      return res.status(404).json({ mensagem: "Usuário ou senha incorretos" });

    //Compara a senha enviada com a senha criptografada no banco (bcrypt)
    //Como o campo senha está como select: false no schema, ainda precisa garantir que o findUserByEmail traga a senha, ou usar .select('+senha') no mongoose, acho que é isso
    const senhaBate = await bcrypt.compare(senha, user.senha);
    if (!senhaBate)
      return res.status(401).json({ mensagem: "Usuário ou senha incorretos" });

    //Gera o Token
    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, nome: user.nome_usuario },
      secret,
      { expiresIn: "8h" } // Token expira em 8 horas
    );

    res.json({
      mensagem: "Login realizado!",
      token,
      usuario: { nome: user.nome_usuario, isAdmin: user.isAdmin },
    });
  } catch (error) {
    res.status(500).json({ erro: error });
    console.log(error);
  }
});

router.post("/primeiro-admin", async (req, res) => {
  const { nome_usuario, email_usuario, telefone } = req.body;
  
  try {
    const senhaAleatoria = crypto.randomBytes(8).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senhaAleatoria, salt);

    const novoUsuarioDados = {
      nome_usuario,
      email_usuario,
      senha: senhaHash, // <-- AGORA ESTA SENHA SERÁ USADA
      telefone,
      // corlcone, // Adicione aqui se for obrigatório no Schema
      isAdmin: true, 
    };

    // CORREÇÃO: Passa o objeto de dados gerado, não o 'req'
    const usuarioCriado = await insertAdmin(novoUsuarioDados);

    await enviarEmail(
      email_usuario,
      "Bem-vindo ao Kanban - Acesso Inicial",
      `Sua senha provisória para o primeiro acesso é: ${senhaAleatoria}`
    );

    res.status(201).json({ mensagem: "Administrador inicial criado com sucesso!" });

  } catch (err: any) {
    // Erro 400 geralmente é de violação de unique (email/nome já existem)
    res.status(400).json({ erro: "Falha ao criar Admin: " + err.message });
  }
});

// Criar Vendedor (rota protegida)
// [verificarToken, verificarAdmin] antes da função para verificar se de fato é admin
router.post(
  "/",
  [verificarToken, verificarAdmin],
  async (req: AuthRequest, res: any) => {
    try {
      const { email_usuario, isAdmin, tokenRecuperacao } = req.body;

      //Gera senha aleatória
      const senhaAleatoria = crypto.randomBytes(4).toString("hex");

      //Criptografa a senha antes de salvar
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(senhaAleatoria, salt);

      req.body.senha = senhaHash;
      req.body.tokenRecuperacao = tokenRecuperacao;
      req.body.isAdmin = isAdmin || false;

      const usuarioCriado = await insertUser(req);

      //Envia a senha original (aleatória) por email para o usuário saber qual é
      await enviarEmail(
        email_usuario,
        "Bem-vindo ao Kanban",
        `Sua senha provisória é: ${senhaAleatoria}`
      );

      res.status(201).json({ mensagem: "Usuário criado com sucesso!" });
    } catch (err: any) {
      res.status(400).json({ erro: err.message });
    }
  }
);

//Listar todos os usuários
router.get("/", async (req, res) => {
  const users = await readAllUsers();
  res.json(users);
});

//Buscar usuário por id
router.get("/:id", async (req, res) => {
  try {
    const user = await readUser(req.params.id);
    res.json(user);
  } catch (err) {
    return res.status(404).json({ mensagem: "Usuário não existe", erro: err });
  }
});

//Atualizar alguma informação
router.put("/:id", async (req, res) => {
  const atualizado = await updateUser(req, req.params.id);
  res.json(atualizado);
});

//Deletar usuário
router.delete("/:id", async (req, res) => {
  await deleteUser(req.params.id);
  res.json({ mensagem: "Usuário removido" });
});

export default router;
