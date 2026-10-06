# 🚀 Business Social Network Platform

> A modern, AI-powered social networking platform designed specifically for businesses to connect, collaborate, and grow together.

---

### 📢 Latest Updates (January 2026)
- **⚔️ Industry Battles (Duels)**: Launched a professional "duel" system where industry experts can debate topics, with real-time community voting and reputation impact.
- **🏆 Advanced Badge System**: Fully automated badge awarding system for engagement, business growth, and community contributions.
- **📊 Live Pulse Trends**: Real-time "Market Buzz" tracking for keywords and industry-specific trending topics.
- **🤖 AI Analytics V2**: Deep sentiment analysis and professional scoring for all platform content.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

This platform is a comprehensive social networking solution tailored for businesses, combining the best features of professional networking with AI-powered insights, real-time communication, and advanced analytics.

### Key Highlights

- 🤖 **AI-Powered**: Intelligent content analysis, sentiment detection, and personalized recommendations
- ⚡ **Real-Time**: Instant messaging, live notifications, and online presence tracking
- 📊 **Analytics**: Comprehensive business analytics and promotion tracking
- 🎯 **Targeted Promotion**: Advanced advertising system with detailed analytics
- 🏆 **Gamification**: Badge system and reputation scoring to encourage engagement
- 🌐 **Community-Driven**: Create and join communities around shared interests
- 📱 **Responsive**: Beautiful, mobile-first design that works on all devices

---

## ✨ Features

### Core Features

#### 🔐 Authentication & User Management
- JWT-based secure authentication
- Role-based access control (User, Business, Admin)
- Social login integration (Google, LinkedIn)
- Email verification and password recovery
- User profiles with customizable information

#### 🏢 Business Profiles
- Comprehensive business profiles
- Reputation scoring system
- Verification badges
- Analytics dashboard
- Follower management
- Business categories and tags

#### 📝 Content Management
- Rich text post creation
- Media upload (images, videos)
- Hashtags and mentions
- Post categories
- Draft saving
- Scheduled posting
- Post analytics

#### 💬 Social Interactions
- Like, comment, and share posts
- Nested comment threads
- Reactions (like, love, celebrate, etc.)
- Bookmarking posts
- Following users and businesses
- Activity feed

#### 👥 Communities
- Create public/private communities
- Community moderation tools
- Member roles (Admin, Moderator, Member)
- Community-specific feeds
- Event creation and management
- Community analytics

#### 💌 Messaging
- Real-time one-on-one messaging
- Online/offline status
- Typing indicators
- Read receipts
- Message search
- File sharing
- Message reactions

#### 🔔 Notifications
- Real-time push notifications
- In-app notification center
- Email notifications
- Customizable notification preferences
- Notification grouping
- Mark as read/unread

#### 📈 Trends & Discovery
- Trending topics tracking (Market Buzz)
- Keyword analysis and sentiment detection
- Trend velocity and Activity Index calculation
- Category-specific trending feeds
- Personalized explore page

#### ⚔️ Industry Battles (NEW)
- Professional duel system between users/businesses
- "Opening Fire" initial arguments with media support
- 24-hour community voting period
- Automatic winner determination and Hall of Fame
- Massive reputation impact for victors

#### 🏆 Gamification
- Achievement badges
- Reputation points
- Leaderboards
- Progress tracking
- Milestone celebrations
- Rare badge collection

#### 📢 Promoted Content
- Create promoted posts
- Budget management
- Target audience selection
- Geographic targeting
- Category-based targeting
- Detailed analytics (impressions, clicks, CTR, conversions)
- ROI tracking

#### 🤖 AI Features
- Content sentiment analysis
- Automated content moderation
- Spam detection
- Personalized feed algorithm
- Smart recommendations
- Trend prediction

---

## 🛠️ Technology Stack

### Frontend
```
├── React 18+              - UI library
├── Next.js 14+            - React framework
├── App Router             - File-based routing
├── TanStack Query         - Server state management
├── Zustand                - Client state management
├── Socket.io Client       - Real-time communication
├── Tailwind CSS           - Styling
├── shadcn/ui              - UI components
├── Framer Motion          - Animations
├── React Hook Form        - Form handling
└── Zod                    - Validation
```

### Backend
```
├── Node.js 18+            - Runtime
├── Express.js             - Web framework
├── MongoDB                - Database
├── Mongoose               - ODM
├── Socket.io              - WebSocket server
├── JWT                    - Authentication
├── Bcrypt                 - Password hashing
├── Bull                   - Job queues
├── Redis                  - Caching & sessions
├── Cloudinary             - Media storage
├── Nodemailer             - Email service
└── Winston                - Logging
```

