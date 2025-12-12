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

  try {
    const newUser = await User.create({
      nome_usuario,
      email_usuario,
      senha,
      isAdmin,
      corlcone,
      telefone,
      tokenRecuperacao,
    });

    return newUser;
  } catch (err) {
    console.error(err)
    throw err
  }
};

//Read user
export const readUser = async (id: String) => {
  const userInfo = await User.findById(id).catch((err) => {
    console.log("Nao foi possivel realizar a busca");
  });

  return userInfo;
};

//Recuperar token

export const saveRecoveryToken = async (userId: string, token: string) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                tokenRecuperacao: token,
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            throw new Error("Usuário não encontrado.");
        }
        
        console.log("Token de recuperação salvo com sucesso para o usuário:", userId);
        return updatedUser;

    } catch (err: any) {
        console.error("Falha ao salvar o token de recuperação: " + err.message);
        throw new Error("Falha no banco de dados durante a gravação do token.");
    }
};

//Listar todos os usuarios
export const readAllUsers = async () => {
  const users = await User.find().catch((err) => {
    console.log("Nao foi possivel realizar a busca");
  });
  return users;
};

export const findUserByEmail = async (email: String) => {
  try {
    const user = await User.findOne({ email_usuario: email }).select("+senha");

    if (user) {
      console.log("Usuário encontrado no banco.");
    }
    return user;
  } catch (err: any) {
    console.error(
      "Nao foi possivel buscar o usuario por email: " + err.message
    );
    throw new Error("Falha na busca do usuário.");
  }
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

export const updatePasswordByToken = async (userId: string, newSenhaHash: string) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                senha: newSenhaHash,
                tokenRecuperacao: null,
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            throw new Error("Usuário não encontrado.");
        }
        
        console.log("Senha e token de recuperação atualizados com sucesso.");
        return updatedUser;

    } catch (err: any) {
        console.error("Falha ao atualizar a senha: " + err.message);
        throw new Error("Falha no banco de dados durante o reset de senha.");
    }
};

//Delete user
export const deleteUser = async (id: string) => {
  const deletedUser = await User.findByIdAndDelete(id).catch((err) => {
    console.log("Nao foi possivel deletar o usuario");
  });
};
