// import { prisma } from '../backend/lib/prisma';

export interface NotificationData {
  type: 'appointment' | 'order' | 'contact' | 'conversation';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  recipientEmail?: string;
}

export class NotificationService {
  static async createNotification(notification: NotificationData): Promise<void> {
    try {
      if (notification.recipientEmail) {
        await this.sendEmailNotification(notification);
      }
    } catch {
      // silent fail
    }
  }

  static async sendEmailNotification(_notification: NotificationData): Promise<void> {
    try {
      // Email sending logic would go here
    } catch {
      // silent fail
    }
  }

  static async notifyNewAppointment(appointmentData: Record<string, unknown>): Promise<void> {
    const notification: NotificationData = {
      type: 'appointment',
      title: 'Nouveau rendez-vous programmé',
      message: `Un nouveau rendez-vous a été pris pour "${appointmentData.service}" avec ${appointmentData.clientName} le ${appointmentData.date} à ${appointmentData.time}`,
      data: appointmentData,
      recipientEmail: 'org.netpub@gmail.com'
    };

    await this.createNotification(notification);
  }

  static async notifyNewOrder(orderData: Record<string, unknown>): Promise<void> {
    const notification: NotificationData = {
      type: 'order',
      title: 'Nouvelle commande reçue',
      message: `Une nouvelle commande a été passée pour "${orderData.type}" par ${orderData.clientName}`,
      data: orderData,
      recipientEmail: 'org.netpub@gmail.com'
    };

    await this.createNotification(notification);
  }

  static async notifyNewContact(contactData: Record<string, unknown>): Promise<void> {
    const notification: NotificationData = {
      type: 'contact',
      title: 'Nouveau message de contact',
      message: `${contactData.name} (${contactData.email}) a envoyé un message concernant "${contactData.service || 'Service général'}"`,
      data: contactData,
      recipientEmail: 'org.netpub@gmail.com'
    };

    await this.createNotification(notification);
  }

  static async notifyNewConversation(conversationData: Record<string, unknown>): Promise<void> {
    const notification: NotificationData = {
      type: 'conversation',
      title: 'Nouvelle conversation chatbot',
      message: `Nouvelle conversation démarrée avec ${conversationData.userName}`,
      data: conversationData
    };

    await this.createNotification(notification);
  }

  static async getRecentNotifications(_limit: number = 10): Promise<unknown[]> {
    try {
      return [];
    } catch {
      return [];
    }
  }
}