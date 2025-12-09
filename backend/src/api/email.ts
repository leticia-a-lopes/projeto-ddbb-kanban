import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASS,
  },
});

export const enviarEmail = async (
  email: string,
  assunto: string,
  texto: string
) => {
  try {
    await transporter.sendMail({
      from: "Sistema Kanban <" + process.env.USER_MAIL + ">",
      to: email,
      subject: assunto,
      text: texto,
    });
    console.log(`Email enviado para ${email}`);
  } catch (err) {
    console.error("Erro ao enviar email:", err);
  }
};
