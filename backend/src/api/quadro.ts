import express from "express";
//Implementar essas funções também
import {
  insertQuadro,
  readQuadro,
  readAllQuadros,
  updateQuadro,
  deleteQuadro,
} from "../database/CRUDboard.js";
import {
  verificarToken,
  verificarAdmin,
  AuthRequest,
} from "../middleware/auth.js";

const router = express.Router();

const FIXED_COLUMN_NAMES = [
  "Em Contato",
  "Visita Agendada",
  "Atendimento",
  "Aula Experimental",
];

//Função auxiliar para gerar a estrutura de colunas padrão
const generateDefaultColumns = (num: number) => {
  const colunasGeradas = [];

  for (let i = 0; i < num; i++) {
    //Prioriza o nome fixo, se existir na lista
    //Se o índice for maior que o tamanho da lista fixa, usa um nome genérico
    const nomeColuna = FIXED_COLUMN_NAMES[i] || `Coluna Adicional ${i + 1}`;

    colunasGeradas.push({
      nome: nomeColuna,
    });
  }
  return colunasGeradas;
};

//Criação do Quadro
router.post(
  "/",
  [verificarToken, verificarAdmin],
  async (req: AuthRequest, res: any) => {
    try {
      const { nome, numColunas } = req.body;

      if (!nome) {
        return res
          .status(400)
          .json({ mensagem: "O nome do quadro é obrigatório." });
      }

      if (typeof numColunas !== "number" || numColunas < 1) {
        //Sugestão: Se não for passado um número, talvez assumir 4 (o padrão do FIXED_COLUMN_NAMES.
        //Por enquanto, é mantido a exigência de um número válido.
        return res.status(400).json({
          mensagem:
            "É necessário especificar um número válido de colunas (mínimo 1).",
        });
      }
      const colunasGeradas = generateDefaultColumns(numColunas);
      const novoQuadro = await insertQuadro(nome, colunasGeradas);

      res.status(201).json(novoQuadro);
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao criar quadro: " + err.message });
    }
  }
);

//Listar todos os Quadros (qualquer usuário logado)
router.get("/", verificarToken, async (req, res) => {
  const quadros = await readAllQuadros();
  res.json(quadros);
});

//Buscar quadro por id (qualquer usuário logado)
router.get("/:id", verificarToken, async (req, res) => {
  const quadro = await readQuadro(req.params.id);
  if (!quadro) {
    return res.status(404).json({ mensagem: "Quadro não encontrado." });
  }
  res.json(quadro);
});

//Editar estrutura/nome do quadro (admin apenas)
router.put(
  "/:id",
  [verificarToken, verificarAdmin],
  async (req: AuthRequest, res: any) => {
    const updated = await updateQuadro(req.params.id, req.body);
    res.json(updated);
  }
);

//Deletar Quadro (admin apenas)
router.delete(
  "/:id",
  [verificarToken, verificarAdmin],
  async (req: AuthRequest, res: any) => {
    await deleteQuadro(req.params.id);
    res.json({ mensagem: "Quadro removido com sucesso." });
  }
);

export default router;
