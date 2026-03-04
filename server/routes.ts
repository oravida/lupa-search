import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import nodemailer from "nodemailer";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      await storage.createContactMessage(data);

      console.log("Contact API: Message received from", data.email);

      // Setup email transport
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.ethereal.email",
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER || "test@ethereal.email",
          pass: process.env.SMTP_PASS || "password",
        },
      });

      const mailOptions = {
        from: '"Lupa Site" <noreply@lupapesquisas.com.br>',
        to: "leandro@lupapesquisas.com.br",
        subject: `Nova Solicitação de Contato: ${data.empresa}`,
        text: `
          Nova solicitação recebida:
          Empresa/Candidato: ${data.empresa}
          Responsável: ${data.responsavel}
          Telefone/WhatsApp: ${data.telefone}
          Email: ${data.email}
          Área de Interesse: ${data.area}
          Demanda: ${data.demanda}
        `,
      };

      // Real sending logic
      if (process.env.SMTP_USER && process.env.SMTP_USER !== "test@ethereal.email") {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to leandro@lupapesquisas.com.br");
      } else {
        console.log("DEV MODE: Email would be sent to leandro@lupapesquisas.com.br");
        console.log("Mail Content:", mailOptions.text);
      }

      res.status(200).json({ 
        success: true, 
        message: "Solicitação enviada com sucesso! Entraremos em contato em breve." 
      });
    } catch (error: any) {
      console.error("Contact form error:", error);
      res.status(400).json({ success: false, message: "Erro ao processar sua solicitação." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
