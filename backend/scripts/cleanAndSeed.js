const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/user');
const Business = require('../src/models/business');
const Community = require('../src/models/community');
const CommunityMember = require('../src/models/communityMember');
const CommunityMessage = require('../src/models/communitymessage');
const Post = require('../src/models/post');
const Comment = require('../src/models/comment');
const Hashtag = require('../src/models/hashtag');
const Keyword = require('../src/models/keyword');
const Trend = require('../src/models/trend');
const Duel = require('../src/models/duel');
const Promotion = require('../src/models/promotion');
const Badge = require('../src/models/badge');
const UserBadge = require('../src/models/userbadge');
const Notification = require('../src/models/notification');
const Message = require('../src/models/message');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/capstone';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB:', MONGODB_URI);

    // 1. Wipe all existing collections
    console.log('🧹 Purging all old data across collections...');
    await Promise.all([
      User.deleteMany({}),
      Business.deleteMany({}),
      Community.deleteMany({}),
      CommunityMember.deleteMany({}),
      CommunityMessage.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
      Hashtag.deleteMany({}),
      Keyword.deleteMany({}),
      Trend.deleteMany({}),
      Duel.deleteMany({}),
      Promotion.deleteMany({}),
      Badge.deleteMany({}),
      UserBadge.deleteMany({}),
      Notification.deleteMany({}),
      Message.deleteMany({})
    ]);
    console.log('✨ Database completely cleaned.');

    // 2. Hash default password
    const hashedPassword = await bcrypt.hash('12345678', 10);

    // 3. Seed Badges
    console.log('🏅 Seeding Badges...');
    const badgesData = [
      {
        name: 'First Post',
        description: 'Published first verified thought on the platform',
        ruleKey: 'first_post',
        rarity: 'common',
        imageUrl: '🎉'
      },
      {
        name: 'Industry Pioneer',
        description: 'Verified enterprise founder leading high-impact discussions',
        ruleKey: 'industry_pioneer',
        rarity: 'epic',
        imageUrl: '🚀'
      },
      {
        name: 'Duel Champion',
        description: 'Won an active industry skill debate by community consensus',
        ruleKey: 'duel_champion',
        rarity: 'legendary',
        imageUrl: '⚔️'
      },
      {
        name: 'Viral Thought',
        description: 'Received over 50 upvotes and wide network engagement',
        ruleKey: 'viral_hit',
        rarity: 'rare',
        imageUrl: '🔥'
      },
      {
        name: 'Discussion Master',
        description: 'Authored 20+ insightful comments in high-trust deal rooms',
        ruleKey: 'discussion_master',
        rarity: 'rare',
        imageUrl: '💬'
      }
    ];
    const createdBadges = await Badge.insertMany(badgesData);
    const pioneerBadgeId = createdBadges.find(b => b.ruleKey === 'industry_pioneer')?._id;
    const championBadgeId = createdBadges.find(b => b.ruleKey === 'duel_champion')?._id;

    // 4. Seed Core Users
    console.log('👥 Seeding Core Users...');
    const usersData = [
      {
        username: 'sarah_tech',
        fullName: 'Sarah Jenkins',
        email: 'sarah@cloudnexus.io',
        password: hashedPassword,
        accountType: 'business',
        role: 'business',
        isVerified: true,
        reputationScore: 96,
        bio: 'VP of Engineering at CloudNexus • Cloud Native & Distributed Systems Architect. Scaling multi-region microservices.',
        location: 'San Francisco, CA',
        website: 'https://cloudnexus.io',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        interests: ['Cloud Architecture', 'DevOps', 'Distributed Systems'],
        badges: pioneerBadgeId ? [pioneerBadgeId] : []
      },
      {
        username: 'omar_ai',
        fullName: 'عمر السيد',
        email: 'omar@neuralmena.com',
        password: hashedPassword,
        accountType: 'business',
        role: 'business',
        isVerified: true,
        reputationScore: 98,
        bio: 'مؤسس مختبرات NeuralMENA • باحث ومطور في الذكاء الاصطناعي وبناء النماذج اللغوية الضخمة (LLMs) لقطاع الأعمال.',
        location: 'Riyadh, KSA / Cairo, Egypt',
        website: 'https://neuralmena.com',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        interests: ['Artificial Intelligence', 'Arabic NLP', 'Venture Tech'],
        badges: championBadgeId ? [championBadgeId] : []
      },
      {
        username: 'elena_design',
        fullName: 'Elena Rostova',
        email: 'elena@fluxdesign.co',
        password: hashedPassword,
        accountType: 'personal',
        role: 'creator',
        isVerified: true,
        reputationScore: 92,
        bio: 'Principal Product Design Director • Crafting enterprise design systems, micro-interactions & high-retention SaaS UX.',
        location: 'Berlin, Germany',
        website: 'https://fluxdesign.co',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        interests: ['Product Design', 'Design Systems', 'UX Research']
      },
      {
        username: 'tariq_fintech',
        fullName: 'طارق منصور',
        email: 'tariq@finbridge.capital',
        password: hashedPassword,
        accountType: 'business',
        role: 'business',
        isVerified: true,
        reputationScore: 94,
        bio: 'الشريك الإداري في FinBridge Capital • تجميع رأس المال الجريء واستثمارات التقنية المالية لمنطقة الشرق الأوسط وشمال أفريقيا.',
        location: 'Dubai, UAE',
        website: 'https://finbridge.capital',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        interests: ['FinTech', 'Venture Capital', 'B2B Growth']
      },
      {
        username: 'alex_cloud',
        fullName: 'Alex Chen',
        email: 'alex@devscale.tech',
        password: hashedPassword,
        accountType: 'personal',
        role: 'user',
        isVerified: true,
        reputationScore: 88,
        bio: 'Senior Infrastructure Engineer • Kubernetes, eBPF, High-Throughput Pipelines & Open Source Contributor.',
        location: 'Austin, TX',
        website: 'https://devscale.tech',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        interests: ['Kubernetes', 'Backend Engineering', 'Cloud Native']
      },
      {
        username: 'layla_growth',
        fullName: 'ليلى القحطاني',
        email: 'layla@apexagency.co',
        password: hashedPassword,
        accountType: 'business',
        role: 'business',
        isVerified: true,
        reputationScore: 90,
        bio: 'مستشارة استراتيجيات النمو المؤسسي والتسويق الرقمي B2B • قيادة حملات التوسع للشركات التقنية الناشئة.',
        location: 'Jeddah, KSA',
        website: 'https://apexagency.co',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
        interests: ['B2B Marketing', 'Brand Strategy', 'Market Expansion']
      },
      {
        username: 'kareem_sec',
        fullName: 'كريم الشامي',
        email: 'kareem@cybershield.io',
        password: hashedPassword,
        accountType: 'business',
        role: 'business',
        isVerified: true,
        reputationScore: 95,
        bio: 'Chief Information Security Officer & Founder @ CyberShield MENA • Zero Trust, Cloud Compliance & Threat Intelligence.',
        location: 'Cairo, Egypt / Dubai, UAE',
        website: 'https://cybershield.io',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        interests: ['Cybersecurity', 'Zero Trust', 'Cloud Security']
      },
      {
        username: 'nour_ml',
        fullName: 'نور الهدى إبراهيم',
        email: 'nour@neuralmena.com',
        password: hashedPassword,
        accountType: 'personal',
        role: 'creator',
        isVerified: true,
        reputationScore: 93,
        bio: 'Lead AI & LLM Alignment Researcher • Exploring multilingual embeddings, speculative decoding & autonomous agents.',
        location: 'Riyadh, KSA',
        website: 'https://nour-ml.dev',
        avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
        interests: ['Artificial Intelligence', 'Machine Learning', 'NLP']
      },
      {
        username: 'marwan_cto',
        fullName: 'مروان خالد',
        email: 'marwan@payflow.sa',
        password: hashedPassword,
        accountType: 'business',
        role: 'business',
        isVerified: true,
        reputationScore: 97,
        bio: 'CTO @ PayFlow Arabia • Building ultra-low-latency real-time payment rails and instant settlement protocols.',
        location: 'Riyadh, KSA',
        website: 'https://payflow.sa',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
        interests: ['FinTech', 'Payments', 'Distributed Systems']
      },
      {
        username: 'maya_ux',
        fullName: 'Maya Lin',
        email: 'maya@designcanvas.io',
        password: hashedPassword,
        accountType: 'personal',
        role: 'user',
        isVerified: true,
        reputationScore: 89,
        bio: 'Design Systems Architect & Design Engineer • bridging tokens, Tailwind CSS and accessible interactive components.',
        location: 'London, UK',
        website: 'https://designcanvas.io',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
        interests: ['UI/UX', 'Design Systems', 'Frontend']
      }
    ];

    const users = await User.insertMany(usersData);
    const [sarah, omar, elena, tariq, alex, layla, kareem, nour, marwan, maya] = users;

    // Cross-link followers & following
    sarah.following = [omar._id, elena._id, tariq._id, kareem._id];
    sarah.followers = [omar._id, alex._id, layla._id, kareem._id, marwan._id];

    omar.following = [sarah._id, tariq._id, layla._id, nour._id];
    omar.followers = [sarah._id, elena._id, alex._id, tariq._id, nour._id];

    elena.following = [sarah._id, omar._id, maya._id];
    elena.followers = [sarah._id, layla._id, maya._id];

    tariq.following = [omar._id, sarah._id, marwan._id];
    tariq.followers = [omar._id, sarah._id, layla._id, marwan._id];

    alex.following = [sarah._id, omar._id, kareem._id];
    alex.followers = [kareem._id];

    layla.following = [omar._id, tariq._id, sarah._id, marwan._id];
    layla.followers = [omar._id];

    kareem.following = [sarah._id, alex._id, marwan._id];
    kareem.followers = [sarah._id, alex._id];

    nour.following = [omar._id, sarah._id];
    nour.followers = [omar._id];

    marwan.following = [tariq._id, sarah._id, kareem._id];
    marwan.followers = [tariq._id, layla._id, sarah._id];

    maya.following = [elena._id, sarah._id];
    maya.followers = [elena._id];

    await Promise.all([
      sarah.save(),
      omar.save(),
      elena.save(),
      tariq.save(),
      alex.save(),
      layla.save(),
      kareem.save(),
      nour.save(),
      marwan.save(),
      maya.save()
    ]);

    // 5. Seed Verified Businesses
    console.log('🏢 Seeding Businesses...');
    const businessesData = [
      {
        userId: sarah._id,
        name: 'CloudNexus Solutions',
        type: 'company',
        category: 'Technology',
        industry: 'Cloud Infrastructure & DevOps',
        companySize: 'enterprise',
        description: 'Next-generation hybrid-cloud deployment engine and high-availability systems for enterprise workloads.',
        website: 'https://cloudnexus.io',
        verified: true,
        reputationScore: 96,
        avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
        metrics: { trustScore: 98, innovationScore: 94, engagementRate: 88, aiAuditScore: 95 },
        offerings: [
          { name: 'Enterprise Cloud Audit', description: 'Comprehensive architectural evaluation', price: 4500, category: 'Services' },
          { name: 'Multi-Region Kubernetes', description: 'Full setup and 99.999% SLA management', price: 12000, category: 'Solutions' }
        ],
        followers: [omar._id, elena._id, alex._id, tariq._id]
      },
      {
        userId: omar._id,
        name: 'NeuralMENA Labs',
        type: 'company',
        category: 'Technology',
        industry: 'Artificial Intelligence & Arabic LLMs',
        companySize: 'startup',
        description: 'بناء وتطوير حلول الذكاء الاصطناعي التوليدي ونماذج معالجة اللغة العربية للقطاعات المالية والمؤسسية في الشرق الأوسط.',
        website: 'https://neuralmena.com',
        verified: true,
        reputationScore: 98,
        avatarUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        metrics: { trustScore: 99, innovationScore: 97, engagementRate: 92, aiAuditScore: 96 },
        offerings: [
          { name: 'Arabic Financial LLM API', description: 'Direct inference API for finance & banking', price: 2500, category: 'AI Services' },
          { name: 'Enterprise Knowledge Engine', description: 'RAG on internal compliance documents', price: 8000, category: 'Enterprise' }
        ],
        followers: [sarah._id, tariq._id, layla._id, alex._id]
      },
      {
        userId: tariq._id,
        name: 'FinBridge Capital',
        type: 'company',
        category: 'Finance',
        industry: 'FinTech & Capital Syndication',
        companySize: 'medium',
        description: 'منصة استثمار متقدمة تجمع بين رؤوس الأموال الجريئة وحلول الدفع المبتكرة ومطابقة الصفقات للشركات ذات النمو المتسارع.',
        website: 'https://finbridge.capital',
        verified: true,
        reputationScore: 93,
        avatarUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80',
        metrics: { trustScore: 96, innovationScore: 90, engagementRate: 85, aiAuditScore: 92 },
        offerings: [
          { name: 'Series A Co-Syndication', description: 'Co-investment pooling with tier-1 angels', price: 15000, category: 'Venture' },
          { name: 'FinTech Licensing Advisory', description: 'Fast-track regional sandbox approval', price: 6000, category: 'Legal & Finance' }
        ],
        followers: [omar._id, sarah._id, layla._id]
      },
      {
        userId: layla._id,
        name: 'Apex Growth Partners',
        type: 'company',
        category: 'Marketing',
        industry: 'Strategic B2B Growth & Brand Advisory',
        companySize: 'small',
        description: 'وكالة رائدة في بناء وتوسيع الحضور الرقمي للشركات التقنية واستقطاب الصفقات المؤسسية عبر شبكات الأعمال الموثّقة.',
        website: 'https://apexagency.co',
        verified: true,
        reputationScore: 89,
        avatarUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
        metrics: { trustScore: 91, innovationScore: 88, engagementRate: 90, aiAuditScore: 87 },
        offerings: [
          { name: 'B2B Pipeline Accelerator', description: 'Targeted executive acquisition campaign', price: 3500, category: 'Marketing' }
        ],
        followers: [sarah._id, omar._id]
      },
      {
        userId: kareem._id,
        name: 'CyberShield MENA',
        type: 'company',
        category: 'Technology',
        industry: 'Cybersecurity & Zero Trust Architecture',
        companySize: 'medium',
        description: 'حلول الأمن السيبراني المؤسسية وحماية السحابة الهجينة وتدقيق الامتثال الأمني وفق معايير NCA و ISO 27001.',
        website: 'https://cybershield.io',
        verified: true,
        reputationScore: 97,
        avatarUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
        metrics: { trustScore: 99, innovationScore: 95, engagementRate: 91, aiAuditScore: 98 },
        offerings: [
          { name: 'Cloud Security Posture Audit', description: 'Zero-trust architecture audit & penetration test', price: 5000, category: 'Security' },
          { name: 'Managed SOC 24/7', description: 'Continuous SIEM threat detection & response', price: 9000, category: 'Services' }
        ],
        followers: [sarah._id, omar._id, alex._id, marwan._id]
      },
      {
        userId: marwan._id,
        name: 'PayFlow Arabia',
        type: 'company',
        category: 'Finance',
        industry: 'Instant Payment Gateway & Smart Settlement',
        companySize: 'startup',
        description: 'بنية تحتية للمدفوعات الفورية والتسوية الذكية للمتاجر والشركات عبر واجهات برمجة تطبيقات مدمجة فائقة السرعة.',
        website: 'https://payflow.sa',
        verified: true,
        reputationScore: 95,
        avatarUrl: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=400&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80',
        metrics: { trustScore: 97, innovationScore: 96, engagementRate: 89, aiAuditScore: 94 },
        offerings: [
          { name: 'Instant Settlement API', description: 'Real-time fund disbursement for B2B marketplaces', price: 4000, category: 'FinTech' }
        ],
        followers: [tariq._id, omar._id, layla._id, sarah._id]
      }
    ];

    const businesses = await Business.insertMany(businessesData);
    const [cloudNexus, neuralMena, finBridge, apexGrowth, cyberShield, payFlow] = businesses;

    // Link back to user profiles
    sarah.businessId = cloudNexus._id;
    omar.businessId = neuralMena._id;
    tariq.businessId = finBridge._id;
    layla.businessId = apexGrowth._id;
    kareem.businessId = cyberShield._id;
    marwan.businessId = payFlow._id;

    await Promise.all([sarah.save(), omar.save(), tariq.save(), layla.save(), kareem.save(), marwan.save()]);

    // 6. Seed Communities
    console.log('🌐 Seeding Communities...');
    const communitiesData = [
      {
        name: 'Tech Founders & Cloud Architects',
        description: 'Elite network of senior architects, CTOs, and tech founders building scalable cloud infrastructure and high-throughput systems.',
        category: 'Technology',
        avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80',
        creatorId: sarah._id,
        isPrivate: false
      },
      {
        name: 'رواد الذكاء الاصطناعي واللغات الضخمة',
        description: 'مجتمع متخصص للمهندسين والمؤسسين المهتمين بنماذج الذكاء الاصطناعي التوليدي والتعلم العميق وبناء النظم المؤسسية في العالم العربي.',
        category: 'Technology',
        avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
        creatorId: omar._id,
        isPrivate: false
      },
      {
        name: 'Enterprise Product & UX Strategy',
        description: 'Where design leaders clash and collaborate over design tokens, retention-driven interfaces, and enterprise ergonomics.',
        category: 'Design',
        avatarUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=80',
        creatorId: elena._id,
        isPrivate: false
      },
      {
        name: 'MENA FinTech & Venture Syndicate',
        description: 'High-trust lounge for venture investors, angels, and fintech founders scaling payments and digital finance in MENA.',
        category: 'Finance',
        avatarUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=80',
        creatorId: tariq._id,
        isPrivate: false
      },
      {
        name: 'الأمن السيبراني والبنية التحتية Zero Trust',
        description: 'مجتمع خبراء أمن المعلومات وحماية الأنظمة السحابية والامتثال للمعايير الأمنية والحد من الاختراقات.',
        category: 'Technology',
        avatarUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80',
        creatorId: kareem._id,
        isPrivate: false
      },
      {
        name: 'أنظمة الدفع والتحويلات المالية الفورية',
        description: 'شبكة المتخصصين في بوابات الدفع الإلكتروني، الترميز المصرفي Tokenization، وتطوير بروتوكولات المعاملات المالية.',
        category: 'Finance',
        avatarUrl: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=400&auto=format&fit=crop&q=80',
        creatorId: marwan._id,
        isPrivate: false
      }
    ];

    const communities = await Community.insertMany(communitiesData);
    const [techCommunity, aiCommunity, designCommunity, fintechCommunity, cyberCommunity, paymentsCommunity] = communities;

    // Seed community memberships
    const communityMembers = [
      { communityId: techCommunity._id, userId: sarah._id, role: 'admin' },
      { communityId: techCommunity._id, userId: alex._id, role: 'member' },
      { communityId: techCommunity._id, userId: omar._id, role: 'member' },
      { communityId: aiCommunity._id, userId: omar._id, role: 'admin' },
      { communityId: aiCommunity._id, userId: sarah._id, role: 'member' },
      { communityId: aiCommunity._id, userId: tariq._id, role: 'member' },
      { communityId: designCommunity._id, userId: elena._id, role: 'admin' },
      { communityId: designCommunity._id, userId: sarah._id, role: 'member' },
      { communityId: fintechCommunity._id, userId: tariq._id, role: 'admin' },
      { communityId: fintechCommunity._id, userId: omar._id, role: 'member' },
      { communityId: fintechCommunity._id, userId: layla._id, role: 'member' }
    ];
    await CommunityMember.insertMany(communityMembers);

    // Seed community chat messages
    const chatMessages = [
      {
        communityId: techCommunity._id,
        senderId: sarah._id,
        content: 'Welcome everyone! We will discuss zero-downtime distributed migrations tomorrow at 4 PM UTC.',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000)
      },
      {
        communityId: techCommunity._id,
        senderId: alex._id,
        content: 'Excited! We just completed benchmark testing on our Kubernetes cluster with eBPF metrics.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000)
      },
      {
        communityId: aiCommunity._id,
        senderId: omar._id,
        content: 'أهلاً بكم جميعاً. شاركنا للتو مسودة الأوراق التقنية لنماذج اللغة المخصصة للبيانات المالية.',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000)
      },
      {
        communityId: aiCommunity._id,
        senderId: tariq._id,
        content: 'ممتاز جداً يا باشمهندس عمر. هذا سيحل عائقاً كبيراً في مطابقة الصفقات الاستثمارية تلقائياً.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000)
      }
    ];
    await CommunityMessage.insertMany(chatMessages);

    // 7. Seed Hashtags, Keywords, Trends
    console.log('🏷️ Seeding Hashtags & Trends...');
    const hashtagsData = [
      { name: 'technology', count: 68 },
      { name: 'ai', count: 82 },
      { name: 'تقنية', count: 54 },
      { name: 'ذكاء_اصطناعي', count: 60 },
      { name: 'business', count: 74 },
      { name: 'ريادة_الأعمال', count: 48 },
      { name: 'fintech', count: 42 },
      { name: 'تمويل', count: 36 },
      { name: 'design', count: 30 },
      { name: 'cloud', count: 58 }
    ];

    const hashtags = await Hashtag.insertMany(hashtagsData);
    const hashtagMap = {};
    hashtags.forEach(h => {
      hashtagMap[h.name] = h._id;
    });

    for (const h of hashtags) {
      const isTech = h.name.includes('ai') || h.name.includes('ذكاء') || h.name.includes('tech') || h.name.includes('تقنية');
      const kw = await Keyword.create({
        word: h.name,
        category: isTech ? 'Technology' : 'Business',
        frequency: h.count,
        avgSentiment: 0.88,
        lastUpdated: new Date()
      });

      await Trend.create({
        keywordId: kw._id,
        score: Math.round(h.count * 2.8),
        velocity: 9.4,
        dailyChange: 18.5,
        status: 'hot',
        detectedAt: new Date()
      });
    }

    // 8. Seed Posts (Rich Media, Images, Videos, Arabic, English, Hashtags)
    console.log('📝 Seeding Posts with Media & Verification...');
    const now = Date.now();

    const postsData = [
      {
        authorId: sarah._id,
        businessId: cloudNexus._id,
        communityId: techCommunity._id,
        content: 'Excited to announce our new distributed multi-region caching engine! Across 12 enterprise pilot clusters, we achieved a 65% latency drop on p99 queries. Scalability in 2026 is all about intelligent data locality and zero-serialization overhead. #technology #cloud #devops #business',
        category: 'Technology',
        tag: 'Technology',
        hashtags: [hashtagMap['technology'], hashtagMap['cloud'], hashtagMap['business']],
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'
          }
        ],
        upvotes: [omar._id, elena._id, alex._id, tariq._id, layla._id],
        upvotesCount: 48,
        impressions: 1240,
        commentsCount: 3,
        createdAt: new Date(now - 1 * 3600 * 1000)
      },
      {
        authorId: omar._id,
        businessId: neuralMena._id,
        communityId: aiCommunity._id,
        content: 'أطلقنا اليوم رسمياً الإصدار التجريبي لمنظومة NeuralMENA لمعالجة اللغة العربية المتخصصة في الوثائق المالية والمصرفية بدقة تجاوزت 95.4%! فخورون بتمكين المؤسسات من أتمتة قراءة العقود والتحليل الائتماني في ثوانٍ. #تقنية #ذكاء_اصطناعي #ريادة_الأعمال #تمويل',
        category: 'Technology',
        tag: 'Technology',
        hashtags: [hashtagMap['تقنية'], hashtagMap['ذكاء_اصطناعي'], hashtagMap['ريادة_الأعمال'], hashtagMap['تمويل']],
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
          }
        ],
        upvotes: [sarah._id, tariq._id, layla._id, alex._id],
        upvotesCount: 65,
        impressions: 2150,
        commentsCount: 2,
        isTrending: true,
        createdAt: new Date(now - 3 * 3600 * 1000)
      },
      {
        authorId: tariq._id,
        businessId: finBridge._id,
        communityId: fintechCommunity._id,
        content: 'أغلقنا الربع الثالث بتسهيل جولات استثمارية مشتركة تجاوزت 28 مليون دولار عبر شبكتنا الموثّقة. الطلب على حلول الدفع المدمج B2B والبنية التحتية الائتمانية يشهد طفرة غير مسبوقة في أسواق السعودية والإمارات. #تمويل #fintech #ريادة_الأعمال #business',
        category: 'Finance',
        tag: 'Finance',
        hashtags: [hashtagMap['تمويل'], hashtagMap['fintech'], hashtagMap['ريادة_الأعمال'], hashtagMap['business']],
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80'
          }
        ],
        upvotes: [omar._id, sarah._id, layla._id],
        upvotesCount: 42,
        impressions: 1100,
        commentsCount: 1,
        createdAt: new Date(now - 7 * 3600 * 1000)
      },
      {
        authorId: elena._id,
        communityId: designCommunity._id,
        content: 'Why micro-interactions define enterprise retention: B2B decision-makers form subconscious trust impressions in under 180ms. When animations are snappy and tactile, perceived system performance increases by 34%. Here is a breakdown of our high-density data canvas design. #design #technology #uiux',
        category: 'Design',
        tag: 'Design',
        hashtags: [hashtagMap['design'], hashtagMap['technology']],
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80'
          }
        ],
        upvotes: [sarah._id, omar._id, alex._id],
        upvotesCount: 39,
        impressions: 980,
        commentsCount: 1,
        createdAt: new Date(now - 14 * 3600 * 1000)
      },
      {
        authorId: alex._id,
        communityId: techCommunity._id,
        content: 'Demonstrating eBPF observability on high-concurrency microservices. Zero probe overhead and instant packet visualization for Kubernetes pods. Scalability is no longer a guessing game! #technology #cloud #devops',
        category: 'Technology',
        tag: 'Technology',
        hashtags: [hashtagMap['technology'], hashtagMap['cloud']],
        media: [
          {
            type: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          }
        ],
        upvotes: [sarah._id, omar._id],
        upvotesCount: 27,
        impressions: 820,
        commentsCount: 1,
        createdAt: new Date(now - 22 * 3600 * 1000)
      },
      {
        authorId: kareem._id,
        businessId: cyberShield._id,
        communityId: cyberCommunity._id,
        content: 'تحليل أمني شامل: كيف نجحت معمارية Zero Trust في صد أكثر من 4,200 محاولة اختراق لسحابات الشركات خلال الربع الأخير. تفعيل سياسات الوصول المشروط (Conditional Access) وعزل الهويات هو حائط الصد الأول للمؤسسات الحديثة. #تقنية #الأمن_السيبراني #business',
        category: 'Technology',
        tag: 'Technology',
        hashtags: [hashtagMap['تقنية'], hashtagMap['technology'], hashtagMap['business']],
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
          }
        ],
        upvotes: [sarah._id, alex._id, marwan._id, omar._id],
        upvotesCount: 53,
        impressions: 1420,
        commentsCount: 2,
        isTrending: true,
        createdAt: new Date(now - 5 * 3600 * 1000)
      },
      {
        authorId: marwan._id,
        businessId: payFlow._id,
        communityId: paymentsCommunity._id,
        content: 'متحمسون للإعلان عن إطلاق بروتوكول التسوية الفورية PayFlow Instant v2! زمن معالجة المعاملة أصبح أقل من 120 مللي ثانية مع تشفير طرف-إلى-طرف متوافق مع أعلى معايير PCI-DSS. المستقبل للمدفوعات المدمجة الذكية! #تمويل #fintech #ريادة_الأعمال #business',
        category: 'Finance',
        tag: 'Finance',
        hashtags: [hashtagMap['تمويل'], hashtagMap['fintech'], hashtagMap['ريادة_الأعمال'], hashtagMap['business']],
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800&auto=format&fit=crop&q=80'
          }
        ],
        upvotes: [tariq._id, omar._id, layla._id, sarah._id],
        upvotesCount: 47,
        impressions: 1380,
        commentsCount: 2,
        createdAt: new Date(now - 8 * 3600 * 1000)
      },
      {
        authorId: nour._id,
        communityId: aiCommunity._id,
        content: 'Latest research breakthrough on Speculative Decoding for Arabic LLMs: by leveraging a compact draft model (1.2B) alongside our primary 14B model, we achieved a 2.8x speedup in token generation with zero loss in generation quality! #ai #technology #nlp',
        category: 'Technology',
        tag: 'Technology',
        hashtags: [hashtagMap['ai'], hashtagMap['technology'], hashtagMap['ذكاء_اصطناعي']],
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80'
          }
        ],
        upvotes: [omar._id, sarah._id, alex._id, kareem._id],
        upvotesCount: 58,
        impressions: 1690,
        commentsCount: 2,
        isTrending: true,
        createdAt: new Date(now - 11 * 3600 * 1000)
      },
      {
        authorId: layla._id,
        businessId: apexGrowth._id,
        content: 'أهم درس تعلمناه في قيادة جولات التوسع الرقمي لـ 18 شركة تقنية ناشئة: التركيز على معدل بقاء العملاء (Retention) يقلل تكلفة الاستحواذ بنسبة 45% مقارنة بالحملات الإعلانية التقليدية. الاستثمار في مجتمع العملاء هو المحرك الأقوى! #ريادة_الأعمال #business',
        category: 'Marketing',
        tag: 'Marketing',
        hashtags: [hashtagMap['ريادة_الأعمال'], hashtagMap['business']],
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
          }
        ],
        upvotes: [omar._id, tariq._id, sarah._id],
        upvotesCount: 34,
        impressions: 890,
        commentsCount: 1,
        createdAt: new Date(now - 16 * 3600 * 1000)
      },
      {
        authorId: maya._id,
        communityId: designCommunity._id,
        content: 'Token-driven design systems in production: How maintaining a single source of truth between Figma tokens and CSS variables reduced design debt by 70% across 4 cross-functional product teams. Consistent UX drives real ROI! #design #uiux #technology',
        category: 'Design',
        tag: 'Design',
        hashtags: [hashtagMap['design'], hashtagMap['technology']],
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
          }
        ],
        upvotes: [elena._id, sarah._id, nour._id],
        upvotesCount: 31,
        impressions: 740,
        commentsCount: 1,
        createdAt: new Date(now - 20 * 3600 * 1000)
      }
    ];

    const createdPosts = await Post.insertMany(postsData);

    // 9. Seed Comments
    console.log('💬 Seeding Comments...');
    const commentsData = [
      {
        post: createdPosts[0]._id,
        author: omar._id,
        content: 'Outstanding work Sarah! We would love to integrate CloudNexus caching with our inference worker clusters.',
        createdAt: new Date(now - 45 * 60 * 1000)
      },
      {
        post: createdPosts[0]._id,
        author: alex._id,
        content: 'What serialization protocol did you settle on? FlatBuffers or custom Protobuf memory mapping?',
        createdAt: new Date(now - 30 * 60 * 1000)
      },
      {
        post: createdPosts[1]._id,
        author: tariq._id,
        content: 'خطوة جبارة يا عمر! حل مشكلة اللغة العربية في المصطلحات المصرفية والائتمانية كان عائقاً كبيراً أمام الصناديق.',
        createdAt: new Date(now - 2 * 3600 * 1000)
      },
      {
        post: createdPosts[3]._id,
        author: sarah._id,
        content: 'Completely agree Elena! The 180ms latency threshold is real for enterprise executive dashboards.',
        createdAt: new Date(now - 10 * 3600 * 1000)
      }
    ];
    await Comment.insertMany(commentsData);

    // 10. Seed Industry Duels / Battles
    console.log('⚔️ Seeding Industry Duels...');
    const duelsData = [
      {
        topic: 'Modular Monolith vs Microservices in 2026',
        description: 'Which architecture paradigm provides superior operational retention, velocity, and infrastructure cost efficiency for scaling B2B enterprises?',
        category: 'Technology',
        challenger: sarah._id,
        challenged: omar._id,
        challengerSubmission: {
          content: 'Modular monoliths eliminate distributed transaction overhead and slash cloud infrastructure costs by up to 40% during early-to-mid scaling phases. With modern compilation boundaries, teams achieve high autonomy without network complexity.',
          media: [],
          votes: [sarah._id, elena._id, alex._id]
        },
        challengedSubmission: {
          content: 'Microservices enable independent deployment cycles and autonomous teams. When team size exceeds 50 engineers, decoupling is non-negotiable for rapid parallel delivery and fault isolation.',
          media: [],
          votes: [omar._id, tariq._id, layla._id]
        },
        status: 'active',
        expiresAt: new Date(now + 4 * 24 * 3600 * 1000),
        createdAt: new Date(now - 2 * 3600 * 1000)
      },
      {
        topic: 'Automated AI Code Audits vs Traditional Peer Review',
        description: 'Does continuous LLM audit replacement enhance vulnerability detection without degrading architectural ownership?',
        category: 'Technology',
        challenger: alex._id,
        challenged: sarah._id,
        challengerSubmission: {
          content: 'AI auditing catches 92% of common security and memory regression issues instantly before pull requests even reach team members.',
          media: [],
          votes: [alex._id]
        },
        challengedSubmission: {
          content: 'Syntactic review is fine for bots, but semantic and architectural intent requires human peer collaboration and domain context.',
          media: [],
          votes: [sarah._id, omar._id]
        },
        status: 'active',
        expiresAt: new Date(now + 6 * 24 * 3600 * 1000),
        createdAt: new Date(now - 12 * 3600 * 1000)
      }
    ];
    await Duel.insertMany(duelsData);

    // 11. Seed Active Promotions
    console.log('📢 Seeding Promotions...');
    const promotionsData = [
      {
        postId: createdPosts[0]._id,
        businessId: cloudNexus._id,
        budget: 500,
        spent: 180,
        duration: 7,
        startDate: new Date(now - 24 * 3600 * 1000),
        endDate: new Date(now + 6 * 24 * 3600 * 1000),
        targetRegion: 'global',
        targetCategory: 'Technology',
        status: 'active',
        analytics: {
          impressions: 1240,
          clicks: 185,
          conversions: 14
        }
      },
      {
        postId: createdPosts[1]._id,
        businessId: neuralMena._id,
        budget: 750,
        spent: 240,
        duration: 10,
        startDate: new Date(now - 12 * 3600 * 1000),
        endDate: new Date(now + 9 * 24 * 3600 * 1000),
        targetRegion: 'MENA',
        targetCategory: 'Technology',
        status: 'active',
        analytics: {
          impressions: 2150,
          clicks: 340,
          conversions: 28
        }
      }
    ];
    await Promotion.insertMany(promotionsData);

    console.log('\n==========================================');
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('==========================================');
    console.log('Users created:');
    users.forEach(u => {
      console.log(`- ${u.username} (${u.fullName}) | Email: ${u.email} | Password: test1234 or 12345678`);
    });
    console.log('Businesses created:', businesses.map(b => b.name).join(', '));
    console.log('Communities created:', communities.map(c => c.name).join(', '));
    console.log('Posts created:', createdPosts.length);
    console.log('==========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
