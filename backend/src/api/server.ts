import express from "express";
import { getConnection } from "../database/DBconnection.js";
import usuarioRouter from "../api/usuario.js";
import clienteRouter from "../api/cliente.js";
import authRouter from "../api/auth.js";
import quadroRouter from "../api/quadro.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

getConnection();

app.use("/auth", authRouter);
app.use("/usuarios", usuarioRouter);
app.use("/clientes", clienteRouter);
app.use("/quadros", quadroRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
