# Delta Final Stretch - MindJourney Lab Experience

## Project Overview

Delta Final Stretch is a React/TypeScript lab experience application based on the MindJourney v4 architecture. This project provides a 4-page immersive lab experience with video playback, interactive chat, and session management capabilities.

## Project Structure

```
MindJourneyFINAL-STRETCH/
├── client/                     # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ui/            # Shadcn/ui component library
│   │   │   ├── chat-interface.tsx
│   │   │   ├── video-player.tsx
│   │   │   └── ...
│   │   ├── pages/             # Application pages
│   │   │   ├── experiment.tsx  # Main lab experience
│   │   │   ├── settings.tsx
│   │   │   └── not-found.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities and configuration
│   │   └── assets/            # Static assets and fonts
│   ├── public/                # Public assets
│   │   └── videos/            # Video files for lab experience
│   └── index.html             # Main HTML template
├── server/                     # Express.js backend
│   ├── index.ts               # Main server entry point
│   ├── routes.ts              # API routes
│   ├── db.ts                  # Database configuration
│   ├── storage.ts             # File storage handling
│   └── klaviyo-service.ts     # Email integration
├── shared/                     # Shared TypeScript types
│   └── schema.ts              # Database schema definitions
├── migrations/                 # Database migrations
├── attached_assets/           # Additional project assets
├── docs/                      # Documentation
└── uploads/                   # File uploads directory
```

## Technology Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.6.3** - Type-safe development
- **Vite 5.4.19** - Fast build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Shadcn/ui (Radix UI)** - Modern React component library
- **Framer Motion 11.13.1** - Animation library
- **React Query (TanStack) 5.60.5** - Data fetching and state management
- **Wouter 3.3.5** - Lightweight React router

### Backend
- **Express.js 4.21.2** - Web application framework
- **TypeScript** - Type-safe server development
- **Drizzle ORM 0.39.1** - Type-safe database ORM
- **PostgreSQL** - Primary database (via @neondatabase/serverless)
- **Express Session** - Session management
- **Multer** - File upload handling
- **WebSocket (ws)** - Real-time communication

### Development Tools
- **ESBuild** - Fast JavaScript bundler
- **PostCSS** - CSS processing
- **Drizzle Kit** - Database migration tool

## Key Features

### 4-Page Lab Experience Architecture
1. **Hypothesis Page** - Initial user input and hypothesis formation
2. **Chat Interface** - Interactive AI-powered conversation
3. **Contact Page** - User information collection
4. **Hub Page** - Results and completion summary

### Video Playback Capabilities
- High-quality video streaming
- Custom video player components
- Fullscreen video containers
- Post-submission video sequences

### Session Management
- Express sessions with PostgreSQL storage
- Visitor numbering system
- Progress tracking across pages
- Data persistence

### Database Integration
- Drizzle ORM with PostgreSQL
- Type-safe database operations
- Automated migrations
- Mock database for development

### UI Components
- Complete Shadcn/ui component library
- Custom styled components for lab experience
- Responsive design with Tailwind CSS
- Accessible UI patterns

## Environment Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Environment Variables
Create a `.env` file with the following variables:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
NODE_ENV=development
SESSION_SECRET=your_session_secret_here
KLAVIYO_API_KEY=your_klaviyo_key_here  # For email automation
```

### Installation & Development

**Note: Node modules are already installed. To start development:**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run check

# Push database schema
npm run db:push
```

### Development Server
- Frontend: http://localhost:5173 (Vite dev server)
- Backend: http://localhost:3000 (Express server)

## Database Schema

The application uses Drizzle ORM with PostgreSQL. Key tables include:
- User sessions and progress tracking
- Experiment data and responses
- File uploads and media handling

Run migrations:
```bash
npm run db:push
```

## API Endpoints

### Core Routes
- `POST /api/hypothesis` - Submit hypothesis data
- `GET/POST /api/chat` - Chat interface interactions
- `POST /api/contact` - Contact form submission
- `GET /api/visitor-number` - Get unique visitor number
- `POST /api/upload` - File upload handling

### Session Management
- Session-based user tracking
- Visitor numbering system
- Progress persistence

