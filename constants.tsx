import { PortfolioCategory, PortfolioProject, Comment } from './types';

export const portfolioProjects: PortfolioProject[] = [
  { id: 1, title: 'Photo UGC - 1', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/1.png', mediaType: 'image', likes: 150, comments: [], hashtags: ['UGC', 'Photo'] },
  { id: 2, title: 'Photo UGC - 10', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/10.png', mediaType: 'image', likes: 230, comments: [], hashtags: ['UGC', 'Photo'] },
  { id: 3, title: 'Photo UGC - 2', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/2.png', mediaType: 'image', likes: 180, comments: [], hashtags: ['UGC', 'Photo'] },
  { id: 4, title: 'Photo UGC - 3', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/3.png', mediaType: 'image', likes: 320, comments: [], hashtags: ['UGC', 'Photo'] },
  { id: 5, title: 'Photo UGC - 4', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/4.png', mediaType: 'image', likes: 120, comments: [], hashtags: ['UGC', 'Photo'] },
  { id: 6, title: 'Photo UGC - 5', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/5.png', mediaType: 'image', likes: 210, comments: [], hashtags: ['UGC', 'Photo'] },
  { id: 7, title: 'Photo UGC - 6', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/6.png', mediaType: 'image', likes: 190, comments: [], hashtags: ['UGC', 'Photo'] },
  { id: 8, title: 'Photo UGC - 7', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/7.png', mediaType: 'image', likes: 280, comments: [], hashtags: ['UGC', 'Photo'] },
  { id: 9, title: 'Photo UGC - 8', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/8.png', mediaType: 'image', likes: 160, comments: [], hashtags: ['UGC', 'Photo'] },
  { id: 10, title: 'Photo UGC - 9', category: PortfolioCategory.PHOTO_UGC, mediaUrl: '/images/photo-ugc/9.png', mediaType: 'image', likes: 250, comments: [], hashtags: ['UGC', 'Photo'] },

  { id: 11, title: 'Photo Mode - 1', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/1.png', mediaType: 'image', likes: 450, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 12, title: 'Photo Mode - 10', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/10.png', mediaType: 'image', likes: 380, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 13, title: 'Photo Mode - 11', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/11.png', mediaType: 'image', likes: 520, comments: [], hashtags: ['Mode', 'Photo', 'Studio'] },
  { id: 14, title: 'Photo Mode - 12', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/12.png', mediaType: 'image', likes: 410, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 15, title: 'Photo Mode - 13', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/13.png', mediaType: 'image', likes: 480, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 16, title: 'Photo Mode - 14', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/14.png', mediaType: 'image', likes: 390, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 17, title: 'Photo Mode - 15', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/15.png', mediaType: 'image', likes: 550, comments: [], hashtags: ['Mode', 'Photo', 'Studio'] },
  { id: 18, title: 'Photo Mode - 16', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/16.png', mediaType: 'image', likes: 420, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 19, title: 'Photo Mode - 17', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/17.png', mediaType: 'image', likes: 470, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 20, title: 'Photo Mode - 18', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/18.png', mediaType: 'image', likes: 360, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 21, title: 'Photo Mode - 19', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/19.png', mediaType: 'image', likes: 510, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 22, title: 'Photo Mode - 2', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/2.png', mediaType: 'image', likes: 430, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 23, title: 'Photo Mode - 20', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/20.png', mediaType: 'image', likes: 400, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 24, title: 'Photo Mode - 3', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/3.png', mediaType: 'image', likes: 460, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 25, title: 'Photo Mode - 4', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/4.png', mediaType: 'image', likes: 440, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 26, title: 'Photo Mode - 5', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/5.png', mediaType: 'image', likes: 530, comments: [], hashtags: ['Mode', 'Photo', 'Studio'] },
  { id: 27, title: 'Photo Mode - 6', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/6.png', mediaType: 'image', likes: 490, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 28, title: 'Photo Mode - 7', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/7.png', mediaType: 'image', likes: 500, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 29, title: 'Photo Mode - 8', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/8.png', mediaType: 'image', likes: 370, comments: [], hashtags: ['Mode', 'Photo'] },
  { id: 30, title: 'Photo Mode - 9', category: PortfolioCategory.PHOTO_MODE, mediaUrl: '/images/photo-mode/9.png', mediaType: 'image', likes: 480, comments: [], hashtags: ['Mode', 'Photo'] },

  { id: 31, title: 'Photo Spot Publicitaire - 1', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/1.png', mediaType: 'image', likes: 600, comments: [], hashtags: ['Spot', 'Photo', '4K'] },
  { id: 32, title: 'Photo Spot Publicitaire - 5', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/5.png', mediaType: 'image', likes: 750, comments: [], hashtags: ['Spot', 'Photo', '4K'] },
  { id: 33, title: 'Photo Spot Publicitaire - 6', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/6.png', mediaType: 'image', likes: 680, comments: [], hashtags: ['Spot', 'Photo', '4K'] },
  { id: 34, title: 'Photo Spot Publicitaire - 7', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/7.png', mediaType: 'image', likes: 820, comments: [], hashtags: ['Spot', 'Photo', '4K'] },
  { id: 35, title: 'Photo Spot Publicitaire - 8', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/8.png', mediaType: 'image', likes: 710, comments: [], hashtags: ['Spot', 'Photo', '4K'] },
  { id: 36, title: 'Photo Spot Publicitaire - B1c40a98359ba76cc120e4f9a99fe51c', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/b1c40a98359ba76cc120e4f9a99fe51c.jpg', mediaType: 'image', likes: 900, comments: [], hashtags: ['Spot', 'Photo', '4K'] },
  { id: 37, title: 'Photo Spot Publicitaire - Drinks Product Manipulation Social Media Ads (1)', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/Drinks Product Manipulation Social Media Ads (1).jpeg', mediaType: 'image', likes: 1200, comments: [], hashtags: ['Spot', 'Photo', 'Social Media'] },
  { id: 38, title: 'Photo Spot Publicitaire - Drinks Product Manipulation Social Media Ads (2)', category: PortfolioCategory.PHOTO_SPOT_PUBLICITAIRE, mediaUrl: '/images/photo-spot-4k/Drinks Product Manipulation Social Media Ads (2).jpeg', mediaType: 'image', likes: 1100, comments: [], hashtags: ['Spot', 'Photo', 'Social Media'] },

  { id: 39, title: 'Vidéo UGC - 3c79330e-563e-4e9d-b24a-711f56208acb', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/3c79330e-563e-4e9d-b24a-711f56208acb.mp4', videoUrl: '/Video/vidéo-ugc/3c79330e-563e-4e9d-b24a-711f56208acb.mp4', mediaType: 'video', likes: 250, comments: [], hashtags: ['UGC', 'Vidéo'] },
  { id: 40, title: 'Vidéo UGC - 74819d18-2b1e-451d-805c-10470c4125f6', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/74819d18-2b1e-451d-805c-10470c4125f6.mp4', videoUrl: '/Video/vidéo-ugc/74819d18-2b1e-451d-805c-10470c4125f6.mp4', mediaType: 'video', likes: 350, comments: [], hashtags: ['UGC', 'Vidéo'] },
  { id: 41, title: 'Vidéo UGC - 7e0f6779-92ee-4038-8f63-42afa0132f03', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/7e0f6779-92ee-4038-8f63-42afa0132f03.mp4', videoUrl: '/Video/vidéo-ugc/7e0f6779-92ee-4038-8f63-42afa0132f03.mp4', mediaType: 'video', likes: 300, comments: [], hashtags: ['UGC', 'Vidéo'] },
  { id: 42, title: 'Vidéo UGC - 7e420654-703c-4ac0-9fc3-a7ca8b62baff', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/7e420654-703c-4ac0-9fc3-a7ca8b62baff.mp4', videoUrl: '/Video/vidéo-ugc/7e420654-703c-4ac0-9fc3-a7ca8b62baff.mp4', mediaType: 'video', likes: 420, comments: [], hashtags: ['UGC', 'Vidéo'] },
  { id: 43, title: 'Vidéo UGC - 96dcd814-2076-4177-968f-7b90afcd7c9d', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/96dcd814-2076-4177-968f-7b90afcd7c9d.mp4', videoUrl: '/Video/vidéo-ugc/96dcd814-2076-4177-968f-7b90afcd7c9d.mp4', mediaType: 'video', likes: 280, comments: [], hashtags: ['UGC', 'Vidéo'] },
  { id: 44, title: 'Vidéo UGC - 97937690-10ff-4f20-a68e-4364201aa092', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/97937690-10ff-4f20-a68e-4364201aa092.mp4', videoUrl: '/Video/vidéo-ugc/97937690-10ff-4f20-a68e-4364201aa092.mp4', mediaType: 'video', likes: 380, comments: [], hashtags: ['UGC', 'Vidéo'] },
  { id: 45, title: 'Vidéo UGC - 9cebe6a0-f630-403a-b433-00e67544b07a', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/9cebe6a0-f630-403a-b433-00e67544b07a.mp4', videoUrl: '/Video/vidéo-ugc/9cebe6a0-f630-403a-b433-00e67544b07a.mp4', mediaType: 'video', likes: 320, comments: [], hashtags: ['UGC', 'Vidéo'] },
  { id: 46, title: 'Vidéo UGC - Ac71f3df-b854-4985-9238-239bde3a07ee', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/ac71f3df-b854-4985-9238-239bde3a07ee.mp4', videoUrl: '/Video/vidéo-ugc/ac71f3df-b854-4985-9238-239bde3a07ee.mp4', mediaType: 'video', likes: 450, comments: [], hashtags: ['UGC', 'Vidéo'] },
  { id: 47, title: 'Vidéo UGC - Afe567f7-ff44-464f-bd17-e99d53c7670f', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/afe567f7-ff44-464f-bd17-e99d53c7670f.mp4', videoUrl: '/Video/vidéo-ugc/afe567f7-ff44-464f-bd17-e99d53c7670f.mp4', mediaType: 'video', likes: 290, comments: [], hashtags: ['UGC', 'Vidéo'] },
  { id: 48, title: 'Vidéo UGC - D001fc0a-8190-4d6a-a0d9-fd0e767e53b5', category: PortfolioCategory.VIDEO_UGC, mediaUrl: '/Video/vidéo-ugc/d001fc0a-8190-4d6a-a0d9-fd0e767e53b5.mp4', videoUrl: '/Video/vidéo-ugc/d001fc0a-8190-4d6a-a0d9-fd0e767e53b5.mp4', mediaType: 'video', likes: 400, comments: [], hashtags: ['UGC', 'Vidéo'] },

  { id: 49, title: 'Vidéo Mode - Design sans titre (1)', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/Design sans titre (1).mp4', videoUrl: '/Video/video-mode/Design sans titre (1).mp4', mediaType: 'video', likes: 550, comments: [], hashtags: ['Mode', 'Vidéo'] },
  { id: 50, title: 'Vidéo Mode - Design sans titre (2)', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/Design sans titre (2).mp4', videoUrl: '/Video/video-mode/Design sans titre (2).mp4', mediaType: 'video', likes: 600, comments: [], hashtags: ['Mode', 'Vidéo'] },
  { id: 51, title: 'Vidéo Mode - Design sans titre (3)', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/Design sans titre (3).mp4', videoUrl: '/Video/video-mode/Design sans titre (3).mp4', mediaType: 'video', likes: 580, comments: [], hashtags: ['Mode', 'Vidéo'] },
  { id: 52, title: 'Vidéo Mode - Design sans titre', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/Design sans titre.mp4', videoUrl: '/Video/video-mode/Design sans titre.mp4', mediaType: 'video', likes: 620, comments: [], hashtags: ['Mode', 'Vidéo'] },
  { id: 53, title: 'Vidéo Mode - Grok-video-033848e5-2141-4d02-8382-e0a57d2808d0', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-033848e5-2141-4d02-8382-e0a57d2808d0.mp4', videoUrl: '/Video/video-mode/grok-video-033848e5-2141-4d02-8382-e0a57d2808d0.mp4', mediaType: 'video', likes: 700, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 54, title: 'Vidéo Mode - Grok-video-0c771663-ccee-46f6-ad1c-adb92c3cb23c', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-0c771663-ccee-46f6-ad1c-adb92c3cb23c.mp4', videoUrl: '/Video/video-mode/grok-video-0c771663-ccee-46f6-ad1c-adb92c3cb23c.mp4', mediaType: 'video', likes: 720, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 55, title: 'Vidéo Mode - Grok-video-22fd629e-1261-4c24-864b-37120399eb5a', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-22fd629e-1261-4c24-864b-37120399eb5a.mp4', videoUrl: '/Video/video-mode/grok-video-22fd629e-1261-4c24-864b-37120399eb5a.mp4', mediaType: 'video', likes: 680, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 56, title: 'Vidéo Mode - Grok-video-28b3410d-2442-49e5-95c4-2ada1a75f609', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-28b3410d-2442-49e5-95c4-2ada1a75f609.mp4', videoUrl: '/Video/video-mode/grok-video-28b3410d-2442-49e5-95c4-2ada1a75f609.mp4', mediaType: 'video', likes: 750, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 57, title: 'Vidéo Mode - Grok-video-2ba5b004-2afd-4b83-b7d3-c367410641d7', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-2ba5b004-2afd-4b83-b7d3-c367410641d7.mp4', videoUrl: '/Video/video-mode/grok-video-2ba5b004-2afd-4b83-b7d3-c367410641d7.mp4', mediaType: 'video', likes: 690, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 58, title: 'Vidéo Mode - Grok-video-30dfd8a9-31da-42f0-9afb-90eb5f9331be (1)', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-30dfd8a9-31da-42f0-9afb-90eb5f9331be (1).mp4', videoUrl: '/Video/video-mode/grok-video-30dfd8a9-31da-42f0-9afb-90eb5f9331be (1).mp4', mediaType: 'video', likes: 800, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 59, title: 'Vidéo Mode - Grok-video-499bfa72-73d0-466c-8f65-1a9d04507c9d (1)', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-499bfa72-73d0-466c-8f65-1a9d04507c9d (1).mp4', videoUrl: '/Video/video-mode/grok-video-499bfa72-73d0-466c-8f65-1a9d04507c9d (1).mp4', mediaType: 'video', likes: 820, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 60, title: 'Vidéo Mode - Grok-video-52c9befe-0cf6-466c-811d-69a4064fafa4', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-52c9befe-0cf6-466c-811d-69a4064fafa4.mp4', videoUrl: '/Video/video-mode/grok-video-52c9befe-0cf6-466c-811d-69a4064fafa4.mp4', mediaType: 'video', likes: 780, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 61, title: 'Vidéo Mode - Grok-video-55afd371-b618-495d-a81d-192bc05f724d', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-55afd371-b618-495d-a81d-192bc05f724d.mp4', videoUrl: '/Video/video-mode/grok-video-55afd371-b618-495d-a81d-192bc05f724d.mp4', mediaType: 'video', likes: 760, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 62, title: 'Vidéo Mode - Grok-video-5b8af8bb-97d6-4f67-9a3f-74ab950cd036 (2)', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-5b8af8bb-97d6-4f67-9a3f-74ab950cd036 (2).mp4', videoUrl: '/Video/video-mode/grok-video-5b8af8bb-97d6-4f67-9a3f-74ab950cd036 (2).mp4', mediaType: 'video', likes: 850, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 63, title: 'Vidéo Mode - Grok-video-84767b1a-2152-42b6-828e-7f54ad620b62', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-84767b1a-2152-42b6-828e-7f54ad620b62.mp4', videoUrl: '/Video/video-mode/grok-video-84767b1a-2152-42b6-828e-7f54ad620b62.mp4', mediaType: 'video', likes: 790, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 64, title: 'Vidéo Mode - Grok-video-86348c6f-5282-4c8f-87dc-e888190bdfaf (1)', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-86348c6f-5282-4c8f-87dc-e888190bdfaf (1).mp4', videoUrl: '/Video/video-mode/grok-video-86348c6f-5282-4c8f-87dc-e888190bdfaf (1).mp4', mediaType: 'video', likes: 880, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 65, title: 'Vidéo Mode - Grok-video-8e42b978-16ee-4e48-b531-7eadaed38291', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-8e42b978-16ee-4e48-b531-7eadaed38291.mp4', videoUrl: '/Video/video-mode/grok-video-8e42b978-16ee-4e48-b531-7eadaed38291.mp4', mediaType: 'video', likes: 810, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 66, title: 'Vidéo Mode - Grok-video-a0b3ee2f-2993-4694-8c65-dd6638e858a5', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-a0b3ee2f-2993-4694-8c65-dd6638e858a5.mp4', videoUrl: '/Video/video-mode/grok-video-a0b3ee2f-2993-4694-8c65-dd6638e858a5.mp4', mediaType: 'video', likes: 900, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 67, title: 'Vidéo Mode - Grok-video-a4fc99e2-1a08-4711-9b31-0c828b0dd1b0', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-a4fc99e2-1a08-4711-9b31-0c828b0dd1b0.mp4', videoUrl: '/Video/video-mode/grok-video-a4fc99e2-1a08-4711-9b31-0c828b0dd1b0.mp4', mediaType: 'video', likes: 830, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 68, title: 'Vidéo Mode - Grok-video-b884a0d8-129d-4ed2-b931-2b29ee759411', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-b884a0d8-129d-4ed2-b931-2b29ee759411.mp4', videoUrl: '/Video/video-mode/grok-video-b884a0d8-129d-4ed2-b931-2b29ee759411.mp4', mediaType: 'video', likes: 920, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 69, title: 'Vidéo Mode - Grok-video-c2ae4b25-7b42-4692-8a94-31923e8dd9b6', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-c2ae4b25-7b42-4692-8a94-31923e8dd9b6.mp4', videoUrl: '/Video/video-mode/grok-video-c2ae4b25-7b42-4692-8a94-31923e8dd9b6.mp4', mediaType: 'video', likes: 860, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 70, title: 'Vidéo Mode - Grok-video-c2c466bf-6437-4589-b819-eff7ef7053fc', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-c2c466bf-6437-4589-b819-eff7ef7053fc.mp4', videoUrl: '/Video/video-mode/grok-video-c2c466bf-6437-4589-b819-eff7ef7053fc.mp4', mediaType: 'video', likes: 950, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 71, title: 'Vidéo Mode - Grok-video-d2bb49fc-6611-4dd9-8a9d-78e162f76e47 (1)', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-d2bb49fc-6611-4dd9-8a9d-78e162f76e47 (1).mp4', videoUrl: '/Video/video-mode/grok-video-d2bb49fc-6611-4dd9-8a9d-78e162f76e47 (1).mp4', mediaType: 'video', likes: 980, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 72, title: 'Vidéo Mode - Grok-video-da58b1f4-5d55-420e-a077-5b6d0be0bd77 (1)', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-da58b1f4-5d55-420e-a077-5b6d0be0bd77 (1).mp4', videoUrl: '/Video/video-mode/grok-video-da58b1f4-5d55-420e-a077-5b6d0be0bd77 (1).mp4', mediaType: 'video', likes: 1000, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },
  { id: 73, title: 'Vidéo Mode - Grok-video-f7649e66-8c2e-4503-b4ad-f59bb291c525 (1)', category: PortfolioCategory.VIDEO_MODE, mediaUrl: '/Video/video-mode/grok-video-f7649e66-8c2e-4503-b4ad-f59bb291c525 (1).mp4', videoUrl: '/Video/video-mode/grok-video-f7649e66-8c2e-4503-b4ad-f59bb291c525 (1).mp4', mediaType: 'video', likes: 1100, comments: [], hashtags: ['Mode', 'Vidéo', 'AI'] },

  { id: 74, title: 'Spot Publicitaire 4K - 2e018f13-68ee-421e-844a-ce916bcb235a', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/2e018f13-68ee-421e-844a-ce916bcb235a.mp4', videoUrl: '/Video/spot-publicitaire-video/2e018f13-68ee-421e-844a-ce916bcb235a.mp4', mediaType: 'video', likes: 1500, comments: [], hashtags: ['Spot', 'Vidéo', '4K'] },
  { id: 75, title: 'Spot Publicitaire 4K - 38830a2d-df41-46e9-aa19-5934868e1deb', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/38830a2d-df41-46e9-aa19-5934868e1deb.mp4', videoUrl: '/Video/spot-publicitaire-video/38830a2d-df41-46e9-aa19-5934868e1deb.mp4', mediaType: 'video', likes: 1600, comments: [], hashtags: ['Spot', 'Vidéo', '4K'] },
  { id: 76, title: 'Spot Publicitaire 4K - 43d53c0f-d211-48d9-a6ee-c6d9c5f3bd4d', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/43d53c0f-d211-48d9-a6ee-c6d9c5f3bd4d.mp4', videoUrl: '/Video/spot-publicitaire-video/43d53c0f-d211-48d9-a6ee-c6d9c5f3bd4d.mp4', mediaType: 'video', likes: 1550, comments: [], hashtags: ['Spot', 'Vidéo', '4K'] },
  { id: 77, title: 'Spot Publicitaire 4K - 479ed287-ead9-460f-8cde-30f41b30aac3', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/479ed287-ead9-460f-8cde-30f41b30aac3.mp4', videoUrl: '/Video/spot-publicitaire-video/479ed287-ead9-460f-8cde-30f41b30aac3.mp4', mediaType: 'video', likes: 1700, comments: [], hashtags: ['Spot', 'Vidéo', '4K'] },
  { id: 78, title: 'Spot Publicitaire 4K - 57ea4bec-710d-497b-a1d4-e28c60ee153f', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/57ea4bec-710d-497b-a1d4-e28c60ee153f.mp4', videoUrl: '/Video/spot-publicitaire-video/57ea4bec-710d-497b-a1d4-e28c60ee153f.mp4', mediaType: 'video', likes: 1650, comments: [], hashtags: ['Spot', 'Vidéo', '4K'] },
  { id: 79, title: 'Spot Publicitaire 4K - 78f55824-1b8a-49f0-a9a7-de333a3e6fdc', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/78f55824-1b8a-49f0-a9a7-de333a3e6fdc.mp4', videoUrl: '/Video/spot-publicitaire-video/78f55824-1b8a-49f0-a9a7-de333a3e6fdc.mp4', mediaType: 'video', likes: 1800, comments: [], hashtags: ['Spot', 'Vidéo', '4K'] },
  { id: 80, title: 'Spot Publicitaire 4K - 9ab3cf45-2c89-43ec-bd30-74dfbfe8fd85', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/9ab3cf45-2c89-43ec-bd30-74dfbfe8fd85.mp4', videoUrl: '/Video/spot-publicitaire-video/9ab3cf45-2c89-43ec-bd30-74dfbfe8fd85.mp4', mediaType: 'video', likes: 1750, comments: [], hashtags: ['Spot', 'Vidéo', '4K'] },
  { id: 81, title: 'Spot Publicitaire 4K - B8bcb63f-e704-42f2-b0d5-a4475c789ad2', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/b8bcb63f-e704-42f2-b0d5-a4475c789ad2.mp4', videoUrl: '/Video/spot-publicitaire-video/b8bcb63f-e704-42f2-b0d5-a4475c789ad2.mp4', mediaType: 'video', likes: 1900, comments: [], hashtags: ['Spot', 'Vidéo', '4K'] },
  { id: 82, title: 'Spot Publicitaire 4K - Bcfd36a3-9ef7-4e84-b621-de6e850d5123', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/bcfd36a3-9ef7-4e84-b621-de6e850d5123.mp4', videoUrl: '/Video/spot-publicitaire-video/bcfd36a3-9ef7-4e84-b621-de6e850d5123.mp4', mediaType: 'video', likes: 1850, comments: [], hashtags: ['Spot', 'Vidéo', '4K'] },
  { id: 83, title: 'Spot Publicitaire 4K - Fb9dbcf5-6d67-45ab-b759-165745ad963c', category: PortfolioCategory.VIDEO_SPOT_PUBLICITAIRE, mediaUrl: '/Video/spot-publicitaire-video/fb9dbcf5-6d67-45ab-b759-165745ad963c.mp4', videoUrl: '/Video/spot-publicitaire-video/fb9dbcf5-6d67-45ab-b759-165745ad963c.mp4', mediaType: 'video', likes: 2000, comments: [], hashtags: ['Spot', 'Vidéo', '4K'] }
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

export const clientNames = ['Gourmet Inc.', 'StreetStyle Co.', 'TechGadget', 'Extreme Sports Gear', 'GreenLife Organics', 'Chef at Home', 'Élégance Paris', 'MyBeautyBox', 'Volt', 'Startup Innovante'];

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
export const featuredProjectIds = [24, 29, 31, 35, 82, 7, 8, 41, 52, 66, 72, 18];

