import { Client } from "./schemas.js";
import { Request } from "express";

export const insertClient = async (req: Request) => {
  const {
    nome_cliente,
    telefone,
    email_cliente,
    cpf_cliente,
    status,
    id_usuario,
    anotacoes,
    colunaAtual,
    idQuadro,
    agendamento = {},
    estaArquivado,
    motivoDesistencia = {},
    colunaDeOrigem,
    dataArquivamento = {},
  } = req.body;

  try {
    const novo = await Client.create({
      nome_cliente,
      telefone,
      email_cliente,
      cpf_cliente,
      status,
      id_usuario,
      anotacoes,
      colunaAtual,
      idQuadro,
      agendamento,
      estaArquivado,
      motivoDesistencia,
      colunaDeOrigem,
      dataArquivamento,
    });
    return novo;
  } catch (err) {
    console.log("Nao foi possivel criar um novo cliente " + err);
  }
};

//Read Client
export const readClient = async (id: String) => {
  try {
    const clientInfo = await Client.findById(id);
    return clientInfo;
  } catch (err) {
    console.log("Nao foi possivel buscar o cliente, verifique o id");
  }
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
  try {
    const clientsByUser = await Client.find({ id_usuario: userId });
    return clientsByUser;
  } catch (err) {
    console.log(
      "Nao foi possive listar todos os clientes, verifique o id do usuario " +
        err
    );
  }
};

//Listar todos os clientes de um quadro

export const readClientsByQuadro = async (id_quadro: String) => {
  try {
    const clients = await Client.find({ idQuadro: id_quadro });
    return clients;
  } catch (err) {
    console.log(
      "Nao foi possive listar todos os clientes, verifique o id do quadro " +
        err
    );
  }
};

//Listar todos os clientes arquivados

export const readArchivedClients = async () => {
  const archivedClients = await Client.find({ estaArquivado: true }).catch(
    (err) => {
      console.log("Nao foi possivel buscar os clientes arquivados: " + err);
    }
  );

  return archivedClients;
};

//Listar todos os clientes nao arquivados

export const unarchivedClients = async () => {
  const unarchivedClients = await Client.find({ estaArquivado: false }).catch(
    (err) => {
      console.log("Nao foi possivel buscar os clientes nao arquivados: " + err);
    }
  );

  return unarchivedClients;
};

//Desarquivar cliente(s)
export const desarquivarClientes = async (
  id: string,
  colunaDeOrigem: string
) => {
  try {
    if (!id || !colunaDeOrigem) {
      throw new Error(
        "ID e Coluna de Origem são obrigatórios para desarquivar."
      );
    }

    const unarchivedClient = await Client.findByIdAndUpdate(
      id,
      {
        estaArquivado: false, // Define como NÃO arquivado
        colunaAtual: colunaDeOrigem, // Move para a coluna de onde veio
        motivoDesistencia: null, // Limpa o motivo de desistência
        colunaDeOrigem: null, // Limpa a coluna de origem
        dataArquivamento: null, // Limpa a data de arquivamento
      },
      {
        new: true, // Garante que o documento retornado é o ATUALIZADO
        runValidators: true,
      }
    );

    if (!unarchivedClient) {
      throw new Error(`Card com ID ${id} não encontrado.`);
    }

    console.log("Card desarquivado com sucesso.");
    return unarchivedClient;
  } catch (err: any) {
    console.error("Não foi possível desarquivar o card: " + err.message);
    throw new Error("Falha ao desarquivar o card no banco de dados.");
  }
};

//Verificação de Duplicidade (verifica se um cliente já existe)
export const checkClientDuplicity = async (data: {
  telefone?: string;
  email_cliente?: string;
  cpf_cliente?: string;
}) => {
  //Cria um array de condições para buscar qualquer um dos campos fornecidos
  const query = { $or: [] as any[] };

  //Adiciona condições apenas se o valor estiver presente na requisição
  if (data.telefone) query.$or.push({ telefone: data.telefone });
  if (data.email_cliente) query.$or.push({ email_cliente: data.email_cliente });
  if (data.cpf_cliente) query.$or.push({ cpf_cliente: data.cpf_cliente });

  if (query.$or.length === 0) return null;

  try {
    //Busca o primeiro cliente que casar com qualquer uma das condições
    const clienteDuplicado = await Client.findOne(query);
    return clienteDuplicado;
  } catch (err: any) {
    console.error("Erro na busca de duplicidade: " + err.message);
    throw new Error("Falha ao buscar duplicidade no banco de dados.");
  }
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

  const client = await Client.findByIdAndUpdate(
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
    console.log("Nao foi possivel atualizar os dados do cliente " + err);
  });
  return client;
};

//Update coluna do cliente

export const updateClientColumn = async (id: String, column: String) => {
  const updatedUser = await Client.findByIdAndUpdate(
    id,
    { colunaAtual: column },
    { runValidators: true, returnDocument: "after" }
  ).catch((err) => {
    console.log("Nao foi possivel alterar a coluna do usuario: " + err);
  });

  return updatedUser;
};

//Update responsavel pelo cliente
//newResponsible deve ser o id do usuario que ira ser o responsavel
export const updateClientResponsible = async (
  id: String,
  newResponsible: String
) => {
  const updatedUser = await Client.findByIdAndUpdate(
    id,
    { id_usuario: newResponsible },
    { runValidators: true, returnDocument: "after" }
  ).catch((err) => {
    console.log("Nao foi possivel atualizar o responsavel: " + err);
  });

  return updatedUser;
};

//Adicionar data de agendamento

export const adicionarAgendamento = async (
  id: String,
  dia: Date,
  hora: String
) => {
  const updatedAgendamento = await Client.findByIdAndUpdate(
    id,
    {
      agendamento: {
        diaAgendamento: dia,
        horaAgendamento: hora,
      },
    },
    {
      runValidators: true,
      returnDocument: "after",
    }
  ).catch((err) => {
    console.log("Nao foi possivel realizar o agendamento");
  });
  return updatedAgendamento;
};

//Arquivar um cliente

export const archiveClient = async (id: String) => {
  const updatedUser = await Client.findByIdAndUpdate(
    id,
    { estaArquivado: true },
    { runValidators: true, returnDocument: "after" }
  ).catch((err) => {
    console.log("Nao foi possivel arquivar o cliente: " + err);
  });

  return updatedUser;
};

//Delete client
export const deleteClient = async (id: string) => {
  const deletedClient = await Client.findByIdAndDelete(id).catch((err) => {
    console.log("Nao foi possivel deletar o cliente");
  });
  return deletedClient;
};
