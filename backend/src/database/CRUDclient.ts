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

  await Client.create({
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
  })
    .then(() => {
      console.log("Cliente inserido com sucesso");
    })
    .catch((err) => {
      console.log("Nao foi possivel inserir o cliente " + err);
    });
};

//Read Client
export const readClient = async (id: String) => {
  const clientInfo = await Client.findById(id)
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
      console.log(JSON.stringify(clientsByUser));
    })
    .catch((err) => {
      console.log("Nao foi possivel realizar a busca");
    });
  return clientsByUser;
};

//Listar todos os clientes de um quadro

export const readClientsByQuadro = async (id_quadro: String) => {
  const clients = await Client.find({ idQuadro: id_quadro })
    .then(() => {
      console.log(JSON.stringify(clients));
    })
    .catch((err) => {
      console.log("Nao foi possivel fazer a busca " + err);
    });

  return clients;
};

//Listar todos os clientes arquivados

export const readArchivedClients = async () => {
  const archivedClients = await Client.find({ estaArquivado: true })
    .then(() => {
      console.log(JSON.stringify(archivedClients));
    })
    .catch((err) => {
      console.log("Nao foi possivel buscar os clientes arquivados: " + err);
    });

  return archivedClients;
};

//Listar todos os clientes nao arquivados

export const unarchivedClients = async () => {
  const unarchivedClients = await Client.find({ estaArquivado: false })
    .then(() => {
      console.log(JSON.stringify(unarchivedClients));
    })
    .catch((err) => {
      console.log("Nao foi possivel buscar os clientes nao arquivados: " + err);
    });

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
  )
    .then(() => {
      console.log(JSON.stringify(updatedUser));
    })
    .catch((err) => {
      console.log("Nao foi possivel alterar a coluna do usuario: " + err);
    });
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
  )
    .then(() => {
      console.log(JSON.stringify(updatedUser));
    })
    .catch((err) => {
      console.log("Nao foi possivel atualizar o responsavel: " + err);
    });
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
  )
    .then(() => {
      console.log("Agendado com sucesso!");
    })
    .catch((err) => {
      console.log("Nao foi possivel realizar o agendamento");
    });
};

//Arquivar um cliente

export const archiveClient = async (id: String) => {
  const updatedUser = await Client.findByIdAndUpdate(
    id,
    { estaArquivado: true },
    { runValidators: true, returnDocument: "after" }
  )
    .then(() => {
      console.log(updatedUser);
    })
    .catch((err) => {
      console.log("Nao foi possivel arquivar o cliente: " + err);
    });
};

//Delete client
export const deleteClient = async (id: string) => {
  const deletedClient = await Client.findByIdAndDelete(id).catch((err) => {
    console.log("Nao foi possivel deletar o cliente");
  });
};
