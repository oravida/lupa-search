import express from "express";
import { Resend } from "resend";
import { z } from "zod";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const insertContactSchema = z.object({
  empresa: z.string().min(1),
  responsavel: z.string().min(1),
  telefone: z.string().min(1),
  email: z.string().email(),
  area: z.string().min(1),
  demanda: z.string().min(1),
});

app.post("/api/contact", async (req, res) => {
  try {
    const data = insertContactSchema.parse(req.body);

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || "leandro@lupapesquisas.com.br";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Lupa Site <onboarding@resend.dev>";

    if (!apiKey) {
      console.error("RESEND_API_KEY não configurada!");
      return res.status(500).json({
        success: false,
        message: "Erro de configuração do servidor. Contate o administrador.",
      });
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Nova Solicitação de Contato: ${data.empresa}`,
      html: `
        <h2>Nova solicitação recebida pelo site</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; font-weight: bold;">Empresa/Candidato:</td><td style="padding: 8px;">${data.empresa}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Responsável:</td><td style="padding: 8px;">${data.responsavel}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Telefone/WhatsApp:</td><td style="padding: 8px;">${data.telefone}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${data.email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Área de Interesse:</td><td style="padding: 8px;">${data.area}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Demanda:</td><td style="padding: 8px;">${data.demanda}</td></tr>
        </table>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Solicitação enviada com sucesso! Entraremos em contato em breve.",
    });
  } catch (error) {
    console.error("Erro no formulário de contato:", error);
    return res.status(400).json({
      success: false,
      message: "Erro ao processar sua solicitação.",
    });
  }
});

export default app;
