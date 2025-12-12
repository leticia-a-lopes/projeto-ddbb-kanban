import express from "express";
import {
  insertClient,
  updateClient,
  readClient,
  deleteClient,
  readAllClients,
  updateClientColumn,
  updateClientResponsible,
  archiveClient,
  readClientsByQuadro,
  readArchivedClients,
  unarchivedClients,
  desarquivarClientes,
} from "../database/CRUDclient.js";
import { verificarToken, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

//Listar todos os clientes
router.get("/", async (req, res) => {
  const clientes = await readAllClients();
  res.json(clientes);
});

//Buscar cliente por id
router.get("/:id", async (req, res) => {
  try {
    const cliente = await readClient(req.params.id);
    res.json(cliente);
  } catch (err) {
    return res.status(404).json({ mensagem: "Cliente não existe", erro: err });
  }
});

//Atualizar alguma informação
router.put("/:id", async (req, res) => {
  const atualizado = await updateClient(req, req.params.id);
  res.json(atualizado);
});

//Deletar cliente
router.delete("/:id", async (req, res) => {
  await deleteClient(req.params.id);
  res.json({ mensagem: "Card removido" });
});

//Criação de card (vincular quadro, agendamento e coluna inicial)
router.post("/", verificarToken, async (req: AuthRequest, res) => {
  try {
    const dados = req.body;

    //Garante que o ID do usuário responsável logado seja salvo se não for especificado
    if (!dados.id_usuario && req.user) {
      dados.id_usuario = req.user.id;
    }

    if (!dados.colunaAtual) {
      dados.colunaAtual = "Em Contato";
    }

    const novo = await insertClient(req);
    res.status(201).json(novo);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

//Mover card (atualizar colunaAtual)
router.put("/mover/:id", verificarToken, async (req, res) => {
  const { colunaAtual } = req.body;
  const { id } = req.params;

  if (!colunaAtual) {
    return res.status(400).json({ mensagem: "colunaAtual é obrigatória." });
  }

  const updated = await updateClientColumn(id!, colunaAtual!);
  res.json(updated);
});

//Trocar responsável (Atualizar id_usuario)
router.put("/responsavel/:id", verificarToken, async (req, res) => {
  const { id_usuario } = req.body;
  const { id } = req.params;

  if (!id_usuario) {
    return res.status(400).json({ mensagem: "id_usuario é obrigatório." });
  }

  const updated = await updateClientResponsible(id!, id_usuario!);
  res.json(updated);
});

//Arquivar Card
router.put("/arquivar/:id", verificarToken, async (req, res) => {
  const { motivoDesistencia, colunaAtual } = req.body; // Pega a colunaAtual para salvar como origem
  const { id } = req.params;

  if (!motivoDesistencia || !colunaAtual) {
    return res
      .status(400)
      .json({
        mensagem: "Motivo e Coluna Atual são obrigatórios para arquivar.",
      });
  }

  const archived = await archiveClient(id!);
  res.json(archived);
});

//Desarquivar card
router.put("/desarquivar/:id", verificarToken, async (req, res) => {
  const { colunaDeOrigem } = req.body; // O Front precisa informar a coluna de destino (ou a colunaDeOrigem)
  const { id } = req.params;

  if (!colunaDeOrigem) {
    return res
      .status(400)
      .json({ mensagem: "colunaDeOrigem é obrigatória para desarquivar." });
  }

  const unarchived = await desarquivarClientes(id!, colunaDeOrigem);
  res.json(unarchived);
});

//GET cards por quadro (filtra pelo idQuadro)
router.get("/quadro/:idQuadro", verificarToken, async (req, res) => {
  const { idQuadro } = req.params;
  const cards = await readClientsByQuadro(idQuadro!);
  res.json(cards);
});

//GET todos os não arquivados
router.get("/~arquivados", verificarToken, (req, res) => {
  const naoArquivados = unarchivedClients();
  res.json(naoArquivados);
});

//GET arquivados com filtro e limite (Filtra por colunaDeOrigem)
router.get("/arquivados", verificarToken, async (req, res) => {
  const archived = await readArchivedClients();
  res.json(archived);
});

export default router;
