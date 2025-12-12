import { Board } from "./schemas.js";
import { Request } from "express";

export const insertQuadro = async (nome: string, colunas: number) => {
  const quadro = await Board.create({
    nome_quadro: nome,
    colunasRender: colunas,
  }).catch((err) => {
    console.log("Nao foi possivel criar um novo quadro: " + err);
  });
  return quadro;
};

export const readQuadro = async (quadroId: String) => {
  const quadro = await Board.findById(quadroId).catch((err) => {
    console.log("Nao foi possivel fazer a busca do quadro");
  });

  return quadro;
};

export const readAllQuadros = async () => {
  const quadros = await Board.find().catch((err) => {
    console.log("Nao foi possivel fazer a busca dos quadros" + err);
  });

  return quadros;
};

export const deleteQuadro = async (quadroId: String) => {
  await Board.findByIdAndDelete(quadroId).catch((err) => {
    console.log("Nao foi possivel deletar o quadro: " + err);
  });
};
