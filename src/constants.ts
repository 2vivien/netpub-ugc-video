import { PortfolioCategory, PortfolioProject, Comment } from './types';

export const portfolioProjects: PortfolioProject[] = [

  { id: 1, title: 'Photo UGC - 1', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/1.png', mediaType: 'image', likes: [], comments: [], likeCount: 152, commentCount: 23, hashtags: ['UGC', 'Photo'] },

  { id: 2, title: 'Photo UGC - 2', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/2.png', mediaType: 'image', likes: [], comments: [], likeCount: 234, commentCount: 45, hashtags: ['UGC', 'Photo'] },

  { id: 3, title: 'Photo UGC - 3', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/3.png', mediaType: 'image', likes: [], comments: [], likeCount: 189, commentCount: 31, hashtags: ['UGC', 'Photo'] },

  { id: 4, title: 'Photo UGC - 4', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/4.png', mediaType: 'image', likes: [], comments: [], likeCount: 201, commentCount: 28, hashtags: ['UGC', 'Photo'] },

  { id: 5, title: 'Photo UGC - 5', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/5.png', mediaType: 'image', likes: [], comments: [], likeCount: 121, commentCount: 21, hashtags: ['UGC', 'Photo'] },

  { id: 6, title: 'Photo UGC - 6', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/6.png', mediaType: 'image', likes: [], comments: [], likeCount: 288, commentCount: 49, hashtags: ['UGC', 'Photo'] },

  { id: 13, title: 'Photo Mode - 11', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/11.png', mediaType: 'image', likes: [], comments: [], likeCount: 198, commentCount: 32, hashtags: ['Mode', 'Photo', 'Studio'] },

  { id: 15, title: 'Photo Mode - 13', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/13.png', mediaType: 'image', likes: [], comments: [], likeCount: 158, commentCount: 25, hashtags: ['Mode', 'Photo'] },

  { id: 16, title: 'Photo Mode - 14', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/14.png', mediaType: 'image', likes: [], comments: [], likeCount: 261, commentCount: 43, hashtags: ['Mode', 'Photo'] },

  { id: 18, title: 'Photo Mode - 16', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/16.png', mediaType: 'image', likes: [], comments: [], likeCount: 293, commentCount: 50, hashtags: ['Mode', 'Photo'] },

  { id: 19, title: 'Photo Mode - 17', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/17.png', mediaType: 'image', likes: [], comments: [], likeCount: 167, commentCount: 27, hashtags: ['Mode', 'Photo'] },

  { id: 20, title: 'Photo Mode - 18', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/18.png', mediaType: 'image', likes: [], comments: [], likeCount: 240, commentCount: 40, hashtags: ['Mode', 'Photo'] },

  { id: 24, title: 'Photo Mode - 3', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/3.png', mediaType: 'image', likes: [], comments: [], likeCount: 299, commentCount: 47, hashtags: ['Mode', 'Photo'] },

  { id: 25, title: 'Photo Mode - 4', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/4.png', mediaType: 'image', likes: [], comments: [], likeCount: 148, commentCount: 24, hashtags: ['Mode', 'Photo'] },

  { id: 28, title: 'Photo Mode - 7', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/7.png', mediaType: 'image', likes: [], comments: [], likeCount: 218, commentCount: 37, hashtags: ['Mode', 'Photo'] },

  { id: 29, title: 'Photo Mode - 8', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/8.png', mediaType: 'image', likes: [], comments: [], likeCount: 129, commentCount: 26, hashtags: ['Mode', 'Photo'] },

  { id: 31, title: 'Photo Spot Publicitaire - 1', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/spot-new-1.jpg', mediaType: 'image', likes: [], comments: [], likeCount: 162, commentCount: 25, hashtags: ['Spot', 'Photo', '4K'] },

  { id: 32, title: 'Photo Spot Publicitaire - 2', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/spot-new-2.jpg', mediaType: 'image', likes: [], comments: [], likeCount: 273, commentCount: 49, hashtags: ['Spot', 'Photo', '4K'] },

  { id: 33, title: 'Photo Spot Publicitaire - 3', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/spot-new-3.jpg', mediaType: 'image', likes: [], comments: [], likeCount: 188, commentCount: 34, hashtags: ['Spot', 'Photo', '4K'] },

  { id: 34, title: 'Photo Spot Publicitaire - 4', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/spot-new-4.jpg', mediaType: 'image', likes: [], comments: [], likeCount: 211, commentCount: 38, hashtags: ['Spot', 'Photo', '4K'] },

  { id: 35, title: 'Photo Spot Publicitaire - 5', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/spot-new-5.jpg', mediaType: 'image', likes: [], comments: [], likeCount: 138, commentCount: 22, hashtags: ['Spot', 'Photo', '4K'] },

  { id: 36, title: 'Photo Spot Publicitaire - 6', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/spot-new-6.png', mediaType: 'image', likes: [], comments: [], likeCount: 291, commentCount: 48, hashtags: ['Spot', 'Photo', '4K'] },

  { id: 37, title: 'Photo Spot Publicitaire - 7', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/spot-new-7.png', mediaType: 'image', likes: [], comments: [], likeCount: 171, commentCount: 28, hashtags: ['Spot', 'Photo', 'Social Media'] },

  { id: 39, title: 'Vidéo UGC - 1', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/ugc-new-1.mp4', videoUrl: '/Video/vidéo-ugc/ugc-new-1.mp4', mediaType: 'video', likes: [], comments: [], likeCount: 195, commentCount: 31, hashtags: ['UGC', 'Vidéo'] },

  { id: 40, title: 'Vidéo UGC - 2', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/ugc-new-2.mp4', videoUrl: '/Video/vidéo-ugc/ugc-new-2.mp4', mediaType: 'video', likes: [], comments: [], likeCount: 155, commentCount: 24, hashtags: ['UGC', 'Vidéo'] },

  { id: 41, title: 'Vidéo UGC - 3', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/ugc-new-3.mp4', videoUrl: '/Video/vidéo-ugc/ugc-new-3.mp4', mediaType: 'video', likes: [], comments: [], likeCount: 285, commentCount: 47, hashtags: ['UGC', 'Vidéo'] },

  { id: 42, title: 'Vidéo UGC - 4', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/ugc-new-4.mp4', videoUrl: '/Video/vidéo-ugc/ugc-new-4.mp4', mediaType: 'video', likes: [], comments: [], likeCount: 215, commentCount: 36, hashtags: ['UGC', 'Vidéo'] },

  { id: 43, title: 'Vidéo UGC - 5', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/ugc-new-5.mp4', videoUrl: '/Video/vidéo-ugc/ugc-new-5.mp4', mediaType: 'video', likes: [], comments: [], likeCount: 235, commentCount: 41, hashtags: ['UGC', 'Vidéo'] },

  { id: 44, title: 'Vidéo UGC - 6', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/ugc-new-6.mp4', videoUrl: '/Video/vidéo-ugc/ugc-new-6.mp4', mediaType: 'video', likes: [], comments: [], likeCount: 175, commentCount: 32, hashtags: ['UGC', 'Vidéo'] },

  { id: 49, title: 'Vidéo Mode - 1', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/Design sans titre (1).mp4', videoUrl: '/Video/video-mode/Design sans titre (1).mp4', mediaType: 'video', likes: [], comments: [], likeCount: 185, commentCount: 33, hashtags: ['Mode', 'Vidéo'] },

  { id: 50, title: 'Vidéo Mode - 2', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/Design sans titre (2).mp4', videoUrl: '/Video/video-mode/Design sans titre (2).mp4', mediaType: 'video', likes: [], comments: [], likeCount: 205, commentCount: 35, hashtags: ['Mode', 'Vidéo'] },

  { id: 51, title: 'Vidéo Mode - 3', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/Design sans titre (3).mp4', videoUrl: '/Video/video-mode/Design sans titre (3).mp4', mediaType: 'video', likes: [], comments: [], likeCount: 135, commentCount: 23, hashtags: ['Mode', 'Vidéo'] },

  { id: 52, title: 'Vidéo Mode - 4', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/Design sans titre.mp4', videoUrl: '/Video/video-mode/Design sans titre.mp4', mediaType: 'video', likes: [], comments: [], likeCount: 275, commentCount: 46, hashtags: ['Mode', 'Vidéo'] },

  { id: 84, title: 'Spot Publicitaire 4K - Nouveau', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/pneuvideo.mp4', videoUrl: '/Video/spot-publicitaire-video/pneuvideo.mp4', mediaType: 'video', likes: [], comments: [], likeCount: 312, commentCount: 54, hashtags: ['Spot', 'Vidéo', '4K', 'New'] },

  { id: 74, title: 'Spot Publicitaire 4K - 1', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/Design sans titre (12).mp4', videoUrl: '/Video/spot-publicitaire-video/Design sans titre (12).mp4', mediaType: 'video', likes: [], comments: [], likeCount: 202, commentCount: 32, hashtags: ['Spot', 'Vidéo', '4K'] },

  { id: 75, title: 'Spot Publicitaire 4K - 2', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/bcfd36a3-9ef7-4e84-b621-de6e850d5123.mp4', videoUrl: '/Video/spot-publicitaire-video/bcfd36a3-9ef7-4e84-b621-de6e850d5123.mp4', mediaType: 'video', likes: [], comments: [], likeCount: 217, commentCount: 36, hashtags: ['Spot', 'Vidéo', '4K'] },

  { id: 76, title: 'Spot Publicitaire 4K - 3', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/78f55824-1b8a-49f0-a9a7-de333a3e6fdc.mp4', videoUrl: '/Video/spot-publicitaire-video/78f55824-1b8a-49f0-a9a7-de333a3e6fdc.mp4', mediaType: 'video', likes: [], comments: [], likeCount: 137, commentCount: 24, hashtags: ['Spot', 'Vidéo', '4K'] },

  { id: 77, title: 'Spot Publicitaire 4K - 4', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/fb9dbcf5-6d67-45ab-b759-165745ad963c.mp4', videoUrl: '/Video/spot-publicitaire-video/fb9dbcf5-6d67-45ab-b759-165745ad963c.mp4', mediaType: 'video', likes: [], comments: [], likeCount: 127, commentCount: 23, hashtags: ['Spot', 'Vidéo', '4K'] },

  // Influenceuses Section
  {
    id: 101,
    title: 'Iliana',
    category: PortfolioCategory.INFLUENCEUSES,
    mediaUrl: '/images/influencers/iliana/1.jpg',
    mediaType: 'image',
    age: 20,
    bio: 'Partage ses looks tendances et ses routines beauté au quotidien.',
    hashtags: ['Mode', 'Beauté', 'Lifestyle'],
    mediaItems: [
      { url: '/images/influencers/iliana/1.jpg', type: 'image' },
      { url: '/images/influencers/iliana/2.jpg', type: 'image' },
      { url: '/images/influencers/iliana/3.jpg', type: 'image' },
      { url: '/images/influencers/iliana/4.jpg', type: 'image' }
    ]
  },
  {
    id: 102,
    title: 'Faeza',
    category: PortfolioCategory.INFLUENCEUSES,
    mediaUrl: '/images/influencers/faeza/1.jpg',
    mediaType: 'image',
    age: 22,
    bio: 'Spécialisée dans la beauté, le sport et les services modernes.',
    hashtags: ['Beauté', 'Sport', 'Lifestyle'],
    mediaItems: [
      { url: '/images/influencers/faeza/1.jpg', type: 'image' },
      { url: '/images/influencers/faeza/2.jpg', type: 'image' },
      { url: '/images/influencers/faeza/3.jpg', type: 'image' },
      { url: '/images/influencers/faeza/4.jpg', type: 'image' }
    ]
  },
  {
    id: 103,
    title: 'Anouk',
    category: PortfolioCategory.INFLUENCEUSES,
    mediaUrl: '/images/influencers/anouk/1.jpg',
    mediaType: 'image',
    age: 21,
    bio: 'Passionnée par la mode et les collaborations innovantes.',
    hashtags: ['Mode', 'Soins', 'Innovation'],
    mediaItems: [
      { url: '/images/influencers/anouk/1.jpg', type: 'image' },
      { url: '/images/influencers/anouk/2.jpg', type: 'image' },
      { url: '/images/influencers/anouk/3.jpg', type: 'image' },
      { url: '/images/influencers/anouk/4.jpg', type: 'image' }
    ]
  },
  {
    id: 104,
    title: 'Maëlys',
    category: PortfolioCategory.INFLUENCEUSES,
    mediaUrl: '/images/influencers/maelys/1.jpg',
    mediaType: 'image',
    age: 22,
    bio: 'Met en avant les produits tendance et la beauté naturelle.',
    hashtags: ['Lifestyle', 'Beauté', 'Tendance'],
    mediaItems: [
      { url: '/images/influencers/maelys/1.jpg', type: 'image' },
      { url: '/images/influencers/maelys/2.jpg', type: 'image' },
      { url: '/images/influencers/maelys/3.jpg', type: 'image' },
      { url: '/images/influencers/maelys/4.jpg', type: 'image' }
    ]
  },
  {
    id: 105,
    title: 'Tayla',
    category: PortfolioCategory.INFLUENCEUSES,
    mediaUrl: '/images/influencers/tayla/1.jpg',
    mediaType: 'image',
    age: 23,
    bio: 'Dynamique et axée sur la mode et le bien-être.',
    hashtags: ['Mode', 'Bien-être', 'Lifestyle'],
    mediaItems: [
      { url: '/images/influencers/tayla/1.jpg', type: 'image' },
      { url: '/images/influencers/tayla/2.jpg', type: 'image' },
      { url: '/images/influencers/tayla/3.jpg', type: 'image' },
      { url: '/images/influencers/tayla/4.jpg', type: 'image' }
    ]
  }
];

export const servicesInteractive = [
  {
    title: 'Création UGC (User Generated Content)',
    description: `Authenticité maximale avec des vidéos créées par de vrais utilisateurs pour une confiance et une conversion accrue.`,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    title: 'Spots Publicitaires 4K',
    description: `Qualité cinématographique pour vos publicités sur les réseaux sociaux, TV ou web. Un impact visuel inoubliable.`,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  },
  {
    title: 'Stratégie & Concept Créatif',
    description: `Nous ne faisons pas que filmer. Nous créons des concepts percutants et des stratégies de diffusion pour maximiser votre ROI.`,
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  },
];

export const whyUsPillars = [
  { title: 'Créativité Axée sur la Performance', description: `Chaque idée, chaque plan, chaque vidéo est conçu avec un seul objectif : atteindre vos KPIs.` },
  { title: 'Experts des Réseaux Sociaux', description: `Nous maîtrisons les codes et les formats de chaque plateforme pour un contenu natif et performant.` },
  { title: 'Agilité et Réactivité', description: `Notre structure nous permet de nous adapter rapidement aux tendances et à vos besoins pour des projets livrés à temps.` },
  { title: 'Qualité Sans Compromis', description: `De l'UGC authentique au spot 4K léché, nous appliquons les mêmes standards d'excellence à chaque production.` },
];

export const newServicesData = [
  {
    title: 'Vidéos UGC',
    description: `Des contenus naturels et authentiques tournés par de vrais créateurs. Parfait pour les marques e-commerce qui veulent des publicités performantes sur TikTok, Meta et Reels.`,
    videoUrl: '/video-services/grok-video-0ebe067e-c8e9-4194-8c72-ba0c20d4554b.mp4',
  },
  {
    title: 'Publicités émotionnelles',
    description: `Des mini-films publicitaires qui touchent le cœur. On raconte votre histoire, vos valeurs, vos émotions — pas juste vos produits.`,
    videoUrl: '/video-services/grok-video-40cb644e-8917-476c-9776-f2509820945f.mp4',
  },
  {
    title: 'Storytelling & Scénarisation',
    description: `Un bon produit ne suffit pas. Il faut une histoire. On écrit pour vous des scripts courts, puissants, et adaptés à votre cible.`,
    videoUrl: '/video-services/grok-video-4d3590d7-6ce1-44c8-bf7f-9c124c99c77d.mp4',
  },
  {
    title: 'Montage & Optimisation Ads',
    description: `Des vidéos calibrées pour la performance. Rythme, cadrage, hook, call-to-action — tout est pensé pour la conversion.`,
    videoUrl: '/video-services/grok-video-5bbd6eb8-30f8-4666-a3ba-14c2f390493a.mp4',
  },
  {
    title: 'Design sonore & voix-off émotionnelle',
    description: `Le son est 50 % d’une pub réussie. On crée des paysages sonores immersifs, des voix-off naturelles ou inspirantes, et des musiques sur mesure qui donnent de la profondeur à vos vidéos.`,
    videoUrl: '/video-services/grok-video-a991634c-e793-459f-af74-7e53a9bced85.mp4',
  },
  {
    title: 'Branding & Identité visuelle',
    description: `Votre marque mérite une image forte. On crée une direction artistique cohérente — logo, charte, moodboard — pour que vos pubs aient une vraie identité reconnaissable.`,
    videoUrl: '/video-services/grok-video-d30417ce-23de-44f1-ae83-2ed7555637b0.mp4',
  },
];

export const newWhyChooseUsPillars = [
  {
    title: 'Créativité mesurable',
    description: `Chaque contenu est pensé pour performer. Du hook à la dernière seconde, tout est calibré pour retenir l'attention et générer du résultat.`,
  },
  {
    title: 'Authenticité avant tout',
    description: `Nous ne faisons pas semblant. Nos vidéos respirent le vrai — des visages, des gestes, des émotions.`,
  },
  {
    title: 'Expérience multisensorielle',
    description: `Nos créations ne se regardent pas. Elles se vivent. Grâce à un storytelling et une mise en scène inspirés du cinéma.`,
  },
  {
    title: 'Collaboration fluide',
    description: `Vous n’êtes pas un client. Vous êtes un co-créateur. Chaque projet est une conversation entre votre vision et notre sens artistique.`,
  },
];

export const clientNames = [
  "Elara",
  "Freshyo",
  "Noyra",
  "AquaPure",
  "Elyne",
  "Yeshveda",
  "Veral",
  "Lumen Gold",
  "Purewave",
  "Skincare",
  "Sunbliss",
  "Verdélia",
  "Bluff",
  "Seven Plus",
  "Aines Fresh",
  "Aloevita",
  "Yoyo",
  "Nescafé"
];

export const testimonials = [
  { id: 1, quote: `Netpub a transformé notre stratégie de contenu. Leurs vidéos UGC sont incroyablement performantes !`, author: "Marie Dubois", company: "Marketing Manager, MyBeautyBox", rating: 5 },
  { id: 2, quote: `Le spot 4K qu'ils ont produit pour nous est d'une qualité exceptionnelle. Le ROI a dépassé toutes nos attentes.`, author: "Julien Bernard", company: "CEO, Extreme Sports Gear", rating: 5 },
  { id: 3, quote: `Une équipe réactive, créative et qui comprend vraiment les enjeux du social media. Je recommande vivement.`, author: "Sophie Martin", company: "Fondatrice, Gourmet Inc.", rating: 5 },
  { id: 4, quote: `La collaboration a été fluide et le résultat final est juste parfait. Ils ont su capturer l'essence de notre marque.`, author: "Lucas Garcia", company: "Directeur Artistique, StreetStyle Co.", rating: 4 },
  { id: 5, quote: `Enfin une agence qui allie créativité et data. Leur approche stratégique a fait toute la différence.`, author: "Chloé Petit", company: "Responsable Growth, TechGadget", rating: 5 },
];

export const teamMembers = [
  { name: 'Alexandre Moreau', role: 'Fondateur & Stratège', bio: `Avec 10 ans d'expérience en marketing digital, Alexandre est le cerveau derrière nos stratégies percutantes.`, funFact: `Toujours à la recherche du prochain meme viral.`, imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Camille Lefèvre', role: 'Directrice de Production', bio: `Camille orchestre chaque projet avec une main de maître, garantissant une qualité irréprochable et le respect des délais.`, funFact: `Peut réciter les 50 premières décimales de Pi.`, imageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Léo Dubois', role: 'Réalisateur & Monteur Principal', bio: `L'œil artistique de l'équipe. Léo transforme les concepts en images puissantes et captivantes.`, funFact: `Collectionne les vieilles caméras argentiques.`, imageUrl: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Juliette Rousseau', role: 'Responsable Créateurs UGC', bio: `Juliette déniche les talents et gère notre communauté de créateurs pour des contenus authentiques et engageants.`, funFact: `A un chat qui a plus de followers qu'elle.`, imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

export const companyStats = [
  { value: 120, label: 'Vidéos Créées', suffix: '+' },
  { value: 40, label: 'Marques Accompagnées', suffix: '+' },
  { value: 3, label: 'Pays Touchés', suffix: '' },
  { value: 98, label: 'Clients Satisfaits', suffix: '%' },
];

export const ourValues = [
  { icon: '🎨', title: 'Créativité Authentique', description: `Nous puisons dans l'authenticité pour créer des concepts qui marquent les esprits.` },
  { icon: '⚡', title: 'Impact Mesurable', description: `Chaque création est pensée pour atteindre vos objectifs et générer un retour sur investissement clair.` },
  { icon: '🤝', title: 'Collaboration Humaine', description: `Nous croyons en la co-création avec nos clients pour des résultats qui ont du sens.` },
  { icon: '💡', title: 'Vision Moderne', description: `Nous sommes constamment à l'affût des dernières tendances pour garder votre marque pertinente.` },
];

export const ourMethod = [
  { step: '01', title: 'Écoute & Stratégie', description: `Tout commence par une compréhension profonde de vos besoins et de votre audience.` },
  { step: '02', title: 'Création & Tournage', description: `Nous donnons vie au concept avec notre réseau de créateurs et notre équipe de production.` },
  { step: '03', title: 'Montage & Optimisation', description: `La post-production est là où la magie opère, en optimisant chaque détail pour la performance.` },
  { step: '04', title: 'Livraison & Suivi', description: `Nous livrons les vidéos prêtes à être diffusées et analysons les résultats pour itérer.` },
];
export const featuredProjectIds = [24, 29, 31, 35, 82, 7, 8, 41, 52, 18];