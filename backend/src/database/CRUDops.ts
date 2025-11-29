import { getConnection } from "./DBconnection";
import { User, Client } from "./schemas";
import { Request } from "express";

//create, read, update, delete
//User e Cliente serao as variaveis para fazer as operaçoes

getConnection();

//Insert user
const insertUser = async (req: Request) => {
  const { nome_usuario, email_usuario, senha } = req.body;
  await User.create(nome_usuario, email_usuario)
    .then(() => {
      console.log("Usuario inserido com sucesso");
    })
    .catch((err) => {
      console.log("Nao foi possivel inserir o usuario " + err);
    });
};

//Read user
const readUser = async (email: string) => {
  const userInfo = await User.find({
    email_usuario: email,
  })
    .then(() => {
      console.log(JSON.stringify(userInfo));
    })
    .catch((err) => {
      console.log("Nao foi possivel realizar a busca");
    });
};