### DevOps & Tools
```
├── Docker                 - Containerization
├── Docker Compose         - Multi-container orchestration
├── Nginx                  - Reverse proxy
├── PM2                    - Process management
├── GitHub Actions         - CI/CD
├── ESLint                 - Code linting
├── Prettier               - Code formatting
└── Jest                   - Testing
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Web Frontend (React)                     │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │   Auth   │  Feed    │ Business │Community │ Messages │  │
│  │  Pages   │  & Posts │ Profiles │  Pages   │   Chat   │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTPS/WSS
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway / Backend                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Auth & Access Control (JWT + Role-based)            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌────────┬────────┬────────┬────────┬────────┬────────┐  │
│  │  User  │Business│  Post  │Comment │Community│Message │  │
│  │ Module │ Module │ Module │ Module │ Module │ Module │  │
│  └────────┴────────┴────────┴────────┴────────┴────────┘  │
│  ┌────────┬────────┬────────┬────────┬────────┬────────┐  │
│  │ Notif. │ Trend  │   AI   │ Badge  │Promotion│ Media  │  │
│  │ Module │ Module │Analysis│ Module │ Module │ Module │  │
│  └────────┴────────┴────────┴────────┴────────┴────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB (Database)                        │
│  Collections: users, businesses, posts, comments,            │
│  communities, messages, notifications, trends, badges, etc.  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   Background Workers                         │
│  ┌──────────────────┬──────────────────┬─────────────────┐ │
│  │  AI Analysis     │ Trend Calculator │ Notification    │ │
│  │  Worker          │ Worker           │ Dispatcher      │ │
│  └──────────────────┴──────────────────┴─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** >= 6.0
- **Redis** >= 7.0
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/business-social-network.git
cd business-social-network
```

2. **Install dependencies**

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Environment Setup**

Create `.env` files in both frontend and backend directories:

**Backend `.env`:**
```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/business-social-network
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AI (Optional)
OPENAI_API_KEY=your-openai-key
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

4. **Start MongoDB and Redis**

```bash
# Using Docker
docker-compose up -d mongodb redis

# Or start them locally
mongod
redis-server
```

5. **Run the application**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1
- API Docs: http://localhost:5000/api-docs

---

## 📁 Project Structure

```
business-social-network/
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   └── lib/           # Utilities
│   └── package.json
│
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── models/        # Database models
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   ├── workers/       # Background jobs
│   │   └── sockets/       # Socket.io handlers
│   └── package.json
│
├── workers/               # Separate worker processes
├── shared/                # Shared code
├── docs/                  # Documentation
└── docker-compose.yml     # Docker configuration
```

For detailed structure, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

---

## 📚 Documentation

- **[Project Structure](./PROJECT_STRUCTURE.md)** - Detailed project organization
- **[API Design](./API_DESIGN.md)** - Complete API documentation
- **[Design Guide](./DESIGN_GUIDE.md)** - UI/UX design system
- **[Database Schema](./docs/DATABASE.md)** - MongoDB schema details
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute

---

## 💻 Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

**Backend:**
```bash
npm run dev          # Start with nodemon
npm start            # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
npm run seed         # Seed database
```

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **Conventional Commits** for commit messages

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 🚢 Deployment

### Using Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Manual Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions for:
- AWS
- Google Cloud Platform
- DigitalOcean
- Heroku
- Vercel (Frontend - Recommended for Next.js)

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📊 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Authentication system
- [x] Basic user profiles
- [x] Post creation and feed

### Phase 2: Social Features ✅
- [x] Real-time messaging
- [x] Notifications system
- [x] Communities
- [x] Follow/connection system

### Phase 3: Advanced Features ✅
- [x] AI integration & analysis
- [x] Trend analysis (Market Buzz)
- [x] Badge & Reputation system
- [x] Promoted posts & trends
- [x] **Industry Battles (Duels)** (New!)

### Phase 4: Polish & Scale (Upcoming)
- [ ] Mobile apps (React Native)
- [ ] Advanced business analytics
- [ ] Third-party professional integrations (LinkedIn, etc.)
- [ ] Performance optimization & Scaling

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Your Name** - *Full Stack Developer* - [@yourhandle](https://github.com/yourhandle)

---

## 🙏 Acknowledgments

- Design inspiration from LinkedIn, Twitter, and Facebook
- Icons from [Heroicons](https://heroicons.com/)
- Illustrations from [unDraw](https://undraw.co/)
- Community support from Stack Overflow and GitHub

---

## 📞 Support

For support, email support@yourdomain.com or join our Slack channel.

---

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

**Built with ❤️ by the Development Team**

*Last Updated: December 29, 2025*
