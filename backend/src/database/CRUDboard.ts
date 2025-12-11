import { Board } from "./schemas.js";
import { Request } from "express";
import { AuthRequest } from "../middleware/auth.js";

export const insertQuadro = async (nome: string, colunas: number) => {
  const quadro = await Board.create({
    nome_quadro: nome,
    colunasRender: colunas,
  }).catch((err) => {
    console.log("Nao foi possivel criar um novo quadro: " + err);
  });
};

export const updateQuadro = async (id: String, req: AuthRequest) => {
  const { nome_quadro, newColunaRender } = req.body;
  const updatedQuadro = await Board.findByIdAndUpdate(
    id,
    { nome: nome_quadro, colunasRender: newColunaRender },
    { runValidators: true }
  )
    .then(() => {
      console.log("Quadro atualizado com sucesso");
    })
    .catch((err) => {
      console.log("Nao foi possivel atualizar o quadro: " + err);
    });
};

export const readQuadro = async (quadroId: String) => {
  const quadro = await Board.findById(quadroId).catch((err) => {
    console.log("Nao foi possivel fazer a busca do quadro");
  });

  return quadro;
};

export const readAllQuadros = async () => {
  const quadros = await Board.find().catch((err) => {
    console.log("Nao foi possivel fazer a busca dos quadros");
  });

  return quadros;
};

export const deleteQuadro = async (quadroId: String) => {
  await Board.findByIdAndDelete(quadroId).catch((err) => {
    console.log("Nao foi possivel deletar o quadro: " + err);
  });
};
