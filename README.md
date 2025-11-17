# Resume Portfolio

A modern, full-stack resume portfolio application built with Next.js and FastAPI, featuring PDF generation capabilities, Google OAuth authentication, and complete version control system.

## 🚀 Features

- **Modern UI**: Built with Next.js 14, React, and Tailwind CSS
- **PDF Generation**: FastAPI-powered PDF service using WeasyPrint with dynamic data rendering
- **Authentication**: Google OAuth integration for secure admin access
- **Version Control**: Complete resume version tracking with Prisma database
- **Admin Panel**: Secure `/admin` route for resume editing with live preview
- **Dark Mode**: Theme switching with next-themes
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Type Safety**: Full TypeScript support
- **Containerized**: Docker and Docker Compose for easy deployment
- **Caching**: Redis integration for improved performance
- **Security**: Built-in security headers and input sanitization

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- Google Cloud Project (for OAuth)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python web framework
- **WeasyPrint** - PDF generation with dynamic templates
- **Redis** - Caching layer
- **Uvicorn** - ASGI server
- **Prisma** - Database ORM for version tracking
- **SQLite** - Database for resume versions

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Reverse proxy (production)
- **Docker Compose** - Multi-container orchestration

### Authentication & Security
- **NextAuth.js** - Authentication framework
- **Google OAuth** - Secure sign-in
- **Admin-only access** - Email whitelist protection

## 🚀 Getting Started

### Development Mode

1. **Clone the repository**
```bash
git clone <repository-url>
cd resume-portfolio
```

2. **Set up environment variables**
```bash
# Copy example env files
cp nextjs/.env.example nextjs/.env.local
cp .env.example .env
```

3. **Configure Google OAuth**
- Create Google Cloud Project
- Enable Google+ API
- Create OAuth 2.0 credentials
- Set environment variables in `.env`

4. **Start all services**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

5. **Access the application**
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin (requires Google OAuth)
- PDF Service: http://localhost:8000
- Redis: localhost:6379

### Production Mode

1. **Build and start production containers**
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

2. **Access the application**
- Application: http://localhost (via Nginx)

## 🔧 Development

### Environment Variables

**Root .env file**
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
PDF_SERVICE_URL=http://pdf-service:8000
NEXT_PUBLIC_PDF_SERVICE_URL=http://localhost:8000

# Authentication (Required for admin access)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ADMIN_EMAIL=your-email@gmail.com

# Database
DATABASE_URL="file:./dev.db"
```

### Available Scripts

**Next.js**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

**Python Service**
- `uvicorn main:app --reload` - Start development server
- `pytest` - Run tests (when implemented)

## 📄 API Documentation

### PDF Generation Endpoints

**Generate PDF from HTML**
```
POST /api/pdf
```
Request Body:
```json
{
  "html": "<html>...</html>",
  "filename": "resume.pdf"
}
```

**Generate PDF from Resume Data**
```
POST /api/resume-pdf
```
Request Body:
```json
{
  "resume_data": {...},
  "filename": "resume.pdf",
  "page_size": "A4",
  "margin": "0.5in"
}
```

### Resume Management Endpoints

**Get Active Resume**
```
GET /api/resume
```

**Update Resume (Admin Only)**
```
PUT /api/resume
```
Request Body:
```json
{
  "data": {...},
  "comment": "Version comment"
}
```

**Get Version History (Admin Only)**
```
GET /api/resume/versions
```

**Revert to Version (Admin Only)**
```
POST /api/resume/versions
```
Request Body:
```json
{
  "versionId": "version-id"
}
```

**Generate PDF from Specific Version**
```
GET /api/generate-pdf?version=version-id
```

### Health Check
```
GET /health
```
Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🔐 Admin Features

### Authentication
1. **Google OAuth Setup**:
   - Create Google Cloud Project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **Admin Access**:
   - Only users with whitelisted email can access `/admin`
   - Secure session management with NextAuth.js
   - Automatic redirect to sign-in for unauthorized access

### Resume Management
1. **Version Control**:
   - All changes tracked in database
   - Original `resume.json` preserved
   - Comment system for version tracking
   - One-click revert to any previous version

2. **Admin Panel Features**:
   - JSON editor with syntax highlighting
   - Live HTML preview with A4 sizing
   - Version history sidebar
   - PDF generation from any version
   - Restore original data functionality

3. **PDF Generation**:
   - Dynamic template rendering from JSON data
   - Version-specific PDF downloads
   - Consistent styling between preview and PDF
   - Caching for improved performance

## 🔒 Security Features
- **Google OAuth Authentication**: Secure admin access
- **Email Whitelist**: Only authorized users can access admin panel
- **Content Security Policy**: Headers for XSS protection
- **CORS Configuration**: Controlled cross-origin requests
- **Input Sanitization**: Safe handling of user input
- **Secure File Handling**: Protected file operations
- **Rate Limiting**: Request throttling (production)
- **Session Management**: Secure authentication sessions

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose -f docker-compose.dev.yml up --build

# Start services in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up --build web

# Remove all containers and volumes
docker-compose down -v
```

## 🔧 Troubleshooting

### Common Issues

1. **Docker Build Fails**:
   ```bash
   # Clean and rebuild
   docker-compose down -v
   docker system prune -f
   docker-compose up --build
   ```

2. **Authentication Issues**:
   - Verify Google OAuth credentials
   - Check `ADMIN_EMAIL` matches your Google account
   - Ensure `NEXTAUTH_URL` matches your domain

3. **Database Issues**:
   ```bash
   # Reset database
   cd nextjs
   rm prisma/dev.db
   npm run db:push
   ```

4. **PDF Generation Issues**:
   - Check PDF service logs: `docker-compose logs pdf-service`
   - Verify resume data format
   - Ensure all required fields are present

## 🗺️ Roadmap
- ✅ Add authentication (Google OAuth)
- ✅ Implement resume version control
- ✅ Add admin panel for resume editing
- ✅ Dynamic PDF generation from data
- 🔄 Implement resume templates
- 🔄 Add project showcase section
- 🔄 Integrate blog functionality
- 🔄 Add analytics dashboard
- 🔄 Implement CI/CD pipeline
- 🔄 Add automated testing
- 🔄 Performance optimizations

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments
- **Next.js** team for the amazing framework
- **FastAPI** for the high-performance Python framework
- **WeasyPrint** for PDF generation capabilities
- **Tailwind CSS** for the utility-first CSS framework
- **NextAuth.js** for seamless authentication
- **Prisma** for excellent database tooling
- **Google** for OAuth services

## 📞 Support
For support, email robelfekadu@gmail.com or open an issue in the repository.