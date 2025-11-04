import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export class DashboardService {
  static async getStats() {
    try {
      console.log('📊 Récupération des statistiques du dashboard');
      const [
        totalConversations,
        activeConversations,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        totalComments,
        totalLikes,
        recentConversations,
        recentAppointments,
        recentOrders,
        recentComments,
        recentLikes,
      ] = await Promise.all([
        prisma.conversation.count(),
        prisma.conversation.count({
          where: {
            lastActivity: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        }),
        prisma.appointment.count(),
        prisma.appointment.count({ where: { status: 'pending' } }),
        prisma.appointment.count({ where: { status: 'confirmed' } }),
        prisma.appointment.count({ where: { status: 'completed' } }),
        prisma.order.count(),
        prisma.order.count({ where: { status: 'pending' } }),
        prisma.order.count({ where: { status: 'confirmed' } }),
        prisma.order.count({ where: { status: 'delivered' } }),
        prisma.comment.count(),
        prisma.like.count(),
        prisma.conversation.findMany({
          take: 10,
          orderBy: { lastActivity: 'desc' },
          include: {
            messages: {
              take: 1,
              orderBy: { timestamp: 'desc' },
            },
          },
        }),
        prisma.appointment.findMany({
          take: 10,
          orderBy: { date: 'desc' },
          include: { conversation: true },
        }),
        prisma.order.findMany({
          take: 10,
          orderBy: { date: 'desc' },
          include: { conversation: true },
        }),
        prisma.comment.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: true, project: true },
        }),
        prisma.like.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: true, project: true },
        }),
      ]);

      console.log(`✅ Statistiques récupérées: ${totalConversations} conversations, ${totalComments} commentaires, ${totalLikes} likes`);
      return {
        totalConversations,
        activeConversations,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        totalComments,
        totalLikes,
        recentConversations,
        recentAppointments,
        recentOrders,
        recentComments,
        recentLikes,
      };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      throw new Error('Failed to get dashboard statistics');
    }
  }

  static async getAnalyticsStats() {
    try {
      console.log(`📊 Récupération des statistiques d'analyse`);
      const [totalMessages, totalAppointments, totalOrders, totalConversations] = await Promise.all([
        prisma.chatMessage.count(),
        prisma.appointment.count(),
        prisma.order.count(),
        prisma.conversation.count(),
      ]);

      const conversionRate = totalConversations > 0 ? (totalOrders / totalConversations) * 100 : 0;

      // Les intentions ne sont pas suivies, nous renvoyons des données factices
      const mostFrequentIntentions = [
        { name: 'Prendre rendez-vous', count: totalAppointments, icon: '📅' },
        { name: 'Voir tarifs', count: 30, icon: '💰' },
        { name: 'Demander un devis', count: 25, icon: '✉️' },
        { name: 'Voir portfolio', count: 50, icon: '🖼️' },
        { name: 'Autre', count: 20, icon: '❓' },
      ];

      return {
        totalMessages,
        totalAppointments,
        totalOrders,
        conversionRate,
        mostFrequentIntentions,
      };
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération des statistiques d'analyse:`, error);
      throw new Error('Failed to get analytics statistics');
    }
  }

  static async getAllOrders(limit: number = 20, offset: number = 0, status?: string, date?: string) {
    const where: Prisma.OrderWhereInput = {};
    if (status) {
      where.status = status;
    }
    if (date) {
      where.date = {
        gte: new Date(date),
        lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
      };
    }

    try {
      const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { date: 'desc' },
        }),
        prisma.order.count({ where }),
      ]);
      return { orders, totalCount };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des commandes:', error);
      throw new Error('Failed to get all orders');
    }
  }

  static async getAllAppointments(limit: number = 20, offset: number = 0, status?: string, date?: string) {
    const where: Prisma.AppointmentWhereInput = {};
    if (status) {
      where.status = status;
    }
    if (date) {
      where.date = {
        gte: new Date(date),
        lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
      };
    }

    try {
      const [appointments, totalCount] = await Promise.all([
        prisma.appointment.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { date: 'desc' },
        }),
        prisma.appointment.count({ where }),
      ]);
      return { appointments, totalCount };
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des rendez-vous:', error);
      throw new Error('Failed to get all appointments');
    }
  }

  static async getConversations(limit: number = 50, offset: number = 0) {
    try {
      console.log(`💬 Récupération des conversations (limit: ${limit}, offset: ${offset})`);
      const conversations = await prisma.conversation.findMany({
        take: limit,
        skip: offset,
        orderBy: { lastActivity: 'desc' },
        include: {
          user: true,
          messages: {
            orderBy: { timestamp: 'desc' },
            take: 10,
          },
          appointments: {
            orderBy: { date: 'desc' },
          },
          orders: {
            orderBy: { date: 'desc' },
          },
        },
      });

      console.log(`✅ ${conversations.length} conversations récupérées`);
      return conversations.map(conv => ({
        ...conv,
        messages: conv.messages.reverse(), // Most recent first
      }));
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des conversations:', error);
      return [];
    }
  }

  static async getConversationById(conversationId: string) {
    try {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          user: true,
          messages: {
            orderBy: { timestamp: 'asc' },
          },
          appointments: {
            orderBy: { date: 'desc' },
          },
          orders: {
            orderBy: { date: 'desc' },
          },
        },
      });

      return conversation;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  static async updateAppointmentStatus(appointmentId: string, status: string): Promise<boolean> {
    try {
      console.log(`📅 Mise à jour du statut du rendez-vous ${appointmentId} vers ${status}`);
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status },
      });
      console.log(`✅ Statut du rendez-vous ${appointmentId} mis à jour`);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut du rendez-vous:', error);
      return false;
    }
  }

  static async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      console.log(`📦 Mise à jour du statut de la commande ${orderId} vers ${status}`);
      await prisma.order.update({
        where: { id: orderId },
        data: { status },
      });
      console.log(`✅ Statut de la commande ${orderId} mis à jour`);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut de la commande:', error);
      return false;
    }
  }

  static async resetChatbotModel(): Promise<boolean> {
    try {
      // This would typically involve clearing conversation history or resetting AI model state
      // For now, we'll just log this action
      console.log('Chatbot model reset requested');
      // You could add logic here to clear old conversations or reset model state
      return true;
    } catch (error) {
      console.error('Error resetting chatbot model:', error);
      return false;
    }
  }

  static async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      await prisma.conversation.delete({
        where: { id: conversationId },
      });
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }

  static async addNoteToConversation(conversationId: string, note: string): Promise<boolean> {
    try {
      // For now, we'll add a system message as a note
      await prisma.chatMessage.create({
        data: {
          conversationId,
          sender: 'system',
          text: `Note: ${note}`,
        },
      });
      return true;
    } catch (error) {
      console.error('Error adding note to conversation:', error);
      return false;
    }
  }
}