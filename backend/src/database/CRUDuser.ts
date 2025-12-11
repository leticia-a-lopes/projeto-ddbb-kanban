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
export const readUser = async (id: String) => {
  const userInfo = await User.findById(id)
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
export const updateUser = async (req: Request, id: String) => {
  const {
    new_nome_usuario,
    new_email_usuario,
    new_senha,
    new_isAdmin,
    new_corlcone,
    new_telefone,
    new_tokenRecuperacao,
  } = req.body;
  const user = await User.findByIdAndUpdate(
    id,
    {
      nome_usuario: new_nome_usuario,
      email_usuario: new_email_usuario,
      senha: new_senha,
      isAdmin: new_isAdmin,
      corlcone: new_corlcone,
      telefone: new_telefone,
      tokenRecuperacao: new_tokenRecuperacao,
    },
    { runValidators: true, returnDocument: "after" }
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
