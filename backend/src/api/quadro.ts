import express from "express";
//Implementar essas funções também
import {
  insertQuadro,
  readQuadro,
  readAllQuadros,
  deleteQuadro,
} from "../database/CRUDboard.js";
import {
  verificarToken,
  verificarAdmin,
  AuthRequest,
} from "../middleware/auth.js";

const router = express.Router();

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

      const novoQuadro = await insertQuadro(nome, numColunas);

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
  const quadro = await readQuadro(req.params.id!);
  if (!quadro) {
    return res.status(404).json({ mensagem: "Quadro não encontrado." });
  }
  res.json(quadro);
});

//Deletar Quadro (admin apenas)
router.delete(
  "/:id",
  [verificarToken, verificarAdmin],
  async (req: AuthRequest, res: any) => {
    await deleteQuadro(req.params.id!);
    res.json({ mensagem: "Quadro removido com sucesso." });
  }
);

export default router;
