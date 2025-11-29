import express from "express";
import cors from "cors";

interface card {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  tel: string;
  anot: string;
}

let cards: card[] = [
  {
    id: 1,
    nome: "Nico",
    cpf: "123.456.789-00",
    email: "aaaa@gmail.com",
    tel: "(21)99999-8888",
    anot: "sem comentários",
  },
  {
    id: 2,
    nome: "Eric",
    cpf: "987.654.321-00",
    email: "bbbb@gmail.com",
    tel: "(11)98888-9999",
    anot: "prefiro me abster",
  },
];

const app = express();
app.use(cors());
app.use(express.json());

//Criar card
app.post("/cards", (req, res) => {
  const novoCard: card = req.body;
  cards.push(novoCard);
  res.status(201).json({ mensagem: "Card criado! ", card: novoCard });
});

//Listar cards
app.get("/cards", (req, res) => {
  res.json(cards);
});

//Buscar por nome
app.get("/cards/:nome", (req, res) => {
  const nome = req.params.nome;
  const card = cards.find((c) => c.nome === nome);

  if (!card) return res.status(404).json({ erro: "Card não existe !" });

  res.json(card);
});

//Atualizar alguma informação
app.put("/cards/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, cpf, email, tel, anot } = req.body;

  const indice = cards.findIndex((i) => i.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: "Card não encontrado" });
  }
  const atual = cards[indice];

  cards[indice] = {
    ...atual,
    id: id,
    nome: nome ?? atual!.nome,
    cpf: cpf ?? atual!.cpf,
    email: email ?? atual!.email,
    tel: tel ?? atual!.tel,
    anot: anot ?? atual!.anot,
  };

  res.json({ mensagem: "Card atualizado com sucesso!" });
});

app.delete("/cards/:id", (req, res) => {
  const id = Number(req.params.id);
  const antes = cards.length;
  cards = cards.filter((i) => i.id !== id);

  if (antes == cards.length) {
    return res.status(404).json({ erro: "Card não encontrado" });
  }

  res.json({ mensagem: "Card removido" });
});

app.listen(3000, () => {
  console.log("API está rodando em http://localhost:3000");
});
