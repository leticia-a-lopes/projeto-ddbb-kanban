import express from 'express';
import dotenv from 'dotenv';
import { getConnection } from '../database/DBconnection.js';
import usuarioRouter from '../api/usuario.js';
import clienteRouter from '../api/cliente.js';
import authRouter from '../api/auth.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
getConnection();


app.use('/auth', authRouter); 
app.use('/usuarios', usuarioRouter); 
app.use('/clientes', clienteRouter); 

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});