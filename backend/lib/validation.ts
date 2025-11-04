import { z } from 'zod';
import { UserInputError } from 'apollo-server-express';

// Schémas de validation avec Zod

const nonEmptyString = z.string().min(1, { message: 'Ce champ ne peut pas être vide.' });

export const validationSchemas = {
  sendContactMessage: z.object({
    name: nonEmptyString,
    email: z.string().email({ message: 'Adresse email invalide.' }),
    message: nonEmptyString,
    company: z.string().optional(),
    service: z.string().optional(),
  }),

  addComment: z.object({
    projectId: nonEmptyString,
    content: nonEmptyString.max(1000, { message: 'Le commentaire ne peut pas dépasser 1000 caractères.' }),
    userId: z.string().nullable(), // L'identifiant anonyme du navigateur
  }),

  addReply: z.object({
    parentId: nonEmptyString,
    content: nonEmptyString.max(1000, { message: 'La réponse ne peut pas dépasser 1000 caractères.' }),
    userIdentifier: z.string().optional(), // L'identifiant anonyme du navigateur
  }),

  addLike: z.object({
    projectId: nonEmptyString,
    anonymousId: z.string().nullable(), // L'identifiant anonyme du navigateur
  }),

  removeLike: z.object({
    projectId: nonEmptyString,
    anonymousId: nonEmptyString, // L'identifiant anonyme du navigateur
  }),
};

// Middleware de validation

export const validationMiddleware = {
  Mutation: {
    sendContactMessage: async (resolve: any, root: any, args: any, context: any, info: any) => {
      try {
        validationSchemas.sendContactMessage.parse(args);
      } catch (e: any) {
        throw new UserInputError(e.issues.map((err: any) => err.message).join(', '));
      }
      return resolve(root, args, context, info);
    },
    addComment: async (resolve: any, root: any, args: any, context: any, info: any) => {
      console.log('Backend validation received for addComment:', args);
      try {
        // Isolate and validate each field
        z.string().min(1).parse(args.projectId);
      } catch (e) {
        console.error('Validation failed for projectId', args.projectId);
        throw new UserInputError('Invalid projectId');
      }
      try {
        z.string().min(1).parse(args.content);
      } catch (e) {
        console.error('Validation failed for content', args.content);
        throw new UserInputError('Invalid content');
      }
      try {
        z.string().nullable().parse(args.anonymousId);
      } catch (e) {
        console.error('Validation failed for anonymousId', args.anonymousId);
        throw new UserInputError('Invalid anonymousId');
      }

      // Original validation (commented out for debugging)
      // try {
      //   validationSchemas.addComment.parse(args);
      // } catch (e: any) {
      //   throw new UserInputError(e.issues.map((err: any) => err.message).join(', '));
      // }
      return resolve(root, args, context, info);
    },
    addReply: async (resolve: any, root: any, args: any, context: any, info: any) => {
      try {
        validationSchemas.addReply.parse(args);
      } catch (e: any) {
        throw new UserInputError(e.issues.map((err: any) => err.message).join(', '));
      }
      return resolve(root, args, context, info);
    },
    addLike: async (resolve: any, root: any, args: any, context: any, info: any) => {
      console.log('Backend validation received for addLike:', args);
      try {
        validationSchemas.addLike.parse(args);
      } catch (e: any) {
        throw new UserInputError(e.issues.map((err: any) => err.message).join(', '));
      }
      return resolve(root, args, context, info);
    },
    removeLike: async (resolve: any, root: any, args: any, context: any, info: any) => {
      try {
        validationSchemas.removeLike.parse(args);
      } catch (e: any) {
        throw new UserInputError(e.issues.map((err: any) => err.message).join(', '));
      }
      return resolve(root, args, context, info);
    },
  },
};
