export const MOCK_USERS = [
  { id: "1", _id: "1", fullName: "Ahmed Hassan", username: "ahmed_h", email: "ahmed@demo.com", bio: "Full-stack developer & open-source enthusiast", location: "Cairo, Egypt", accountType: "personal", role: "user", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" },
  { id: "2", _id: "2", fullName: "Sara Mohamed", username: "sara_m", email: "sara@demo.com", bio: "UX Designer | Making the web beautiful", location: "Alexandria, Egypt", accountType: "personal", role: "user", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" },
  { id: "3", _id: "3", fullName: "Omar Khalil", username: "omar_k", email: "omar@demo.com", bio: "Data Scientist | AI Researcher", location: "Dubai, UAE", accountType: "personal", role: "user", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar" },
  { id: "4", _id: "4", fullName: "TechVenture Admin", username: "techventure", email: "admin@techventure.com", bio: "Leading tech startup incubator", location: "Cairo, Egypt", accountType: "business", role: "business", avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=TechVenture" },
];

export const MOCK_POSTS = [
  {
    id: "p1",
    authorId: "1",
    author: MOCK_USERS[0],
    content: "Just deployed our new AI-powered recommendation engine! 🚀 The model accuracy improved by 34% compared to our previous approach. #AI #MachineLearning #TechInnovation",
    tag: "Technology",
    upvotesCount: 45,
    commentsCount: 12,
    createdAt: new Date().toISOString(),
    isTrending: true
  },
  {
    id: "p2",
    authorId: "2",
    author: MOCK_USERS[1],
    content: "Hot take: The future of web development is server components. We've been building with Next.js App Router for 6 months and the DX improvement is incredible. #WebDev #NextJS #React",
    tag: "Technology",
    upvotesCount: 89,
    commentsCount: 5,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isTrending: false
  },
  {
    id: "p3",
    authorId: "4",
    author: MOCK_USERS[3],
    content: "Raised our Series A! $5M to scale our sustainable packaging solution across the MENA region. Grateful for our investors. 🌱💰 #Startup #Funding #Sustainability",
    tag: "Business",
    upvotesCount: 156,
    commentsCount: 22,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    isTrending: true
  }
];

export const MOCK_COMMUNITIES = [
  { id: "c1", name: "Startup Founders", description: "A community for startup founders to share ideas, challenges, and wins.", category: "Business", memberCount: 1240, coverImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80" },
  { id: "c2", name: "AI & Machine Learning", description: "Discuss the latest in artificial intelligence and machine learning research.", category: "Technology", memberCount: 850, coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" },
  { id: "c3", name: "UI/UX Designers", description: "Share designs, get feedback, and discuss design trends.", category: "Design", memberCount: 2100, coverImage: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=800&q=80" },
];

export const MOCK_TRENDS = [
  { id: "t1", word: "artificial intelligence", count: 2450, status: "hot", dailyChange: 15.4 },
  { id: "t2", word: "green energy", count: 1890, status: "rising", dailyChange: 8.2 },
  { id: "t3", word: "remote work", count: 1200, status: "falling", dailyChange: -2.1 },
];
