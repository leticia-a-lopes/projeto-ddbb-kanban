import { User } from "./schemas.js";
import { Request } from "express";

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

//Recuperar token

export const saveRecoveryToken = async (id: String) => {
  const token = User.find(id, "tokenRecuperacao").catch((err) => {
    console.log("Nao foi possivel fazer a busca do token");
  });

  return token;
};

//Listar todos os usuarios
export const readAllUsers = async () => {
  const users = await User.find().catch((err) => {
    console.log("Nao foi possivel realizar a busca");
  });
  return users;
};

export const findUserByEmail = async (email: String) => {
  const user = await User.find({ email_usuario: "email" })
    .then(() => {
      console.log(JSON.stringify(user));
    })
    .catch((err) => {
      console.log(err);
    });

  return user;
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
