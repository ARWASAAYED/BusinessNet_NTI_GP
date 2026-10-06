/**
 * Comprehensive Seed Script - Populates the entire database with demo data
 * Run: node scripts/seedAll.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Models
const User = require("../src/models/user");
const Business = require("../src/models/business");
const Post = require("../src/models/post");
const Comment = require("../src/models/comment");
const Community = require("../src/models/community");
const CommunityMember = require("../src/models/communityMember");
const Hashtag = require("../src/models/hashtag");
const Keyword = require("../src/models/keyword");
const Trend = require("../src/models/trend");
const Category = require("../src/models/category");
const Notification = require("../src/models/notification");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/capstone";

// ─── Helper ──────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

// ─── DATA ────────────────────────────────────────────────

const categoriesData = [
  { name: "Technology", description: "Software, AI, hardware, and emerging tech" },
  { name: "Business", description: "Strategy, management, and entrepreneurship" },
  { name: "Finance", description: "Banking, investing, and financial markets" },
  { name: "Marketing", description: "Digital marketing, branding, and advertising" },
  { name: "Education", description: "Learning, courses, and professional development" },
  { name: "Design", description: "UI/UX, graphic design, and creative arts" },
  { name: "Legal", description: "Law, compliance, and regulations" },
  { name: "Healthcare", description: "Medical, wellness, and health tech" },
];

const usersData = [
  // ── Personal Accounts ──
  { fullName: "Ahmed Hassan", username: "ahmed_h", email: "ahmed@demo.com", bio: "Full-stack developer & open-source enthusiast", location: "Cairo, Egypt", accountType: "personal", role: "user" },
  { fullName: "Sara Mohamed", username: "sara_m", email: "sara@demo.com", bio: "UX Designer | Making the web beautiful", location: "Alexandria, Egypt", accountType: "personal", role: "user" },
  { fullName: "Omar Khalil", username: "omar_k", email: "omar@demo.com", bio: "Data Scientist | AI Researcher", location: "Dubai, UAE", accountType: "personal", role: "user" },
  { fullName: "Nour Ali", username: "nour_a", email: "nour@demo.com", bio: "Marketing strategist & content creator", location: "Riyadh, KSA", accountType: "personal", role: "user" },
  { fullName: "Youssef Tarek", username: "youssef_t", email: "youssef@demo.com", bio: "Finance professional & angel investor", location: "Cairo, Egypt", accountType: "personal", role: "user" },
  { fullName: "Layla Hossam", username: "layla_h", email: "layla@demo.com", bio: "Software engineer @ FAANG", location: "London, UK", accountType: "personal", role: "creator" },
  { fullName: "Khaled Fathi", username: "khaled_f", email: "khaled@demo.com", bio: "Cybersecurity expert & ethical hacker", location: "Berlin, Germany", accountType: "personal", role: "user" },
  { fullName: "Mona Sayed", username: "mona_s", email: "mona@demo.com", bio: "Product Manager | Building great products", location: "Istanbul, Turkey", accountType: "personal", role: "user" },

  // ── Business Accounts ──
  { fullName: "TechVenture Admin", username: "techventure", email: "admin@techventure.com", bio: "Leading tech startup incubator", location: "Cairo, Egypt", accountType: "business", role: "business" },
  { fullName: "CloudNine Solutions", username: "cloudnine", email: "hello@cloudnine.com", bio: "Enterprise cloud solutions provider", location: "Dubai, UAE", accountType: "business", role: "business" },
  { fullName: "DesignHub Studio", username: "designhub", email: "team@designhub.com", bio: "Award-winning design agency", location: "Beirut, Lebanon", accountType: "business", role: "business" },
  { fullName: "GreenFinance Co", username: "greenfinance", email: "info@greenfinance.com", bio: "Sustainable investment solutions", location: "Amman, Jordan", accountType: "business", role: "business" },
  { fullName: "EduPro Academy", username: "edupro", email: "learn@edupro.com", bio: "Online professional development platform", location: "Cairo, Egypt", accountType: "business", role: "business" },

  // ── Admin ──
  { fullName: "Admin User", username: "admin", email: "admin@businessnet.com", bio: "Platform administrator", location: "HQ", accountType: "personal", role: "admin" },
];

const businessesData = [
  { name: "TechVenture", description: "Leading tech startup incubator helping entrepreneurs scale their ideas into successful businesses.", type: "company", industry: "Technology", companySize: "medium", website: "https://techventure.example.com", category: "Technology", verified: true, reputationScore: 88 },
  { name: "CloudNine Solutions", description: "Enterprise-grade cloud infrastructure and DevOps consulting for modern businesses.", type: "company", industry: "Technology", companySize: "small", website: "https://cloudnine.example.com", category: "Technology", verified: true, reputationScore: 82 },
  { name: "DesignHub Studio", description: "Award-winning digital design agency crafting beautiful user experiences.", type: "company", industry: "Design", companySize: "startup", website: "https://designhub.example.com", category: "Services", verified: false, reputationScore: 75 },
  { name: "GreenFinance Co", description: "Sustainable and ethical investment advisory for the modern investor.", type: "company", industry: "Finance", companySize: "small", website: "https://greenfinance.example.com", category: "Finance", verified: true, reputationScore: 91 },
  { name: "EduPro Academy", description: "Professional development and certification courses for career growth.", type: "company", industry: "Education", companySize: "medium", website: "https://edupro.example.com", category: "Education", verified: true, reputationScore: 85 },
];

const communitiesData = [
  { name: "Startup Founders", description: "A community for startup founders to share ideas, challenges, and wins.", category: "Business", isPrivate: false },
  { name: "AI & Machine Learning", description: "Discuss the latest in artificial intelligence and machine learning research.", category: "Technology", isPrivate: false },
  { name: "UI/UX Designers", description: "Share designs, get feedback, and discuss design trends.", category: "Design", isPrivate: false },
  { name: "FinTech Innovators", description: "Exploring the intersection of finance and technology.", category: "Finance", isPrivate: false },
  { name: "Cybersecurity Pros", description: "Security best practices, threat intelligence, and career advice.", category: "Technology", isPrivate: false },
  { name: "Remote Work Hub", description: "Tips, tools, and discussions for remote workers worldwide.", category: "Business", isPrivate: false },
  { name: "Marketing Masterminds", description: "Growth hacking, content marketing, and digital advertising strategies.", category: "Marketing", isPrivate: false },
  { name: "Code Review Club", description: "Submit your code for peer review and learn from others.", category: "Technology", isPrivate: true },
];

const postsContent = [
  // Technology
  { content: "Just deployed our new AI-powered recommendation engine! 🚀 The model accuracy improved by 34% compared to our previous approach. Key insights: transformer architecture + domain-specific fine-tuning = amazing results. #AI #MachineLearning #TechInnovation", category: "Technology" },
  { content: "Hot take: The future of web development is server components. We've been building with Next.js App Router for 6 months and the DX improvement is incredible. Server-side rendering with the flexibility of React? Yes please! #WebDev #NextJS #React", category: "Technology" },
  { content: "Cybersecurity tip of the day: Enable 2FA everywhere. I audited 50+ startups last quarter and 60% still don't enforce multi-factor authentication. This is the lowest-hanging fruit for security. 🔐 #CyberSecurity #InfoSec", category: "Technology" },
  { content: "Successfully migrated our entire infrastructure to Kubernetes. 200+ microservices, zero downtime. Here's what we learned along the way... 🧵 #DevOps #Kubernetes #CloudNative", category: "Technology" },
  { content: "The open-source community never ceases to amaze me. Just contributed to a project that helps visually impaired developers write code. Technology can truly change lives. ❤️ #OpenSource #Accessibility #TechForGood", category: "Technology" },

  // Business
  { content: "Raised our Series A! $5M to scale our sustainable packaging solution across the MENA region. Grateful for our investors who believe in eco-friendly business models. 🌱💰 #Startup #Funding #Sustainability", category: "Business" },
  { content: "Lesson learned after 3 years of running a startup: Your first 10 customers teach you more than any MBA program. Listen to them obsessively. #Entrepreneurship #StartupLife #BusinessLessons", category: "Business" },
  { content: "Just finished reading 'Zero to One' by Peter Thiel for the third time. Every read reveals new insights about building monopolies and thinking about the future. Highly recommend! 📚 #BusinessBooks #Innovation", category: "Business" },
  { content: "We hit 10,000 active users today! 🎉 Started with just 3 users (including my mom 😂). The key? Obsessive focus on user feedback and weekly iteration cycles. #Growth #ProductLed #SaaS", category: "Business" },

  // Finance
  { content: "Q4 2025 market analysis: ESG investments outperformed traditional portfolios by 12% in the MENA region. Sustainable investing isn't just ethical—it's profitable. 📊 #Finance #ESG #Investing", category: "Finance" },
  { content: "Cryptocurrency regulation is finally maturing. The new UAE framework provides clarity that institutional investors have been waiting for. This could be a game-changer for the region. #Crypto #FinTech #Regulation", category: "Finance" },
  { content: "Built a personal finance dashboard using Python and Plotly. Tracks expenses, investments, and net worth automatically. Sharing the template for free! 💸 #PersonalFinance #Python #DataViz", category: "Finance" },

  // Marketing
  { content: "Our latest content marketing campaign generated 500K impressions with zero ad spend. Secret sauce: authentic storytelling + user-generated content. Here's the framework we used... 🎯 #ContentMarketing #GrowthHacking #MarketingStrategy", category: "Marketing" },
  { content: "LinkedIn vs Twitter for B2B marketing in 2026: LinkedIn still wins for lead gen (3x conversion rate), but Twitter/X is better for brand awareness and thought leadership. Use both! #B2B #SocialMedia #Marketing", category: "Marketing" },

  // Design
  { content: "Redesigned our entire app using a glassmorphism design system. The subtle transparency effects with backdrop-blur create such an elegant feel. Check out the before/after! ✨ #UIDesign #Glassmorphism #DesignSystem", category: "Design" },
  { content: "Typography tip: Stop using more than 2 font families in your designs. Inter for body, Outfit for headings—that's all you need for a clean, professional look. #Typography #WebDesign #DesignTips", category: "Design" },

  // Education
  { content: "Just completed my AWS Solutions Architect certification! 3 months of studying while working full-time. If I can do it, so can you. Happy to share my study plan! 🎓 #AWS #Certification #CareerGrowth", category: "Education" },
  { content: "The best investment you can make is in yourself. I spent $2000 on courses last year and it led to a 40% salary increase. Education pays compound interest. 📈 #LearningNeverStops #ProfessionalDevelopment", category: "Education" },

  // General
  { content: "Networking isn't about collecting business cards—it's about building genuine relationships. The most valuable connections I've made came from helping others without expecting anything in return. 🤝 #Networking #ProfessionalGrowth", category: "General" },
  { content: "Work-life balance update: Started blocking 12-1pm daily for a walk. No phone, no notifications. Productivity actually INCREASED by 20%. Your brain needs rest to perform. 🧠 #WorkLifeBalance #Productivity #MentalHealth", category: "General" },
];

const hashtagsData = [
  { name: "ai", count: 245 },
  { name: "machinelearning", count: 189 },
  { name: "startup", count: 312 },
  { name: "entrepreneurship", count: 178 },
  { name: "webdev", count: 267 },
  { name: "react", count: 198 },
  { name: "nextjs", count: 156 },
  { name: "cybersecurity", count: 134 },
  { name: "fintech", count: 145 },
  { name: "marketing", count: 223 },
  { name: "uidesign", count: 167 },
  { name: "sustainability", count: 98 },
  { name: "cloudnative", count: 112 },
  { name: "devops", count: 156 },
  { name: "python", count: 289 },
  { name: "esg", count: 76 },
  { name: "growth", count: 201 },
  { name: "productled", count: 89 },
  { name: "remotework", count: 178 },
  { name: "careergrowth", count: 134 },
];

const commentsContent = [
  "Great insights! Thanks for sharing this 🙌",
  "This is exactly what I've been looking for. Very helpful!",
  "Couldn't agree more. We implemented something similar at our company.",
  "Interesting perspective. Have you considered the scalability aspect?",
  "Amazing work! Would love to connect and learn more about this.",
  "This resonates deeply. The industry needs more of this kind of thinking.",
  "Congrats on the achievement! 🎉 Well deserved.",
  "Practical advice that actually works. Bookmarked!",
  "I had the same experience. What tools did you use?",
  "Love the transparency here. More founders should share their journey like this.",
  "Solid analysis! The data really supports your argument.",
  "Just shared this with my team. Super relevant for us right now.",
  "This changed my perspective on the topic. Thank you!",
  "Well articulated! Looking forward to more content like this.",
  "Been following your work for a while. Consistently great content! 🔥",
];

// ─── SEED FUNCTIONS ──────────────────────────────────────

async function seedCategories() {
  console.log("📁 Seeding categories...");
  await Category.deleteMany({});
  const categories = await Category.insertMany(categoriesData);
  console.log(`   ✅ Created ${categories.length} categories`);
  return categories;
}

async function seedUsers() {
  console.log("👥 Seeding users...");
  await User.deleteMany({});
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Password123!", salt);

  const users = [];
  for (const userData of usersData) {
    const user = await User.create({
      ...userData,
      password: hashedPassword,
      reputationScore: randomInt(10, 95),
      isVerified: Math.random() > 0.5,
      aiTrustScore: parseFloat((Math.random() * 0.5 + 0.5).toFixed(2)),
    });
    users.push(user);
  }

  // Create follow relationships
  for (let i = 0; i < users.length; i++) {
    const followCount = randomInt(2, Math.min(6, users.length - 1));
    const others = users.filter((_, idx) => idx !== i);
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, followCount);
    for (const target of shuffled) {
      await User.findByIdAndUpdate(users[i]._id, { $addToSet: { following: target._id } });
      await User.findByIdAndUpdate(target._id, { $addToSet: { followers: users[i]._id } });
    }
  }

  console.log(`   ✅ Created ${users.length} users (password: Password123!)`);
  return users;
}

async function seedBusinesses(users) {
  console.log("🏢 Seeding businesses...");
  await Business.deleteMany({});

  const businessUsers = users.filter(u => u.accountType === "business");
  const businesses = [];

  for (let i = 0; i < businessesData.length && i < businessUsers.length; i++) {
    const biz = await Business.create({
      ...businessesData[i],
      userId: businessUsers[i]._id,
      followers: users.filter(u => u.accountType === "personal").slice(0, randomInt(2, 5)).map(u => u._id),
      metrics: {
        trustScore: randomInt(50, 95),
        innovationScore: randomInt(30, 90),
        engagementRate: parseFloat((Math.random() * 5 + 1).toFixed(2)),
        aiAuditScore: randomInt(60, 100),
      },
      offerings: [
        { name: "Consulting", description: "Expert consulting services", price: randomInt(500, 5000), category: "Services" },
        { name: "Premium Plan", description: "Full access to premium features", price: randomInt(99, 999), category: "Subscription" },
      ],
    });
    // Link business to user
    await User.findByIdAndUpdate(businessUsers[i]._id, { businessId: biz._id });
    businesses.push(biz);
  }

  console.log(`   ✅ Created ${businesses.length} businesses`);
  return businesses;
}

async function seedHashtags() {
  console.log("#️⃣  Seeding hashtags...");
  await Hashtag.deleteMany({});
  const hashtags = await Hashtag.insertMany(
    hashtagsData.map(h => ({ ...h, lastUsedAt: daysAgo(randomInt(0, 7)) }))
  );
  console.log(`   ✅ Created ${hashtags.length} hashtags`);
  return hashtags;
}

async function seedKeywordsAndTrends(hashtags) {
  console.log("📈 Seeding keywords & trends...");
  await Keyword.deleteMany({});
  await Trend.deleteMany({});

  const keywords = [];
  const trends = [];

  for (const h of hashtags) {
    const kw = await Keyword.create({
      word: h.name,
      category: pick(["Technology", "Business", "Finance", "Marketing", "Design", "Education"]),
      frequency: h.count,
      growthRate: parseFloat((Math.random() * 20 - 5).toFixed(2)),
      velocity: parseFloat((Math.random() * 10).toFixed(2)),
      avgSentiment: parseFloat((Math.random() * 2 - 1).toFixed(2)),
    });
    keywords.push(kw);

    const trend = await Trend.create({
      keywordId: kw._id,
      score: randomInt(10, 100),
      velocity: parseFloat((Math.random() * 10).toFixed(2)),
      sentiment: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      hypeRisk: parseFloat((Math.random()).toFixed(2)),
      status: pick(["rising", "hot", "falling"]),
      dailyChange: parseFloat((Math.random() * 30 - 5).toFixed(2)),
      weeklyHistory: Array.from({ length: 7 }, (_, i) => ({
        date: daysAgo(6 - i),
        score: randomInt(10, 100),
      })),
    });
    trends.push(trend);
  }

  console.log(`   ✅ Created ${keywords.length} keywords and ${trends.length} trends`);
  return { keywords, trends };
}

async function seedPosts(users, categories, hashtags) {
  console.log("📝 Seeding posts...");
  await Post.deleteMany({});

  const personalUsers = users.filter(u => u.accountType === "personal");
  const businessUsers = users.filter(u => u.accountType === "business");
  const posts = [];

  for (const postData of postsContent) {
    const isBusinessPost = Math.random() > 0.7 && businessUsers.length > 0;
    const author = isBusinessPost ? pick(businessUsers) : pick(personalUsers);
    const category = categories.find(c => c.name === postData.category) || pick(categories);

    // Pick 1–3 random hashtags
    const postHashtags = hashtags.sort(() => Math.random() - 0.5).slice(0, randomInt(1, 3));

    // Random upvotes from other users
    const upvoters = users.filter(u => !u._id.equals(author._id)).sort(() => Math.random() - 0.5).slice(0, randomInt(1, 8));

    const post = await Post.create({
      authorId: author._id,
      businessId: author.businessId || undefined,
      content: postData.content,
      categoryId: category._id,
      hashtags: postHashtags.map(h => h._id),
      tag: postData.category,
      upvotes: upvoters.map(u => u._id),
      upvotesCount: upvoters.length,
      impressions: randomInt(50, 2000),
      uniqueViews: randomInt(30, 1000),
      sentimentScore: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      authenticityScore: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)),
      relevanceScore: randomInt(40, 100),
      trendScore: randomInt(0, 80),
      isTrending: Math.random() > 0.7,
      aiKeywords: postHashtags.map(h => h.name),
      createdAt: daysAgo(randomInt(0, 30)),
    });

    // Update hashtag references
    for (const h of postHashtags) {
      await Hashtag.findByIdAndUpdate(h._id, { $addToSet: { posts: post._id } });
    }

    posts.push(post);
  }

  console.log(`   ✅ Created ${posts.length} posts`);
  return posts;
}

async function seedComments(users, posts) {
  console.log("💬 Seeding comments...");
  await Comment.deleteMany({});

  const comments = [];

  for (const post of posts) {
    const commentCount = randomInt(1, 5);
    for (let i = 0; i < commentCount; i++) {
      const author = pick(users.filter(u => !u._id.equals(post.authorId)));
      const likers = users.filter(u => !u._id.equals(author._id)).sort(() => Math.random() - 0.5).slice(0, randomInt(0, 4));

      const comment = await Comment.create({
        content: pick(commentsContent),
        post: post._id,
        author: author._id,
        likes: likers.map(u => u._id),
        createdAt: new Date(post.createdAt.getTime() + randomInt(1, 48) * 60 * 60 * 1000),
      });
      comments.push(comment);
    }

    // Update post comment count
    const count = comments.filter(c => c.post.equals(post._id)).length;
    await Post.findByIdAndUpdate(post._id, { commentsCount: count });
  }

  // Add some replies to existing comments
  const topComments = comments.slice(0, 10);
  for (const parentComment of topComments) {
    if (Math.random() > 0.5) {
      const author = pick(users);
      const reply = await Comment.create({
        content: pick(commentsContent),
        post: parentComment.post,
        author: author._id,
        parent: parentComment._id,
        likes: [],
      });
      comments.push(reply);
    }
  }

  console.log(`   ✅ Created ${comments.length} comments (including replies)`);
  return comments;
}

async function seedCommunities(users) {
  console.log("🏘️  Seeding communities...");
  await Community.deleteMany({});
  await CommunityMember.deleteMany({});

  const communities = [];
  const allMembers = [];

  for (const commData of communitiesData) {
    const creator = pick(users);
    const community = await Community.create({
      ...commData,
      creatorId: creator._id,
      moderators: [creator._id],
    });

    // Add creator as admin member
    await CommunityMember.create({
      userId: creator._id,
      communityId: community._id,
      role: "admin",
    });

    // Add 3-8 random members
    const memberCount = randomInt(3, 8);
    const potentialMembers = users.filter(u => !u._id.equals(creator._id));
    const members = potentialMembers.sort(() => Math.random() - 0.5).slice(0, memberCount);

    for (const member of members) {
      const cm = await CommunityMember.create({
        userId: member._id,
        communityId: community._id,
        role: Math.random() > 0.8 ? "moderator" : "member",
      });
      allMembers.push(cm);
    }

    communities.push(community);
  }

  console.log(`   ✅ Created ${communities.length} communities with ${allMembers.length} members`);
  return communities;
}

async function seedNotifications(users, posts) {
  console.log("🔔 Seeding notifications...");
  await Notification.deleteMany({});

  const notifs = [];
  const types = [
    { type: "like", title: "New Like", message: (sender) => `${sender} liked your post` },
    { type: "comment", title: "New Comment", message: (sender) => `${sender} commented on your post` },
    { type: "follow", title: "New Follower", message: (sender) => `${sender} started following you` },
    { type: "mention", title: "Mention", message: (sender) => `${sender} mentioned you in a post` },
    { type: "community", title: "Community Update", message: () => `New activity in your community` },
  ];

  for (let i = 0; i < 30; i++) {
    const recipient = pick(users);
    const sender = pick(users.filter(u => !u._id.equals(recipient._id)));
    const notifType = pick(types);

    const notif = await Notification.create({
      userId: recipient._id,
      sender: sender._id,
      type: notifType.type,
      title: notifType.title,
      message: notifType.message(sender.fullName),
      link: notifType.type === "like" || notifType.type === "comment" ? `/post/${pick(posts)._id}` : `/profile/${sender._id}`,
      referenceId: pick(posts)._id,
      isRead: Math.random() > 0.6,
      createdAt: daysAgo(randomInt(0, 14)),
    });
    notifs.push(notif);
  }

  console.log(`   ✅ Created ${notifs.length} notifications`);
  return notifs;
}

// ─── MAIN ────────────────────────────────────────────────

async function main() {
  console.log("\n🌱 ═══════════════════════════════════════════");
  console.log("   BusinessNet Database Seeder");
  console.log("   ═══════════════════════════════════════════\n");
  console.log(`📡 Connecting to: ${MONGODB_URI}\n`);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Seed in order (dependencies matter)
    const categories = await seedCategories();
    const users = await seedUsers();
    const businesses = await seedBusinesses(users);
    const hashtags = await seedHashtags();
    const { keywords, trends } = await seedKeywordsAndTrends(hashtags);
    const posts = await seedPosts(users, categories, hashtags);
    const comments = await seedComments(users, posts);
    const communities = await seedCommunities(users);
    const notifications = await seedNotifications(users, posts);

    console.log("\n═══════════════════════════════════════════");
    console.log("🎉 SEED COMPLETE! Summary:");
    console.log("═══════════════════════════════════════════");
    console.log(`   📁 Categories:     ${categories.length}`);
    console.log(`   👥 Users:          ${users.length}  (password: Password123!)`);
    console.log(`   🏢 Businesses:     ${businesses.length}`);
    console.log(`   #️⃣  Hashtags:       ${hashtags.length}`);
    console.log(`   📈 Keywords:       ${keywords.length}`);
    console.log(`   🔥 Trends:         ${trends.length}`);
    console.log(`   📝 Posts:          ${posts.length}`);
    console.log(`   💬 Comments:       ${comments.length}`);
    console.log(`   🏘️  Communities:    ${communities.length}`);
    console.log(`   🔔 Notifications:  ${notifications.length}`);
    console.log("═══════════════════════════════════════════");
    console.log("\n🔑 Login with any user email + password: Password123!");
    console.log("   Example: ahmed@demo.com / Password123!");
    console.log("   Admin:   admin@businessnet.com / Password123!\n");

  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("📡 Disconnected from MongoDB\n");
    process.exit(0);
  }
}

main();
