import { prisma } from '../lib/prisma.js';
import { AuthService } from '../lib/auth.js';
import { emailService } from '../lib/email.js';
import { DashboardService } from '../lib/dashboard.js';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { ResolverContext } from '../types/index.js';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window as unknown as Window);

export const resolvers = {
  Query: {
    // User queries
    me: (_parent: unknown, _args: unknown, { user }: ResolverContext) => user,
    users: () => prisma.user.findMany(),

    // Project queries
    projects: async () => {
      const projects = await prisma.project.findMany({
        include: {
          user: true
        }
      });
      return projects;
    },
    project: async (_parent: unknown, { id }: { id: string }) => {
      const idInt = parseInt(id, 10);
      if (isNaN(idInt)) {
        return null;
      }
      const project = await prisma.project.findUnique({
        where: { id: idInt },
        include: {
          user: true
        }
      });
      if (!project) {
        return null;
      }
      return project;
    },
    projectsByCategory: async (_parent: unknown, { category }: { category: string }) => {
      const projects = await prisma.project.findMany({
        where: { category },
        include: {
          user: true
        }
      });
      return projects;
    },

    // Dashboard queries
    dashboardStats: () => DashboardService.getStats(),
    analyticsStats: () => DashboardService.getAnalyticsStats(),
    conversations: (_parent: unknown, { limit, offset }: { limit?: number; offset?: number }) => DashboardService.getConversations(limit, offset),
    conversation: (_parent: unknown, { id }: { id: string }) => DashboardService.getConversationById(id),
    allOrders: (_parent: unknown, { limit, offset, status, date }: { limit?: number; offset?: number; status?: string; date?: string }) => DashboardService.getAllOrders(limit, offset, status, date),
    allAppointments: (_parent: unknown, { limit, offset, status, date }: { limit?: number; offset?: number; status?: string; date?: string }) => DashboardService.getAllAppointments(limit, offset, status, date),
  },

  Mutation: {
    // Auth mutations
    login: async (_parent: unknown, { email, password }: { email: string; password: string }, context: ResolverContext) => {
      const ip = context.req.ip || context.req.connection.remoteAddress;
      const user = await AuthService.authenticateUser(email, password, ip);
      if (!user) throw new Error('Invalid credentials or IP blocked');

      const token = AuthService.generateToken(user);
      return { token, user };
    },

    register: async (_parent: unknown, { email, password, name }: { email: string; password: string; name?: string }) => {
      const user = await AuthService.registerUser(email, password, name);
      if (!user) throw new Error('Registration failed');

      const token = AuthService.generateToken(user);
      return { token, user };
    },

    createAdminUser: () => AuthService.createAdminUser(),

    createConversation: async () => {
      try {
        const conversation = await prisma.conversation.create({
          data: {
            userId: null,
            userName: null,
          }
        });
        return conversation;
      } catch (_error) {
        console.error('Create conversation error');
        throw new Error(`Failed to create conversation: ${_error instanceof Error ? _error.message : 'Unknown error'}`);
      }
    },

    updateConversation: async (_parent: unknown, { conversationId, clientName, clientEmail, clientPhone, discovery, feedback }: { conversationId: string; clientName?: string; clientEmail?: string; clientPhone?: string; discovery?: string; feedback?: string }) => {
      try {
        const conversation = await prisma.conversation.update({
          where: { id: conversationId },
          data: {
            clientName: clientName || undefined,
            clientEmail: clientEmail || undefined,
            clientPhone: clientPhone || undefined,
            discovery: discovery || undefined,
            feedback: feedback || undefined
          }
        });

        // Notify admin about the updated conversation details (async, don't wait for it)
        if (clientName || clientEmail || clientPhone || discovery || feedback) {
          emailService.sendConversationNotification({
            id: conversationId,
            clientName: clientName || conversation.clientName || undefined,
            clientEmail: clientEmail || conversation.clientEmail || undefined,
            clientPhone: clientPhone || conversation.clientPhone || undefined,
            discovery: discovery || conversation.discovery || undefined,
            feedback: feedback || conversation.feedback || undefined,
            lastMessage: 'Informations client mises à jour'
          }).catch(err => console.error('Failed to send conversation notification:', err));
        }

        return conversation;
      } catch (err) {
        console.error('Update conversation error:', err);
        throw new Error('Failed to update conversation');
      }
    },

    createAppointment: async (_parent: unknown, { service, date, time, conversationId }: { service: string; date: string; time: string; conversationId: string }) => {
      try {

        // Retrieve client info from conversation
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId }
        });

        const clientName = conversation?.clientName || 'Inconnu';
        const clientEmail = conversation?.clientEmail || '';
        const clientPhone = conversation?.clientPhone || '';

        // Create appointment in DB
        // Try to parse the date, but fall back to current date if it's text like "demain"
        let appointmentDate: Date;
        try {
          appointmentDate = new Date(date);
          if (isNaN(appointmentDate.getTime())) {
            // Fallback for relative dates like "demain"
            appointmentDate = new Date();
          }
        } catch {
          appointmentDate = new Date();
        }

        const appointment = await prisma.appointment.create({
          data: {
            service,
            date: appointmentDate,
            time,
            clientName,
            status: 'pending',
            conversationId
          }
        });

        // Send email notification
        if (clientEmail) {
          await emailService.sendAppointmentNotification({
            service,
            date,
            time,
            clientName,
            clientEmail,
            clientPhone
          });
        }

        return appointment;
      } catch {
        throw new Error('Failed to create appointment');
      }
    },

    createOrder: async (_parent: unknown, { service, details, conversationId }: { service: string; details: string; conversationId: string }) => {
      try {

        // Retrieve client info from conversation
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId }
        });

        const clientName = conversation?.clientName || 'Inconnu';
        const clientEmail = conversation?.clientEmail || '';
        const clientPhone = conversation?.clientPhone || '';

        // Create order in DB
        const order = await prisma.order.create({
          data: {
            type: service,
            clientName,
            status: 'pending',
            conversationId
          }
        });

        // Send email notification (async)
        if (clientEmail) {
          emailService.sendOrderNotification({
            service,
            details,
            clientName,
            clientEmail,
            clientPhone
          }).catch(err => console.error('Failed to send order email:', err));
        }

        return order;
      } catch (err) {
        console.error('Create order error:', err);
        throw new Error('Failed to create order');
      }
    },

    // Contact mutations
    sendContactMessage: async (_parent: unknown, {
      name,
      email,
      company,
      service,
      message
    }: {
      name: string;
      email: string;
      company?: string;
      service?: string;
      message: string;
    }) => {
      try {
        const sanitizedName = DOMPurify.sanitize(name);
        const sanitizedCompany = company ? DOMPurify.sanitize(company) : company;
        const sanitizedService = service ? DOMPurify.sanitize(service) : service;
        const sanitizedMessage = DOMPurify.sanitize(message);

        // Send notification email
        const notificationSent = await emailService.sendContactNotification({
          name: sanitizedName,
          email,
          company: sanitizedCompany,
          service: sanitizedService,
          message: sanitizedMessage
        });

        // Send auto-reply
        const autoReplySent = await emailService.sendAutoReply({
          name: sanitizedName,
          email,
          company: sanitizedCompany,
          service: sanitizedService,
          message: sanitizedMessage
        });

        return notificationSent && autoReplySent;
      } catch {
        throw new Error('Failed to send contact message');
      }
    },


    // Dashboard mutations

    updateAppointmentStatus: (_parent: unknown, { appointmentId, status }: { appointmentId: string; status: string }) => DashboardService.updateAppointmentStatus(appointmentId, status),

    updateOrderStatus: (_parent: unknown, { orderId, status }: { orderId: string; status: string }) => DashboardService.updateOrderStatus(orderId, status),

    resetChatbotModel: () => DashboardService.resetChatbotModel(),

    deleteConversation: (_parent: unknown, { conversationId }: { conversationId: string }) => DashboardService.deleteConversation(conversationId),

    addNoteToConversation: (_parent: unknown, { conversationId, note }: { conversationId: string; note: string }) => DashboardService.addNoteToConversation(conversationId, note),
    
    notifyConversationEnded: async (_parent: unknown, { conversationId }: { conversationId: string }) => {
      try {
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { messages: { take: 5, orderBy: { timestamp: 'desc' } } }
        });

        if (!conversation) return false;

        // Count non-null relevant fields
        const fields = [
          conversation.clientName,
          conversation.clientEmail,
          conversation.clientPhone,
          conversation.discovery,
          conversation.feedback
        ];
        const filledFieldsCount = fields.filter(f => f && f.trim() !== '').length;

        // Condition: at least 2 variables filled
        if (filledFieldsCount >= 2) {
          const lastMessages = conversation.messages.map(m => `${m.sender}: ${m.text}`).join('\n');
          
          await emailService.sendConversationNotification({
            id: conversationId,
            clientName: conversation.clientName || undefined,
            clientEmail: conversation.clientEmail || undefined,
            clientPhone: conversation.clientPhone || undefined,
            discovery: conversation.discovery || undefined,
            feedback: conversation.feedback || undefined,
            lastMessage: `Résumé des derniers échanges:\n${lastMessages}`
          });
          return true;
        }
        
        return false;
      } catch (err) {
        console.error('Error in notifyConversationEnded:', err);
        return false;
      }
    },

    addChatMessage: async (_parent: unknown, { conversationId, sender, text }: { conversationId: string; sender: string; text: string }) => {
      const message = await DashboardService.saveChatMessage(conversationId, sender, text);

      // Notify admin if the message is from the user
      if (sender === 'user') {
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId }
        });

        await emailService.sendConversationNotification({
          id: conversationId,
          clientName: conversation?.clientName || 'Anonyme',
          clientEmail: conversation?.clientEmail || undefined,
          clientPhone: conversation?.clientPhone || undefined,
          lastMessage: text
        });
      }

      return message;
    },

    exportAllData: async (_parent: unknown, _args: unknown, { user }: ResolverContext) => {
      // Security: Only admins should be able to trigger this
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      try {
        const [conversations, orders, appointments] = await Promise.all([
          prisma.conversation.findMany({ include: { messages: true } }),
          prisma.order.findMany(),
          prisma.appointment.findMany(),
        ]);

        const dataSummary = `
          <h2>Rapport Global NetPub</h2>
          <h3>Conversations (${conversations.length})</h3>
          <ul>
            ${conversations.map(c => `<li>${c.clientName || 'Anonyme'} (${c.clientEmail || 'N/A'}) - ${c.messages.length} messages</li>`).join('')}
          </ul>
          <h3>Commandes (${orders.length})</h3>
          <ul>
            ${orders.map(o => `<li>${o.clientName} - ${o.type} - ${o.status}</li>`).join('')}
          </ul>
          <h3>Rendez-vous (${appointments.length})</h3>
          <ul>
            ${appointments.map(a => `<li>${a.clientName} - ${a.service} - ${a.date.toLocaleDateString()} ${a.time}</li>`).join('')}
          </ul>
        `;

        await emailService.sendGenericEmail({
          subject: "Rapport d'activité complet - NetPub",
          html: dataSummary
        });

        return true;
      } catch {
        return false;
      }
    }
  },

};