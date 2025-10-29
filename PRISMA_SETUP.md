# Configuration Prisma pour NetPub UGC Video

## 📋 Prérequis

Prisma est déjà installé dans le projet. Vous devez maintenant configurer votre base de données.

## 🚀 Étapes de configuration

### 1. Créer le fichier `.env.local`

Créez un fichier `.env.local` à la racine du projet avec la variable `DATABASE_URL` :

```env
# Exemple avec PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/netpub_ugc?schema=public"

# Ou avec SQLite (plus simple pour le développement)
DATABASE_URL="file:./dev.db"

# Ou avec MySQL
DATABASE_URL="mysql://username:password@localhost:3306/netpub_ugc"

# GEMINI API
GEMINI_API_KEY="votre_clé_api_ici"
```

### 2. Générer le client Prisma

```bash
npm run db:generate
```

Cette commande génère le client Prisma TypeScript basé sur votre schéma.

### 3. Configurer votre base de données

#### Option A : Push le schéma (Développement rapide)
```bash
npm run db:push
```
Cette commande synchronise votre schéma avec la base de données sans créer de migrations.

#### Option B : Créer des migrations (Production)
```bash
npm run db:migrate
```
Cette commande crée des fichiers de migration que vous pouvez versionner.

### 4. Ouvrir Prisma Studio (Optionnel)

```bash
npm run db:studio
```

Cette commande ouvre une interface graphique pour visualiser et gérer vos données.

## 📁 Structure créée

```
project/
├── prisma/
│   └── schema.prisma    # Schéma de votre base de données
├── lib/
│   └── prisma.ts        # Client Prisma configuré
└── .env.local           # Variables d'environnement (à créer)
```

## 🔧 Utilisation dans votre code

Exemple d'utilisation du client Prisma :

```typescript
import { prisma } from './lib/prisma';

// Créer un utilisateur
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    password: 'hashedpassword',
  },
});

// Lire des projets
const projects = await prisma.project.findMany({
  where: { category: 'ugc' },
  include: { user: true },
});

// Créer un commentaire
const comment = await prisma.comment.create({
  data: {
    content: 'Excellent travail !',
    userId: 'user-id',
    projectId: 'project-id',
  },
});
```

## 📊 Modèles de données

Le schéma inclut trois modèles principaux :

- **User** : Utilisateurs de l'application
- **Project** : Projets vidéo (UGC, publicitaires, spots)
- **Comment** : Commentaires avec support des réponses (relations parent-enfant)

## 🔒 Sécurité

- Ne commitez jamais le fichier `.env.local` 
- Utilisez des mots de passe forts pour votre base de données
- Activez les connexions SSL en production

## 📚 Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Migrate](https://www.prisma.io/docs/guides/migrate)

