# 🌱 Nurturing Gardens

A beautiful, accessible botanical guide for zone-based, native-friendly gardening. Discover plants that work for your USDA hardiness zone, with a special focus on native and pollinator-friendly options.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MUI](https://img.shields.io/badge/MUI-7.0-007FFF)
![License](https://img.shields.io/badge/license-ISC-green)

## ✨ Features

- **Zone-Based Plant Discovery**: Search by ZIP code or manually select your USDA hardiness zone
- **Native & Pollinator Focus**: Filter for native plants and pollinator-friendly species
- **Pet Safety Information**: Clear toxicity warnings with ASPCA references
- **Local Shopping List**: Build and export your plant shopping list as a text file
- **AI Master Gardener**: Chat with an AI gardening assistant (rate-limited)
- **Educational Blog**: Articles on native plants, pollinators, and sustainable gardening
- **Fully Accessible**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Mobile Responsive**: Beautiful experience on all devices

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: Material UI (MUI)
- **Styling**: Emotion (via MUI)
- **Font**: Lora (via next/font/google)
- **Markdown**: MDX for blog posts
- **AI**: OpenAI API for chatbot
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- (Optional) OpenAI API key for chatbot functionality
- (Optional) Plant and zone API credentials

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nurturing-gardens.git
   cd nurturing-gardens
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your configuration:
   - `NEXT_PUBLIC_SITE_URL`: Your site URL
   - `NEXT_PUBLIC_GITHUB_REPO_URL`: Your GitHub repo URL
   - `OPENAI_API_KEY`: Your OpenAI API key (for chatbot)
   - Other optional API keys as needed

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
nurturing-gardens/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes (zone, chat, etc.)
│   │   ├── blog/              # Blog pages
│   │   ├── browse/            # Plant browser
│   │   ├── contact/           # Contact page
│   │   ├── legal/             # Legal pages
│   │   ├── plants/[id]/       # Plant detail pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── robots.ts          # Robots.txt generator
│   │   └── sitemap.ts         # Sitemap generator
│   ├── components/            # React components
│   │   ├── blog/              # Blog components
│   │   ├── chat/              # Chat widget
│   │   ├── common/            # Shared components
│   │   ├── layout/            # Layout components
│   │   └── plants/            # Plant components
│   ├── data/                  # Static data
│   │   └── posts/             # Blog posts (MDX)
│   ├── lib/                   # Utility functions
│   │   ├── blog.ts            # Blog data layer
│   │   ├── localPlantData.ts  # Local JSON plant data
│   │   ├── plants.ts          # Plant data layer (wrapper)
│   │   ├── shopping-list.ts   # Shopping list utilities
│   │   └── theme.ts           # MUI theme
│   └── types/                 # TypeScript types
│       ├── blog.ts
│       ├── plant.ts
│       ├── shopping-list.ts
│       └── zone.ts
├── data/                       # Plant data and overrides
│   ├── plants.json            # Master plant dataset (authoritative)
│   ├── plant-overrides.json   # Manual plant metadata overrides
│   ├── perenual-raw.json      # Raw Perenual API data (generated)
│   ├── aspca-toxic.json       # ASPCA toxicity data (generated)
│   └── overrides/             # Additional override JSON files
├── scripts/                    # Data ingestion scripts
│   ├── fetch-perenual.ts      # Fetch plant data from Perenual API
│   ├── fetch-aspca-toxicity.ts # Fetch ASPCA toxicity data
│   └── build-master-plant-list.ts # Merge all data sources
├── public/                     # Static assets
├── .env.example               # Environment variables template
├── next.config.mjs            # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## 🎨 Design Philosophy

**Botanical & Calm**: The design uses a warm, botanical color palette with the Lora serif font for a calm, educational feel.

**Accessibility First**: Built with WCAG 2.1 AA compliance in mind:
- Semantic HTML throughout
- Keyboard navigation support
- High color contrast ratios
- ARIA labels and roles
- Screen reader friendly

**Native & Sustainable**: Emphasizes native plants and pollinator support to encourage sustainable gardening practices.

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Node.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 🔧 Configuration

### Plant Data

The app uses a **local JSON dataset** (`data/plants.json`) as the authoritative plant data source. This dataset is generated through a multi-step ingestion process that combines data from multiple sources.

#### Data Sources

1. **Perenual API** - Comprehensive plant database
2. **ASPCA Database** - Pet toxicity information
3. **Local Overrides** - Custom curations and corrections

#### Plant Data Ingestion System

The project includes a complete data ingestion pipeline:

**Step 1: Fetch Perenual Data**
```bash
# Install ts-node if not already installed
npm install -g ts-node

# Set your Perenual API credentials in .env
PLANT_API_BASE_URL=https://perenual.com/api
PLANT_API_KEY=your_api_key_here

# Run the fetch script
ts-node scripts/fetch-perenual.ts
```

This script:
- Paginates through all Perenual plants
- Normalizes data to the project's Plant interface
- Handles rate limiting gracefully
- Outputs to `data/perenual-raw.json`

**Step 2: Fetch ASPCA Toxicity Data**
```bash
ts-node scripts/fetch-aspca-toxicity.ts
```

This script:
- Uses known ASPCA toxicity data for common plants
- Can be extended to scrape ASPCA website
- Outputs to `data/aspca-toxic.json`

**Step 3: Build Master Plant List**
```bash
ts-node scripts/build-master-plant-list.ts
```

This script:
- Merges Perenual data with ASPCA toxicity data
- Applies overrides from `data/plant-overrides.json`
- Applies overrides from `data/overrides/*.json`
- Cleans and validates all data
- Outputs final dataset to `data/plants.json`

#### Running the Full Ingestion Pipeline

```bash
# Run all scripts in sequence
ts-node scripts/fetch-perenual.ts && \
ts-node scripts/fetch-aspca-toxicity.ts && \
ts-node scripts/build-master-plant-list.ts
```

#### Custom Plant Overrides

To add custom plant metadata or corrections:

1. Edit `data/plant-overrides.json` with your plant overrides
2. Or create new JSON files in `data/overrides/`
3. Re-run `build-master-plant-list.ts`

Example override:
```json
[
  {
    "id": "echinacea-purpurea",
    "isNative": true,
    "isPollinatorFriendly": true,
    "beginnerFriendly": true,
    "curatedForZones": [3, 4, 5, 6, 7],
    "notes": "Drought tolerant once established. Great for beginners!"
  }
]
```

#### Local Development Without API Keys

The repository includes a pre-populated `data/plants.json` with 6 curated plants that works out of the box. You don't need API keys to develop or deploy the app.

### Blog Posts

Add blog posts as Markdown or MDX files in `src/data/posts/`. Each post should have frontmatter:

```markdown
---
title: "Your Post Title"
slug: "your-post-slug"
excerpt: "A brief description"
category: "native" # or "pollinators", "plant-of-the-week", "general"
publishedAt: "2024-01-01T00:00:00.000Z"
coverImage: "https://..."
author: "Your Name"
---

Your content here...
```

### AI Chatbot

The chatbot uses OpenAI's API. Configure with:
- `OPENAI_API_KEY`: Your OpenAI API key
- `GARDENER_MODEL`: Model to use (default: `gpt-4-turbo-preview`)

Rate limiting is built-in (3 questions per day per IP).

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC License - see LICENSE file for details

## 👤 Author

**JP Branski**
- Website: [jpbranski.com](https://jpbranski.com)
- Email: dev@jpbranski.com

## 🙏 Acknowledgments

- Plant images from Unsplash
- Icons from Material UI Icons
- USDA Hardiness Zone data
- ASPCA for pet toxicity information

## 🐛 Issues & Feedback

Found a bug or have a suggestion? Please [open an issue](https://github.com/yourusername/nurturing-gardens/issues).

---

Built with 🌱 for gardeners who care about native plants and pollinators.
