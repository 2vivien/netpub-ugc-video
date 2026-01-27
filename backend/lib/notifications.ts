export interface NotificationData {
  type: 'appointment' | 'order' | 'contact' | 'conversation';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  recipientEmail?: string;
}

export interface AppointmentNotificationData {
  service: string;
  clientName: string;
  date: string;
  time: string;
}

export interface OrderNotificationData {
  type: string;
  clientName: string;
}

export interface ContactNotificationData {
  name: string;
  email: string;
  service?: string;
}

export interface ConversationNotificationData {
  userName: string;
  id: string;
  userId?: string | null;
}

export class NotificationService {
  static async createNotification(notification: NotificationData): Promise<void> {
    try {
      // Store notification in database
      if (notification.recipientEmail) {
        await this.sendEmailNotification(notification);
      }
    } catch (err) {
      console.error('Notification creation failed:', err);
    }
  }

  static async sendEmailNotification(notification: NotificationData): Promise<void> {
    try {
      // This would integrate with your email service
      console.log('Sending email notification to:', notification.recipientEmail);
    } catch (err) {
      console.error('Email notification failed:', err);
    }
  }

  static async notifyNewAppointment(appointmentData: AppointmentNotificationData): Promise<void> {
    const notification: NotificationData = {
      type: 'appointment',
      title: 'Nouveau rendez-vous programmé',
      message: `Un nouveau rendez-vous a été pris pour "${appointmentData.service}" avec ${appointmentData.clientName} le ${appointmentData.date} à ${appointmentData.time}`,
      data: appointmentData as unknown as Record<string, unknown>,
      recipientEmail: 'org.netpub@gmail.com'
    };

    await this.createNotification(notification);
  }

  static async notifyNewOrder(orderData: OrderNotificationData): Promise<void> {
    const notification: NotificationData = {
      type: 'order',
      title: 'Nouvelle commande reçue',
      message: `Une nouvelle commande a été passée pour "${orderData.type}" par ${orderData.clientName}`,
      data: orderData as unknown as Record<string, unknown>,
      recipientEmail: 'org.netpub@gmail.com'
    };

    await this.createNotification(notification);
  }

  static async notifyNewContact(contactData: ContactNotificationData): Promise<void> {
    const notification: NotificationData = {
      type: 'contact',
      title: 'Nouveau message de contact',
      message: `${contactData.name} (${contactData.email}) a envoyé un message concernant "${contactData.service || 'Service général'}"`,
      data: contactData as unknown as Record<string, unknown>,
      recipientEmail: 'org.netpub@gmail.com'
    };

    await this.createNotification(notification);
  }

  static async notifyNewConversation(conversationData: ConversationNotificationData): Promise<void> {
    const notification: NotificationData = {
      type: 'conversation',
      title: 'Nouvelle conversation chatbot',
      message: `Nouvelle conversation démarrée avec ${conversationData.userName}`,
      data: conversationData as unknown as Record<string, unknown>
    };

    await this.createNotification(notification);
  }

  // Method to get recent notifications (for dashboard)
  static async getRecentNotifications(): Promise<NotificationData[]> {
    try {
      // This would query a notifications table
      // For now, return empty array
      return [];
    } catch {
      
      return [];
    }
  }
}