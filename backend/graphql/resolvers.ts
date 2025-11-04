import { prisma } from '../lib/prisma';
import { AuthService } from '../lib/auth';
import { emailService } from '../lib/email';
import { DashboardService } from '../lib/dashboard';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const resolvers = {
  Query: {
    // User queries
    me: (_: any, __: any, { user }: any) => user,
    users: () => prisma.user.findMany(),

    // Project queries
    projects: async () => {
      console.log('📊 Récupération de tous les projets');
      const projects = await prisma.project.findMany({
        include: {
          user: true,
          comments: { include: { user: true, replies: { include: { user: true } } } },
          likes: { include: { user: true } },
          _count: { select: { comments: true, likes: true } }
        }
      });
      console.log(`✅ ${projects.length} projets récupérés`);
      return projects.map(project => ({
        ...project,
        likeCount: project._count.likes,
        commentCount: project._count.comments
      }));
    },
    project: async (_: any, { id }: { id: string }) => {
      console.log(`📊 Récupération du projet ${id}`);
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          user: true,
          comments: { include: { user: true, replies: { include: { user: true } } } },
          likes: { include: { user: true } },
          _count: { select: { comments: true, likes: true } }
        }
      });
      if (!project) {
        console.log(`❌ Projet ${id} non trouvé`);
        return null;
      }
      console.log(`✅ Projet ${id} récupéré`);
      return {
        ...project,
        likeCount: project._count.likes,
        commentCount: project._count.comments
      };
    },
    projectsByCategory: async (_: any, { category }: { category: string }) => {
      console.log(`📊 Récupération des projets de catégorie ${category}`);
      const projects = await prisma.project.findMany({
        where: { category },
        include: {
          user: true,
          comments: { include: { user: true } },
          likes: { include: { user: true } },
          _count: { select: { comments: true, likes: true } }
        }
      });
      console.log(`✅ ${projects.length} projets de catégorie ${category} récupérés`);
      return projects.map(project => ({
        ...project,
        likeCount: project._count.likes,
        commentCount: project._count.comments
      }));
    },

    // Comment queries
    comments: async (_: any, { projectId }: { projectId: string }) => {
      console.log(`📝 Récupération des commentaires pour le projet ${projectId}`);
      const comments = await prisma.comment.findMany({
        where: { projectId, parentId: null },
        include: {
          user: true,
          replies: { include: { user: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      console.log(`✅ ${comments.length} commentaires récupérés pour le projet ${projectId}`);
      return comments;
    },

    // Like queries
    likes: async (_: any, { projectId }: { projectId: string }) => {
      console.log(`❤️ Récupération des likes pour le projet ${projectId}`);
      const likes = await prisma.like.findMany({
        where: { projectId },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });
      console.log(`✅ ${likes.length} likes récupérés pour le projet ${projectId}`);
      return likes;
    },

    // Dashboard queries
    dashboardStats: () => DashboardService.getStats(),
    analyticsStats: () => DashboardService.getAnalyticsStats(),
    conversations: (_: any, { limit, offset }: { limit?: number; offset?: number }) => DashboardService.getConversations(limit, offset),
    conversation: (_: any, { id }: { id: string }) => DashboardService.getConversationById(id),
    allOrders: (_: any, { limit, offset, status, date }: { limit?: number; offset?: number; status?: string; date?: string }) => DashboardService.getAllOrders(limit, offset, status, date),
    allAppointments: (_: any, { limit, offset, status, date }: { limit?: number; offset?: number; status?: string; date?: string }) => DashboardService.getAllAppointments(limit, offset, status, date),
  },

  Mutation: {
    // Auth mutations
    login: async (_: any, { email, password }: { email: string; password: string }, context: any) => {
      const ip = context.req.ip || context.req.connection.remoteAddress;
      const user = await AuthService.authenticateUser(email, password, ip);
      if (!user) throw new Error('Invalid credentials or IP blocked');

      const token = AuthService.generateToken(user);
      return { token, user };
    },

    register: async (_: any, { email, password, name }: { email: string; password: string; name?: string }) => {
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
          },
        });
        return conversation;
      } catch (error) {
        console.error('❌ Erreur lors de la création de la conversation:', error);
        throw new Error('Failed to create conversation');
      }
    },

    // Contact mutations
    sendContactMessage: async (_: any, {
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

        console.log(`📧 Envoi d'un message de contact de ${sanitizedName} (${email})`);
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

        if (notificationSent && autoReplySent) {
          console.log(`✅ Message de contact envoyé avec succès pour ${sanitizedName}`);
        } else {
          console.log(`⚠️ Problème lors de l'envoi du message de contact pour ${sanitizedName}`);
        }

        return notificationSent && autoReplySent;
      } catch (error) {
        console.error('❌ Erreur lors de l\'envoi du message de contact:', error);
        throw new Error('Failed to send contact message');
      }
    },

    // Comment mutations
    addComment: async (_: any, {
      projectId,
      content,
      anonymousId
    }: {
      projectId: string;
      content: string;
      anonymousId: string | null;
    }) => {
      console.log('addComment resolver hit!');
      try {
        const projectIdInt = parseInt(projectId, 10);
        if (isNaN(projectIdInt)) {
          throw new Error('Invalid projectId format');
        }

        const sanitizedContent = DOMPurify.sanitize(content);
        console.log(`📝 Ajout d'un commentaire sur le projet ${projectIdInt}`);

        const comment = await prisma.comment.create({
          data: {
            content: sanitizedContent,
            projectId: projectIdInt,
            anonymousId,
            userId: null, // Explicitly set userId to null for anonymous comments
          },
          include: {
            user: true,
            project: true,
            replies: { include: { user: true } }
          }
        });

        console.log(`✅ Commentaire ajouté avec succès sur le projet ${projectIdInt}`);
        return comment;
      } catch (error) {
        console.error('❌ Erreur lors de l\'ajout du commentaire:', error);
        throw new Error('Failed to add comment');
      }
    },

    addReply: async (_: any, {
      parentId,
      content,
      userIdentifier
    }: {
      parentId: string;
      content: string;
      userIdentifier?: string;
    }) => {
      try {
        const sanitizedContent = DOMPurify.sanitize(content);
        console.log(`💬 Ajout d'une réponse au commentaire ${parentId}`);
        let userId = null;

        // Vérifier si l'utilisateur existe
        if (userIdentifier) {
          const user = await prisma.user.findFirst({
            where: { email: userIdentifier }
          });
          userId = user?.id || null;
        }

        // Récupérer le projectId du parent
        const parentComment = await prisma.comment.findUnique({
          where: { id: parentId },
          select: { projectId: true }
        });

        if (!parentComment) {
          throw new Error('Parent comment not found');
        }

        const reply = await prisma.comment.create({
          data: {
            content: sanitizedContent,
            projectId: parentComment.projectId,
            parentId,
            userId: userId || null
          },
          include: {
            user: true,
            parent: true,
            replies: { include: { user: true } }
          }
        });

        console.log(`✅ Réponse ajoutée avec succès au commentaire ${parentId}`);
        return reply;
      } catch (error) {
        console.error('❌ Erreur lors de l\'ajout de la réponse:', error);
        throw new Error('Failed to add reply');
      }
    },

    // Like mutations
    addLike: async (_: any, {
      projectId,
      anonymousId
    }: {
      projectId: string;
      anonymousId: string | null;
    }) => {
      console.log('addLike resolver hit!');
      try {
        const projectIdInt = parseInt(projectId, 10);
        if (isNaN(projectIdInt)) {
          throw new Error('Invalid projectId format');
        }

        console.log(`❤️ Ajout d'un like sur le projet ${projectIdInt} par ${anonymousId}`);

        // Check if a like from this anonymousId already exists for this projectId
        const existingLike = await prisma.like.findFirst({
          where: {
            projectId: projectIdInt,
            anonymousId,
          },
        });

        if (existingLike) {
          console.log(`⚠️ Like déjà existant pour le projet ${projectIdInt} par ${anonymousId}`);
          return existingLike;
        }

        const like = await prisma.like.create({
          data: {
            projectId: projectIdInt,
            anonymousId,
            userId: null, // Explicitly set userId to null for anonymous likes
          },
          include: {
            project: true
          }
        });

        console.log(`✅ Like ajouté avec succès sur le projet ${projectIdInt} par ${anonymousId}`);
        return like;
      } catch (error) {
        console.error('❌ Erreur lors de l\'ajout du like:', error);
        throw new Error('Failed to add like');
      }
    },

        removeLike: async (_: any, {

          projectId,

          anonymousId

        }: {

          projectId: string;

          anonymousId: string;

        }) => {

          try {
            const projectIdInt = parseInt(projectId, 10);
            if (isNaN(projectIdInt)) {
              throw new Error('Invalid projectId format');
            }

            console.log(`💔 Suppression d'un like sur le projet ${projectIdInt} par ${anonymousId}`);

    

            const result = await prisma.like.deleteMany({

              where: {

                projectId: projectIdInt,

                anonymousId,

              },

            });

    

            console.log(`✅ Like supprimé avec succès sur le projet ${projectIdInt} par ${anonymousId}`);

            return result.count > 0;

          } catch (error) {

            console.error('❌ Erreur lors de la suppression du like:', error);

            throw new Error('Failed to remove like');

          }

        },

    

        // Dashboard mutations

        updateAppointmentStatus: (_: any, { appointmentId, status }: { appointmentId: string; status: string }) => DashboardService.updateAppointmentStatus(appointmentId, status),

        updateOrderStatus: (_: any, { orderId, status }: { orderId: string; status: string }) => DashboardService.updateOrderStatus(orderId, status),

        resetChatbotModel: () => DashboardService.resetChatbotModel(),

        deleteConversation: (_: any, { conversationId }: { conversationId: string }) => DashboardService.deleteConversation(conversationId),

        addNoteToConversation: (_: any, { conversationId, note }: { conversationId: string; note: string }) => DashboardService.addNoteToConversation(conversationId, note),

      },

    };