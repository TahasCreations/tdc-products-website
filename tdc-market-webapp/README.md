# TDC Market - Web App

Türkiye'nin Tasarım & Figür Pazarı - Next.js 14 Web Application

## 🚀 Features

- **Next.js 14** with App Router
- **Tailwind CSS** with TDC Design System
- **TypeScript** for type safety
- **Responsive Design** for all devices
- **SEO Optimized** with meta tags
- **Performance Optimized** for Vercel
- **Accessibility** compliant (WCAG 2.1)

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Icons:** Remix Icons
- **Fonts:** Inter, Manrope
- **Deployment:** Vercel

## 📦 Dependencies

### Production
- `next` - Next.js framework
- `react` - React library
- `react-dom` - React DOM
- `remixicon` - Icon library
- `clsx` - Utility for conditional classes

### Development
- `typescript` - TypeScript compiler
- `tailwindcss` - CSS framework
- `autoprefixer` - CSS autoprefixer
- `postcss` - CSS processor
- `eslint` - Code linter

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- NPM 8+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tdc-market-webapp

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
tdc-market-webapp/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── Header.tsx      # Site header
│   │   ├── Footer.tsx      # Site footer
│   │   └── home/           # Home page components
│   └── data/               # Mock data
│       └── seed.ts         # Sample data
├── public/                 # Static assets
├── next.config.js          # Next.js config
├── tailwind.config.ts      # Tailwind config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

## 🎨 Design System

### Colors
- **Primary:** #5A63F2 (TDC Indigo)
- **Accent:** #FF7A59 (Coral)
- **Success:** #2BD9AF
- **Warning:** #F59E0B
- **Ink:** #0F172A

### Typography
- **Headings:** Inter (sans-serif)
- **Body:** Manrope (sans-serif)
- **Display:** Clash Display (serif)

### Spacing
- 8pt grid system
- Consistent spacing scale

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Deploy!

### Manual Build

```bash
# Build the application
npm run build

# The build output will be in .next/
```

## 🔧 Configuration

### Environment Variables

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Vercel Settings

- **Framework:** Next.js
- **Root Directory:** `/` (root)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

## 📊 Performance

- **Lighthouse Score:** 90+
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Time to Interactive:** < 3s

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
node test-build.js
```

## 📝 License

Private - TDC Market

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, email support@tdcmarket.com or create an issue on GitHub.

---

**Built with ❤️ by TDC Market Team**