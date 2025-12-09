import { getConnection } from "./DBconnection.js";
import { User, Client, Board } from "./schemas.js";
import { Request } from "express";

//create, read, update, delete
//User e Cliente serao as variaveis para fazer as operaçoes

getConnection(); //Estabelece conexao com o BD

//CRUD DO USUARIO

//Insert user
export const insertUser = async (req: Request) => {
  const {
    nome_usuario,
    email_usuario,
    senha,
    isAdmin,
    corlcone,
    telefone,
    tokenRecuperacao,
  } = req.body;
  await User.create(
    nome_usuario,
    email_usuario,
    senha,
    isAdmin,
    corlcone,
    telefone,
    tokenRecuperacao
  )
    .then(() => {
      console.log("Usuario inserido com sucesso");
    })
    .catch((err) => {
      console.log("Nao foi possivel inserir o usuario " + err);
    });
};

//Read user
export const readUser = async (id: string) => {
  const userInfo = await User.find({
    __id: id,
  })
    .then(() => {
      console.log(JSON.stringify(userInfo));
    })
    .catch((err) => {
      console.log("Nao foi possivel realizar a busca");
    });

  return userInfo;
};

//Listar todos os usuarios
export const readAllUsers = async () => {
  const users = await User.find().catch((err) => {
    console.log("Nao foi possivel realizar a busca");
  });
  return users;
};

//Update user
export const updateUser = async (req: Request, id: string) => {
  const {
    nome_usuario,
    email_usuario,
    senha,
    isAdmin,
    corlcone,
    telefone,
    tokenRecuperacao,
  } = req.body;
  const user = await User.findByIdAndUpdate(
    id,
    {
      nome_usuario,
      email_usuario,
      senha,
      isAdmin,
      corlcone,
      telefone,
      tokenRecuperacao,
    },
    { runValidators: true }
  ).catch((err) => {
    console.log("Nao foi possivel atualizar os dados do usuario");
  });
  return user;
};

//Delete user
export const deleteUser = async (id: string) => {
  const deletedUser = await User.findByIdAndDelete(id).catch((err) => {
    console.log("Nao foi possivel deletar o usuario");
  });
};

//CRUD DO CLIENTE

//Insert client
export const insertClient = async (req: Request) => {
  const {
    nome_cliente,
    telefone,
    email_cliente,
    cpf_cliente,
    status,
    id_usuario,
    anotacoes,
  } = req.body;

  await Client.create(
    nome_cliente,
    telefone,
    email_cliente,
    cpf_cliente,
    status,
    id_usuario,
    anotacoes
  )
    .then(() => {
      console.log("Cliente inserido com sucesso");
    })
    .catch((err) => {
      console.log("Nao foi possivel inserir o cliente " + err);
    });
};

//Read Client
export const readClient = async (id: string) => {
  const clientInfo = await Client.find({
    __id: id,
  })
    .then(() => {
      console.log(JSON.stringify(clientInfo));
    })
    .catch((err) => {
      console.log("Nao foi possivel realizar a busca");
    });

  return clientInfo;
};

//Listar todos os clientes
export const readAllClients = async () => {
  const clients = await Client.find().catch((err) => {
    console.log("Nao foi possivel realizar a busca");
  });
  return clients;
};

//Listar todos os clientes de um usuario
export const readAllClientsByUserId = async (userId: string) => {
  const clientsByUser = await Client.find({ id_usuario: userId })
    .then(() => {
      console.log(clientsByUser);
    })
    .catch((err) => {
      console.log("Nao foi possivel realizar a busca");
    });
  return clientsByUser;
};

//Update client
export const updateClient = async (req: Request, id: string) => {
  const {
    nome_cliente,
    telefone,
    email_cliente,
    cpf_cliente,
    status,
    id_usuario,
    anotacoes,
  } = req.body;

  const client = await User.findByIdAndUpdate(
    id,
    {
      nome_cliente,
      telefone,
      email_cliente,
      cpf_cliente,
      status,
      id_usuario,
      anotacoes,
    },
    { runValidators: true }
  ).catch((err) => {
    console.log("Nao foi possivel atualizar os dados do cliente");
  });
  return client;
};

//Delete client
export const deleteClient = async (id: string) => {
  const deletedClient = await Client.findByIdAndDelete(id).catch((err) => {
    console.log("Nao foi possivel deletar o cliente");
  });
};
