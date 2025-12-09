import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

//Interface para que o TS entenda que req.user existe
export interface AuthRequest extends Request {
  user?: any;
}

export const verificarToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ mensagem: "Acesso negado. Token não fornecido." });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret);

    //Anexa os dados do usuário decodificados (id, isAdmin) na requisição
    req.user = decoded;

    next(); //Pode passar para a próxima rota
  } catch (err) {
    res.status(403).json({ mensagem: "Token inválido ou expirado." });
  }
};

//Extra apenas para garantir que é admin
export const verificarAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user.isAdmin) {
    return res
      .status(403)
      .json({ mensagem: "Acesso restrito a administradores." });
  }
  next();
};
