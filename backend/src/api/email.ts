import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "email@gmail.com",
    pass: "senhaaqui ", //Usar App Password do Gmail
  },
});

export const enviarEmail = async (email: string, assunto: string, texto: string) => {
  try {
    await transporter.sendMail({
      from: "Sistema Kanban <email@gmail.com>",
      to: email,
      subject: assunto,
      text: texto,
    });
    console.log(`Email enviado para ${email}`);
  } catch (err) {
    console.error("Erro ao enviar email:", err);
  }
};