# 🎯 Insider Signal

**Real-time SEC Form 4 insider trading tracker optimized for 6-week swing trades.**

Track the biggest insider buys, find top-performing insiders, and build your watchlist — all powered by live SEC filing data.

![Insider Signal](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat&logo=tailwind-css)

## ✨ Features

- **📈 Daily Insider Buys** — Real-time feed of insider purchases from SEC Form 4 filings
- **🏆 Top Insiders** — Leaderboard of most active buyers with trade statistics
- **⭐ Watchlist** — Track your favorite tickers and monitor insider activity
- **🔍 Smart Filters** — Filter by minimum purchase value, sort by date or size
- **📱 Responsive** — Works on desktop, tablet, and mobile
- **⚡ Fast** — Server-side caching, optimized API calls

## 🚀 Deploy to Vercel

### Step 1: Get Your API Key

1. Go to [Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs)
2. Sign up for a free account
3. Copy your API key from the dashboard

**Free tier includes:**
- 250 API requests per day
- Insider trading data
- Company profiles
- Real-time quotes

### Step 2: Deploy to Vercel

#### Option A: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/insider-signal&env=FMP_API_KEY&envDescription=Financial%20Modeling%20Prep%20API%20Key&envLink=https://site.financialmodelingprep.com/developer/docs)

#### Option B: Manual Deploy

1. **Push to GitHub**
   ```bash
   # Initialize git repo
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/insider-signal.git
   git branch -M main
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your `insider-signal` repo
   - Click "Import"

3. **Configure Environment Variables**
   - In the Vercel setup screen, add:
     - **Name:** `FMP_API_KEY`
     - **Value:** Your Financial Modeling Prep API key
   - Click "Deploy"

4. **Done!** 🎉
   - Vercel will build and deploy your app
   - You'll get a URL like `insider-signal.vercel.app`

### Step 3: Custom Domain (Optional)

1. Go to your project on Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## 🛠 Local Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/insider-signal.git
cd insider-signal

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local and add your FMP_API_KEY

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
insider-signal/
├── app/
│   ├── api/
│   │   ├── insider-buys/     # Daily insider purchases endpoint
│   │   ├── top-insiders/     # Top insiders leaderboard endpoint
│   │   └── institutional/    # Institutional holdings endpoint
│   ├── globals.css           # Global styles + Tailwind
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main dashboard
├── lib/
│   └── api.ts                # API utilities and types
├── .env.example              # Environment variables template
├── tailwind.config.ts        # Tailwind configuration
└── package.json
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FMP_API_KEY` | Yes | Your Financial Modeling Prep API key |
| `CACHE_DURATION` | No | Cache duration in seconds (default: 300) |

### API Rate Limits

The free FMP tier allows 250 requests/day. The app is optimized to minimize API calls:

- **Caching:** 5-minute server-side cache on all endpoints
- **Batching:** Company profiles fetched in batches
- **Auto-refresh:** Client refreshes every 5 minutes

For higher limits, consider upgrading to FMP's [paid plans](https://site.financialmodelingprep.com/pricing-plans).

## 📊 Data Sources

All data comes from official SEC filings via the Financial Modeling Prep API:

- **Form 4** — Insider trading transactions (purchases/sales)
- **Form 13F** — Institutional holdings (quarterly)
- **Company Profiles** — Basic company information

## 🎨 Customization

### Change Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  'signal-green': '#00ff88',     // Primary accent
  'signal-cyan': '#00ddff',      // Secondary accent
  'signal-gold': '#ffc800',      // Watchlist/highlights
  'signal-bg': '#0a0a0f',        // Background
}
```

### Add More Data

The FMP API offers many more endpoints you could integrate:

- Stock quotes and price history
- Company financials
- Analyst ratings
- News and press releases
- Earnings calendars

See the [FMP Documentation](https://site.financialmodelingprep.com/developer/docs) for all available endpoints.

## ⚠️ Disclaimer

This tool is for **informational purposes only**. 

- Data is derived from SEC filings and may contain errors
- Past insider trading patterns do not guarantee future stock performance
- This is **not financial advice**
- Always conduct your own research before investing
- Consider consulting a licensed financial advisor

## 📄 License

MIT License — feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
