import mongoose from "mongoose";

//ESQUEMA DO USUARIO

const userSchema = new mongoose.Schema({
  nome_usuario: {
    type: String,
    unique: true,
  },
  email_usuario: {
    type: String,
    unique: true,
  },
  senha: String,
  isAdmin: Boolean,
  corlcone: String,
  telefone: String,
  tokenRecuperacao: String,
});

//ESQUEMA DO CLIENTE

const clientSchema = new mongoose.Schema({
  nome_cliente: String,
  telefone: String,
  email_cliente: {
    type: String,
    unique: true,
  },
  cpf_cliente: {
    type: String,
    unique: true,
  },
  status: String,
  id_usuario: String,
  anotacoes: String,
  colunaAtual: String,
  idQuadro: String,
  agendamento: {
    diaAgendamento: Date,
    horaAgendamento: String,
  },
  estaArquivado: Boolean,
  motivoDesistencia: String,
  colunaDeOrigem: String,
  dataArquivamento: Date,
});

//ESQUEMA DO QUADRO

const boardSchema = new mongoose.Schema({
  nome_quadro: String,
  colunasRender: Number,
});

const User = mongoose.model("usuarios", userSchema);
const Client = mongoose.model("clientes", clientSchema);
const Board = mongoose.model("quadro", boardSchema);

export { User, Client, Board };
