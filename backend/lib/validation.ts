import { z, ZodError } from 'zod';
import { UserInputError } from 'apollo-server-express';
import { GraphQLFieldResolver } from 'graphql';
import { ResolverContext } from '../types/index.js';

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
};

// Middleware de validation

export const validationMiddleware = {
  Mutation: {
    sendContactMessage: async (resolve: GraphQLFieldResolver<unknown, ResolverContext>, root: unknown, args: unknown, context: ResolverContext, info: unknown) => {
      try {
        validationSchemas.sendContactMessage.parse(args);
      } catch (e) {
        if (e instanceof ZodError) {
          throw new UserInputError(e.issues.map((err) => err.message).join(', '));
        }
        throw e;
      }
      // @ts-expect-error - external lib type compatibility
      return resolve(root, args as Record<string, unknown>, context, info);
    },
  },
};
