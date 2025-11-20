# TalentRAG Frontend - Next.js

Modern, animated UI for AI-powered resume screening with RAG-based chat interface.

## Features
- JWT Authentication (Login/Register)
- Drag-and-drop file upload
- Animated match analysis with circular progress
- RAG-powered Q&A chat interface
- Responsive design with Tailwind CSS
- Cold start handling for backend (Render free tier)

## Local Development

### Prerequisites
- Node.js 16+ and npm

### Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Variables**

Create `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

3. **Run Development Server**
```bash
npm run dev
```

App available at: `http://localhost:3000`

## Deployment to Vercel

### Step 1: Prepare Repository
1. Ensure `.env.local` is in `.gitignore`
2. Push code to GitHub
3. Make sure `package.json` and `next.config.js` are committed

### Step 2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend` (if in subdirectory)
   - **Build Command**: `npm run build` (auto)
   - **Output Directory**: `.next` (auto)

### Step 3: Environment Variables
In Vercel project settings, add:

```
NEXT_PUBLIC_API_BASE_URL = https://your-backend.onrender.com/api
```

Replace `your-backend.onrender.com` with your actual Render backend URL.

### Step 4: Deploy
1. Click **Deploy**
2. Vercel will build and deploy automatically
3. Your app will be live at: `https://your-app.vercel.app`

### Step 5: Update Backend CORS
After deployment, update your backend's `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'https://your-app.vercel.app',
    'http://localhost:3000',  # for local dev
]
```

Redeploy backend after changing CORS settings.

## Cold Start Handling

The frontend automatically handles Render's free tier cold start (50-60 second delay):

### Features Implemented:
1. **Extended Timeout**: API requests wait up to 90 seconds
2. **Loading States**: Clear UI feedback during cold start
3. **Retry Logic**: Automatic retry on timeout
4. **User Feedback**: Informative messages about cold start delay

### What Happens:
- First request after 15min inactivity triggers backend wake-up
- UI shows "Waking up backend server..." message
- User sees progress indicator
- Request completes once backend is ready

## Project Structure

```
frontend/
├── components/
│   ├── AuthPanel.tsx       # Login/Register
│   ├── UploadForm.tsx      # File upload with cold start handling
│   ├── MatchAnalysis.tsx   # Animated results display
│   └── ChatInterface.tsx   # RAG Q&A interface
├── pages/
│   ├── _app.tsx           # Next.js app wrapper
│   └── index.tsx          # Main application
├── styles.css             # Global styles + animations
└── tailwind.config.js     # Tailwind configuration
```

## Key Components

### AuthPanel
- Toggle between login/register
- JWT token management
- Error handling

### UploadForm
- Drag-and-drop for resume/JD
- Cold start detection and handling
- File validation (PDF/TXT)
- Progress indicators

### MatchAnalysis
- Circular animated progress (0-100%)
- Strengths/Gaps cards with gradients
- Key Insights section
- Staggered animations

### ChatInterface
- Demo question suggestions
- Message history with avatars
- Source citations (RAG context)
- Typing indicators
- Auto-scroll

## Environment Variables

### Development (`.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### Production (Vercel)
```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com/api
```

## Troubleshooting

### Backend Not Responding
- Check `NEXT_PUBLIC_API_BASE_URL` is correct
- Verify backend is deployed and running
- Check browser console for CORS errors
- Wait 60s if cold starting (free tier)

### CORS Errors
- Ensure frontend URL is in backend `CORS_ALLOWED_ORIGINS`
- Check backend `settings.py` has correct origins
- Redeploy backend after CORS changes

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check token expiration (24 hours default)
- Verify backend `/api/auth/token/` endpoint works

### Build Errors
- Run `npm install` to ensure all deps installed
- Check Node.js version (16+ required)
- Clear `.next` folder: `rm -rf .next`

## Tech Stack
- Next.js 14.2.3
- React 18.2.0
- TypeScript 5.4.5
- Tailwind CSS 3.4.1
- Custom animations (fadeIn, slideIn)

## Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## License
MIT
