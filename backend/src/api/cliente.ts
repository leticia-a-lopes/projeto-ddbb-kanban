import express from "express";
//Descomentar quando as funções forem implementadas pelo CRUDops
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
  unarchiveClients,
} from "../database/CRUDclient.js";
import { verificarToken, AuthRequest } from "../middleware/auth.js";

//Usar o router para modularizar melhor as diferentes rotas
const router = express.Router();

//Criar cliente
router.post("/", async (req, res) => {
  const novo = await insertClient(req.body);
  res.status(201).json(novo);
});

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
  const atualizado = await updateClient(req.body, req.params.id);
  res.json(atualizado);
});

//Deletar cliente
router.delete("/:id", async (req, res) => {
  await deleteClient(req.params.id);
  res.json({ mensagem: "Card removido" });
});

/*
Código comentado pois necessita de operações novas ou campos nos schemas

//Rota de verificação de duplicidade
router.post("/verificar-duplicidade", async (req, res) => {
    const { telefone, email_cliente, cpf_cliente } = req.body;

    const clienteDuplicado = await checkClientDuplicity({ telefone, email_cliente, cpf_cliente });

    if (clienteDuplicado) {
        return res.json({
            duplicado: true,
            cliente: clienteDuplicado,
            mensagem: `Cliente já existe. Arquivado: ${clienteDuplicado.estaArquivado}`,
            estaArquivado: clienteDuplicado.estaArquivado,
        });
    }

    res.json({ duplicado: false, mensagem: "Cliente não encontrado." });
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
        
        const novo = await insertClient(dados);
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

    const updated = await updateClientColumn(id, colunaAtual);
    res.json(updated);
});

//Trocar responsável (Atualizar id_usuario)
router.put("/responsavel/:id", verificarToken, async (req, res) => {
    const { id_usuario } = req.body;
    const { id } = req.params;

    if (!id_usuario) {
        return res.status(400).json({ mensagem: "id_usuario é obrigatório." });
    }

    const updated = await updateClientResponsible(id, id_usuario);
    res.json(updated);
});


//Arquivar Card
router.put("/arquivar/:id", verificarToken, async (req, res) => {
    const { motivoDesistencia, colunaAtual } = req.body; // Pega a colunaAtual para salvar como origem
    const { id } = req.params;

    if (!motivoDesistencia || !colunaAtual) {
        return res.status(400).json({ mensagem: "Motivo e Coluna Atual são obrigatórios para arquivar." });
    }

    const archived = await archiveClient(id, motivoDesistencia, colunaAtual);
    res.json(archived);
});

//Desarquivar card
router.put("/desarquivar/:id", verificarToken, async (req, res) => {
    const { colunaDeOrigem } = req.body; // O Front precisa informar a coluna de destino (ou a colunaDeOrigem)
    const { id } = req.params;
    
    if (!colunaDeOrigem) {
         return res.status(400).json({ mensagem: "colunaDeOrigem é obrigatória para desarquivar." });
    }
    
    const unarchived = await unarchiveClient(id, colunaDeOrigem);
    res.json(unarchived);
});

//GET cards por quadro (filtra pelo idQuadro)
router.get("/quadro/:idQuadro", verificarToken, async (req, res) => {
    const { idQuadro } = req.params;
    const cards = await readClientsByQuadro(idQuadro);
    res.json(cards);
});


//GET arquivados com filtro e limite (Filtra por colunaDeOrigem e retorna os 4 últimos)
router.get("/arquivados", verificarToken, async (req, res) => {
    //'search' como o parâmetro geral para nome, email, cpf, telefone
    const search = req.query.search as string | undefined; 
    const limit = 4; // Retorna os 4 últimos, conforme solicitado

    const archived = await readArchivedClients(search, limit);
    res.json(archived);
});
*/
export default router;
