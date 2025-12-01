import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

async function getConnection() {
  //verifica se ja existe conecçao com o BD
  if (mongoose.connection.readyState == 1) {
    return;
  }

  await mongoose
    .connect(String(process.env.DB_URL))
    .then(() => {
      console.log("Conectado com sucesso!");
    })
    .catch((error) => {
      console.log("Nao foi possivel realizar a conexao " + error);
    });
}

async function closeConnection() {
  await mongoose
    .disconnect()
    .then(() => {
      console.log("Disconectado com sucesso!");
    })
    .catch((err) => {
      console.log("nao foi possivel se desconectar " + err);
    });
}

export { getConnection, closeConnection };
