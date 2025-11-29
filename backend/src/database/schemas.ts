import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nome_usuario: String,
  email_usuario: String,
  senha: String,
});

const clientSchema = new mongoose.Schema({
  nome_cliente: String,
  telefone: String,
  email_cliente: String,
  cpf_cliente: String,
  status: String,
  id_usuario: String,
  anotacoes: String,
});

const User = mongoose.model("usuarios", userSchema);
const Client = mongoose.model("clientes", clientSchema);

export { User, Client };
