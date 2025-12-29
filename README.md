# 🌱 MonkArc - Journey Tracking for Developers

> **Build. Track. Achieve.** MonkArc helps developers turn their learning journey into a visible Arc of accomplishment.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/monkarc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)

[Live Demo](https://monkarc.app) • [Documentation](#documentation) • [Report Bug](https://github.com/diwashkafle/monkarc/issues) • [Request Feature](https://github.com/diwashkafle/monkarc/issues)

---

## 🎯 What is MonkArc?

MonkArc is a habit-tracking app designed specifically for developers. Unlike generic habit trackers, MonkArc:

- 🌱 **Plants Seeds**: Start a journey with a clear target
- 🔥 **Builds Streaks**: Daily check-ins keep you accountable
- 🏆 **Creates Arcs**: Complete journeys become shareable achievements
- 💻 **Tracks Commits**: Automatic GitHub integration shows your real work
- ❄️ **Embraces Reality**: Smart status system (active → frozen → dead → resurrected)

**Think of it as GitHub's contribution graph meets a habit tracker, with gamification that actually makes sense for builders.**

---

## ✨ Features

### 🌟 Core Features

- **Journey Phases**
  - 🌱 **Seed Phase**: Active development (0 to target check-ins)
  - 🏆 **Arc Phase**: Achievement unlocked (target reached)
  - ❄️ **Frozen**: 3 days inactive (preserves streak)
  - 💀 **Dead**: 7 days inactive (streak lost, can resurrect)

- **Smart Tracking**
  - Daily check-ins with accomplishment + notes
  - Automatic GitHub commit integration
  - Streak calculation and longest streak tracking
  - Visual progress grid (calendar view)
  - Real-time status updates

- **Journey Management**
  - Set custom targets (10, 30, 60 days, etc.)
  - Extend journeys when needed
  - Complete early with smart date handling
  - Add learning resources (videos, docs, articles)
  - Tech stack tagging

- **Social Features**
  - Public Arc pages (shareable achievements)
  - Private journeys (keep it personal)
  - Beautiful Arc showcase with stats
  - Timeline of your journey

### 🔧 Technical Features

- **Authentication**
  - Google OAuth (primary)
  - GitHub OAuth (with commit tracking)
  - Automatic account linking

- **Performance**
  - Server-side rendering for speed
  - Optimized database queries
  - Loading states everywhere
  - Error boundaries for stability

- **Automation**
  - Daily cron job for status updates
  - Automatic streak calculation
  - GitHub commit fetching

---

## 🚀 Tech Stack

**Frontend:**
- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS v4](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Shadcn/ui](https://ui.shadcn.com/) - Component library

**Backend:**
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - Serverless functions
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database queries
- [Neon PostgreSQL](https://neon.tech/) - Serverless Postgres
- [NextAuth.js](https://next-auth.js.org/) - Authentication

**Services:**
- [Vercel](https://vercel.com/) - Hosting & deployment
- [Vercel Cron](https://vercel.com/docs/cron-jobs) - Scheduled tasks
- [GitHub API](https://docs.github.com/en/rest) - Commit tracking

---
<div id="documentation"></div>
## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)
- GitHub OAuth App
- Google OAuth App

### Quick Start

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/monkarc.git
   cd monkarc
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
```bash
   cp .env.example .env.local
```

   Fill in your `.env.local`:
```env
   # Database
   DATABASE_URL=postgresql://user:pass@host/db

   # Auth
   NEXTAUTH_SECRET=your-secret-here
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # GitHub OAuth
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret

   # Cron Job
   CRON_SECRET=your-random-secret-here
```

4. **Set up database**
```bash
   npm run db:push
```

5. **Run development server**
```bash
   npm run dev
```

   Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎨 Screenshots 

### Dashboard
![Dashboard](./doc/image/dashboard.png)
*Track all your active journeys in one place*

### Journey Detail
![Journey Detail](./doc/image/journey.png)
*See your progress, streak, and upcoming check-ins*

### Arc Showcase
![Arc Showcase](./doc/image/arc.png)
*Share your completed journey as a beautiful Arc*

---

## 🏗️ Project Structure
```
monkarc/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   └── cron/           # Cron job endpoints
│   ├── dashboard/          # Dashboard page
│   ├── journey/            # Journey pages
│   │   └── [id]/          # Dynamic journey routes
│   ├── arc/                # Public Arc pages
│   └── layout.tsx          # Root layout
│
├── components/             # React components
│   ├── PublicComponents/  # Public-facing components
│   ├── ProtectedUiComponents/ # Auth-required components
│   └── ui/                # Reusable UI components
│
├── lib/                    # Utilities and helpers
│   ├── server-actions/    # Server actions
│   ├── queries/           # Database queries
│   ├── journey/           # Journey logic
│   ├── github/            # GitHub API client
│   └── validation/        # Zod schemas
│
├── db/                     # Database
│   ├── schema.ts          # Drizzle schema
│   └── index.ts           # Database connection
│
└── public/                 # Static assets
```

---

## 🔑 Key Concepts

### Journey Lifecycle
```
┌─────────┐
│  Seed   │ ──── Check-in daily ──→ Progress
│ Phase   │
└─────────┘
     │
     │ (Target reached)
     ↓
┌─────────┐
│   Arc   │ ──── Complete or Extend
│ Phase   │
└─────────┘
     │
     ├─→ Complete ──→ Public Arc Page
     └─→ Extend   ──→ Continue journey
```

### Status System
```
Active ─────→ Frozen ─────→ Dead
  ↑            (3 days)     (7 days)
  │              ↓             ↓
  └──────── Check-in ──────────┘
           (Resurrection)
```

### Streak Calculation

- **Current Streak**: Consecutive days from today backwards
- **Longest Streak**: Highest consecutive days ever achieved
- **Frozen**: Streak preserved for 3 days
- **Dead**: Streak reset to 0

---

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | ✅ |
| `NEXTAUTH_URL` | Your app URL | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | ✅ |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | ✅ |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | ✅ |
| `CRON_SECRET` | Secret for cron job auth | ✅ |

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
   git push origin main
```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Add environment variables
   - Deploy!

3. **Set up database**
   - Create a Neon database at [neon.tech](https://neon.tech)
   - Add `DATABASE_URL` to Vercel
   - Run: `npm run db:push`

4. **Configure OAuth**
   - Add production URLs to Google/GitHub OAuth apps
   - Update `NEXTAUTH_URL` in Vercel

**Cron job automatically configured via `vercel.json`!**

---

## 📚 Documentation

### Creating a Journey
```typescript
const journey = {
  title: "Master Next.js",
  description: "Build 3 production apps",
  targetCheckIns: 30,
  repoURL: "https://github.com/user/repo", // Optional
  techStack: ["Next.js", "TypeScript", "Tailwind"],
  resources: [
    {
      type: "video",
      title: "Next.js Tutorial",
      url: "https://youtube.com/..."
    }
  ]
}
```

### Check-in Format
```typescript
const checkIn = {
  accomplishment: "Built user authentication system",
  notes: "Used NextAuth.js with Google provider. Learned about session handling.",
  // GitHub commits auto-fetched if repo linked
}
```

### Extending a Journey
```typescript
// When reaching target, you can:
1. Complete → Journey becomes public Arc
2. Extend → Add more days, keep building
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow existing code style
- Write meaningful commit messages
- Test your changes locally
- Update documentation if needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by GitHub's contribution graph
- Built during a month-long learning journey
- Thanks to the Next.js and Vercel teams for amazing tools

---

<!-- ## 🗺️ Roadmap

- [ ] Email notifications for frozen/dead journeys
- [ ] Team journeys (collaborate with friends)
- [ ] Journey templates (pre-built learning paths)
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard (trends over time)
- [ ] Achievement badges
- [ ] Export journey data (PDF/JSON)
- [ ] Integration with more platforms (GitLab, Bitbucket)

--- -->

<div align="center">

**Built with ❤️ new for developers**

[⭐ Star this repo](https://github.com/yourusername/monkarc) • [🐛 Report Bug](https://github.com/yourusername/monkarc/issues) • [💡 Request Feature](https://github.com/yourusername/monkarc/issues)

</div>