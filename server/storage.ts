import { contactMessages, type InsertContact, type ContactMessage } from "@shared/schema";

export interface IStorage {
  createContactMessage(message: InsertContact): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private messages: Map<number, ContactMessage>;
  private currentId: number;

  constructor() {
    this.messages = new Map();
    this.currentId = 1;
  }

  async createContactMessage(insertContact: InsertContact): Promise<ContactMessage> {
    const id = this.currentId++;
    const message: ContactMessage = { ...insertContact, id, createdAt: new Date() };
    this.messages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