## Asset Management

### Video Assets
Located in `client/public/videos/`:
- `hypothesis-post-submission.mp4`
- `level1-welcome.mp4`
- `level1-forest.mp4`
- `level1-chat-loop.mp4`
- `level[2-5].mp4`

### Fonts
Custom font integration:
- MagdaClean Regular (included in assets)
- Google Fonts integration

### Images and Media
- Logo assets in `attached_assets/`
- Generated images for UI elements
- Responsive image handling

## Development Standards

### TypeScript Configuration
- Strict type checking enabled
- Path aliases configured (@/, @shared/)
- Modern ES modules support

### Code Organization
- Component-based React architecture
- Custom hooks for reusable logic
- Utility functions in lib/
- Shared types and schemas

### Styling Approach
- Tailwind CSS for utility-first styling
- CSS custom properties for theming
- Component-specific styles
- Dark mode support

## Integration Capabilities

### Email Automation (Klaviyo)
- Contact form integration
- Automated email sequences
- User journey tracking

### File Storage
- Local file uploads
- Google Drive integration (configured)
- Firebase storage support

### Real-time Features
- WebSocket connections
- Live chat functionality
- Progress synchronization

## Testing

Test files included:
- `test-visitor-numbering.js` - Visitor numbering system
- `test-contact-endpoint.js` - Contact form functionality
- `test-klaviyo.sh` - Email integration testing

## Production Deployment

### Build Process
```bash
npm run build
```
This creates:
- Optimized frontend bundle in `dist/public/`
- Server bundle in `dist/index.js`

### Server Requirements
- Node.js runtime
- PostgreSQL database
- Environment variables configured
- File upload directory permissions

## Next Steps for Development Agents

### AGENT B: UI/UX Enhancement
1. **Component Refinement**
   - Enhance chat interface styling
   - Improve video player controls
   - Refine progress tracking visuals
   - Add loading states and transitions

2. **User Experience**
   - Implement smooth page transitions
   - Add accessibility improvements
   - Optimize mobile responsiveness
   - Enhance error handling UI

### AGENT C: Backend Enhancement
1. **API Development**
   - Implement chat AI integration
   - Add data validation middleware
   - Enhance session management
   - Implement rate limiting

2. **Database Optimization**
   - Add database indexing
   - Implement data archiving
   - Add backup procedures
   - Optimize query performance

### AGENT D: Testing & Quality
1. **Testing Implementation**
   - Add unit tests for components
   - Implement integration tests
   - Add end-to-end testing
   - Performance testing

2. **Quality Assurance**
   - Code quality checks
   - Security audit
   - Performance monitoring
   - Error tracking setup

### AGENT E: Deployment & DevOps
1. **Production Setup**
   - Docker containerization
   - CI/CD pipeline setup
   - Environment configuration
   - Monitoring and logging

2. **Performance Optimization**
   - Bundle size optimization
   - CDN setup for assets
   - Database performance tuning
   - Caching implementation

## Architecture Decisions

### Frontend Framework Choice
- React 18 chosen for concurrent features and ecosystem
- TypeScript for type safety and developer experience
- Vite for fast development and building

### Backend Framework
- Express.js for simplicity and ecosystem
- Drizzle ORM for type-safe database operations
- PostgreSQL for reliability and features

### State Management
- React Query for server state
- React hooks for local state
- Session-based user state persistence

### Styling Solution
- Tailwind CSS for rapid development
- Shadcn/ui for consistent component library
- CSS custom properties for theming

## Performance Considerations

### Frontend Optimization
- Code splitting implemented
- Lazy loading for routes
- Image optimization
- Bundle analysis available

### Backend Optimization
- Database connection pooling
- Session store optimization
- File upload size limits
- API response caching

## Security Features

### Data Protection
- Environment variable security
- Session-based authentication
- File upload validation
- SQL injection prevention

### Privacy Considerations
- Session data handling
- User data retention policies
- GDPR compliance ready
- Data export capabilities

---

**Project Status**: ✅ Fully Initialized and Ready for Development

**Last Updated**: August 21, 2025

**Development Team**: Multi-agent development system ready for specialized agent deployment