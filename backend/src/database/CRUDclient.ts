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

  await Client.create(
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
    dataArquivamento
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
      console.log(JSON.stringify(clientsByUser));
    })
    .catch((err) => {
      console.log("Nao foi possivel realizar a busca");
    });
  return clientsByUser;
};

//Listar todos os clientes de um quadro

export const readClientsByQuadro = async (id_quadro: String) => {
  const clients = await Client.find({idQuadro: id_quadro}).then(()=>{
    console.log(JSON.stringify(clients));
  }).catch((err)=>{
    console.log("Nao foi possivel fazer a busca " + err);
  })

  return clients;
}

//Listar todos os clientes arquivados

export const readArchivedClients = async () =>{
  const archivedClients = await Client.find({estaArquivado:true}).then(()=>{
    console.log(JSON.stringify(archivedClients))
  }).catch((err)=>{
    console.log("Nao foi possivel buscar os clientes arquivados: " + err)
  })

  return archivedClients
}

//Listar todos os clientes nao arquivados

export const unarchiveClients = async () =>{
  const unarchivedClients = await Client.find({estaArquivado:false}).then(()=>{
    console.log(JSON.stringify(unarchivedClients))
  }).catch((err)=>{
    console.log("Nao foi possivel buscar os clientes nao arquivados: " + err)
  })

  return unarchivedClients;
}

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

export const updateClientColumn = async (id:String,column:String){
  const updatedUser = await Client.findByIdAndUpdate(id, {colunaAtual:column},{runValidators:true,returnDocument:"after"}).then(()=>{
    console.log(JSON.stringify(updatedUser));
  }).catch((err=>{
    console.log("Nao foi possivel alterar a coluna do usuario: " + err);
  }))
}

//Update responsavel pelo cliente
//newResponsible deve ser o id do usuario que ira ser o responsavel
export const updateClientResponsible = async (id:String,newResponsible:String) => {
  const updatedUser = await Client.findByIdAndUpdate(id,{id_usuario:newResponsible},{runValidators:true,returnDocument:"after"}).then(()=>{
    console.log(JSON.stringify(updatedUser));
  }).catch((err)=>{
    console.log("Nao foi possivel atualizar o responsavel: " + err);
  })
}

//Adicionar data de agendamento

export const adicionarAgendamento = async (id:String, dia:Date, hora:String) => {
  const updatedAgendamento = await Client.findByIdAndUpdate(id,{agendamento:{
    diaAgendamento:dia,
    horaAgendamento:hora
  }},{
    runValidators:true,
    returnDocument:"after"
  }).then(()=>{
    console.log("Agendado com sucesso!")
  }).catch((err)=>{
    console.log("Nao foi possivel realizar o agendamento")
  })
}

//Arquivar um cliente

export const archiveClient = async (id:String)=>{
 const updatedUser = await Client.findByIdAndUpdate(id,{estaArquivado:true},{runValidators:true,returnDocument:"after"}).then(()=>{
    console.log(updatedUser);
  }).catch((err)=>{
    console.log("Nao foi possivel arquivar o cliente: " + err);
  })
}

//Delete client
export const deleteClient = async (id: string) => {
  const deletedClient = await Client.findByIdAndDelete(id).catch((err) => {
    console.log("Nao foi possivel deletar o cliente");
  });
};
