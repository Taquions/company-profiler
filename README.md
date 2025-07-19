# 🏢 Company Profiler

An AI-powered company analysis tool that automatically generates comprehensive company profiles by analyzing website content. Built with Next.js, TypeScript, and advanced AI integration.

## ✨ Features

### 🤖 AI-Powered Analysis
- **Website Content Extraction**: Automatically scrapes and analyzes company websites
- **Company Logo Detection**: Retrieves and displays company logos
- **Service Line Generation**: AI-generated service descriptions based on website analysis
- **Keyword Extraction**: Automatically identifies Tier 1 and Tier 2 keywords
- **Contact Information Mining**: Extracts emails and contact details

### 🎨 Modern UI/UX
- **Fully Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark/Light Theme Support**: Built-in theme switching
- **Animated Gradients**: Beautiful background animations
- **Modal-Based Interactions**: Smooth modal workflows
- **Loading States**: Engaging progress indicators

### 📊 Profile Management
- **Interactive Editing**: Edit all profile fields inline
- **JSON Export**: Export profiles in JSON format
- **Real-time Updates**: Live preview of changes
- **Data Validation**: Built-in form validation

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS + DaisyUI**: Modern styling framework
- **Custom Hooks**: Reusable React hooks for data management
- **Service Architecture**: Modular service layer
- **Error Handling**: Comprehensive error management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd mccarren-challenge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── agent/                 # AI agent logic
│   │   ├── handlers/          # Response handlers
│   │   ├── services/          # Business logic services
│   │   ├── tools/             # AI tools and utilities
│   │   └── types/             # TypeScript definitions
│   ├── api/                   # API routes
│   │   ├── agent/             # Main agent endpoint
│   │   └── logo/              # Logo retrieval endpoint
│   ├── components/            # React components
│   │   ├── ui/                # UI components
│   │   └── [modals/pages]     # Feature components
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom React hooks
│   └── utils/                 # Utility functions
```

## 🛠 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test:ut` - Run unit tests with Vitest

## 🎯 How It Works

### 1. **Website Analysis**
   - User enters a company website URL
   - AI agent analyzes the website content
   - Extracts company information, services, and contacts

### 2. **Profile Generation**
   - Creates structured company profile
   - Generates service lines using AI
   - Identifies relevant keywords
   - Retrieves company logo

### 3. **Interactive Editing**
   - Users can edit any field in the profile
   - Add custom service lines manually or via AI
   - Export final profile as JSON

## 🧪 Testing

Run unit tests:
```bash
npm run test:ut
```

Run specific test file:
```bash
npm run test:ut "filename"
```

## 🎨 Styling

The project uses:
- **Tailwind CSS** for utility-first styling
- **DaisyUI** for component library
- **Custom CSS Variables** for theming
- **Responsive Design** with mobile-first approach

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=your_api_url
```

### Tailwind Configuration
Styling is configured in:
- `tailwind.config.js`
- `src/app/globals.css`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Deploy automatically on every push to main

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 API Endpoints

- `POST /api/agent` - Main AI agent analysis
- `POST /api/agent/service-lines` - Generate service lines
- `GET /api/logo` - Retrieve company logo

## 🔍 Features in Detail

### AI Agent Tools
- `getWebsiteContent` - Scrapes website content
- `getCompanyLogo` - Retrieves company logos
- `redirectToProfile` - Navigation handling
- `returnToHomeWithError` - Error handling

### Custom Hooks
- `useAgentChat` - AI conversation management
- `useAsyncLogo` - Logo loading
- `useProfileData` - Profile state management
- `useServiceLineGeneration` - AI service generation

### Services
- `LogoService` - Logo management and caching
- `ServiceLineGenerator` - AI-powered service generation
- `UserCacheService` - User data caching

## 📱 Responsive Breakpoints

- **Mobile**: `< 640px`
- **Tablet**: `sm: ≥ 640px`
- **Desktop Small**: `md: ≥ 768px`
- **Desktop Medium**: `lg: ≥ 1024px`
- **Desktop Large**: `xl: ≥ 1280px`

## 🏗 Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [DaisyUI](https://daisyui.com/) - Component library
- [Vitest](https://vitest.dev/) - Testing framework

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

---

Built with ❤️ by the development team
