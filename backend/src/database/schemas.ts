import mongoose from "mongoose";

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

const clientSchema = new mongoose.Schema({
  nome_cliente: String,
  telefone: String,
  email_cliente: String,
  cpf_cliente: String,
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

const boardSchema = new mongoose.Schema({
  nome: String,
  colunasRender: Number,
});

const User = mongoose.model("usuarios", userSchema);
const Client = mongoose.model("clientes", clientSchema);
const Board = mongoose.model("quadro", boardSchema);

export { User, Client, Board };
