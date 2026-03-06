import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { Resend } from "resend";
let connectionSettings: any;
async function getCredentials() {
  if (process.env.RESEND_API_KEY) {
    return {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL || "Lupa Site <onboarding@resend.dev>",
    };
  }
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;
  if (!xReplitToken) {
    throw new Error("No Resend credentials found. Set RESEND_API_KEY or connect Resend via Replit.");
  }
  connectionSettings = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=resend",
    {
      headers: {
        Accept: "application/json",
        "X-Replit-Token": xReplitToken,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);
  if (!connectionSettings || !connectionSettings.settings.api_key) {
    throw new Error("Resend not connected");
  }
  return {
    apiKey: connectionSettings.settings.api_key,
    fromEmail: connectionSettings.settings.from_email,
  };
}
async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail,
  };
}
export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      await storage.createContactMessage(data);
      console.log("Contact API: Message received from", data.email);
      try {
        const { client, fromEmail } = await getResendClient();
        const emailResult = await client.emails.send({
          from: fromEmail || "Lupa Site <onboarding@resend.dev>",
          to: "leandro@lupapesquisas.com.br",
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
        console.log("Email sent successfully to leandro@lupapesquisas.com.br", emailResult);
      } catch (emailError: any) {
        console.error("Email sending failed (form data was saved):", emailError.message);
      }
      res.status(200).json({
        success: true,
        message: "Solicitação enviada com sucesso! Entraremos em contato em breve.",
      });
    } catch (error: any) {
      console.error("Contact form error:", error);
      res.status(400).json({
        success: false,
        message: "Erro ao processar sua solicitação.",
      });
    }
  });
  const httpServer = createServer(app);
  return httpServer;
}
