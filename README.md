# Resume Portfolio

A modern, full-stack resume portfolio application built with Next.js and FastAPI, featuring PDF generation capabilities.

## 🚀 Features

- **Modern UI**: Built with Next.js 14, React, and Tailwind CSS
- **PDF Generation**: FastAPI-powered PDF service using WeasyPrint
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

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python web framework
- **WeasyPrint** - PDF generation
- **Redis** - Caching layer
- **Uvicorn** - ASGI server

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Reverse proxy (production)
- **Docker Compose** - Multi-container orchestration

## 🚀 Getting Started

### Development Mode

1. **Clone the repository**
```bash
git clone <repository-url>
cd resume-portfolio
2.
Set up environment variables
bash
# Copy example env files
cp nextjs/.env.example nextjs/.env.local
cp pdf-service/.env.example pdf-service/.env
3.
Start all services
bash
docker-compose up --build
4.
Access the application
Frontend: http://localhost:3000
PDF Service: http://localhost:8000
Redis: localhost:6379
Production Mode
1.
Build and start production containers
bash
docker-compose -f docker-compose.prod.yml up --build -d
2.
Access the application
Application: http://localhost (via Nginx)
📁 Project Structure
resume-portfolio/
├── nextjs/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utility functions
│   │   ├── types/         # TypeScript type definitions
│   │   ├── data/          # Static data (resume.json)
│   │   └── styles/        # Global styles
│   ├── public/            # Static assets
│   ├── Dockerfile         # Frontend container config
│   ├── package.json       # Node dependencies
│   └── tsconfig.json      # TypeScript config
│
├── pdf-service/           # Python PDF generation service
│   ├── services/          # Business logic
│   │   ├── cache.py      # Redis caching
│   │   └── pdf_generator.py
│   ├── utils/            # Utility functions
│   │   └── security.py   # Input sanitization
│   ├── main.py           # FastAPI application
│   ├── Dockerfile        # Backend container config
│   ├── requirements.txt  # Python dependencies
│   └── pyproject.toml    # Python project config
│
├── nginx/                # Nginx configuration
│   └── nginx.conf
│
├── docker-compose.yml    # Development orchestration
├── docker-compose.prod.yml # Production orchestration
└── README.md            # This file
🔧 Development
Frontend Development
bash
cd nextjs
npm install
npm run dev
Backend Development
bash
cd pdf-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
Available Scripts
Next.js
npm run dev - Start development server
npm run build - Build for production
npm run start - Start production server
npm run lint - Run ESLint
npm run type-check - Run TypeScript compiler
Python Service
uvicorn main:app --reload - Start development server
pytest - Run tests (when implemented)
🐳 Docker Commands
bash
# Build and start all services
docker-compose up --build

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
📝 Configuration
Environment Variables
Next.js (.env.local)
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PDF_SERVICE_URL=http://pdf-service:8000
PDF Service (.env)
LOG_LEVEL=debug
REDIS_URL=redis://redis:6379
WORKERS=2
🔒 Security Features
Content Security Policy headers
XSS protection
CORS configuration
Input sanitization
Secure file handling
Rate limiting (production)
📄 API Documentation
PDF Generation Endpoint
POST /api/pdf
Generate a PDF from HTML content.
Request Body:
{
  "html": "<html>...</html>",
  "filename": "resume.pdf"
}
Response:
Content-Type: application/pdf
Binary PDF data
Health Check
GET /health
Check service health status.
Response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z"
}
🤝 Contributing
1.
Fork the repository
2.
Create a feature branch (git checkout -b feature/amazing-feature)
3.
Commit your changes (git commit -m 'Add amazing feature')
4.
Push to the branch (git push origin feature/amazing-feature)
5.
Open a Pull Request
📜 License
This project is licensed under the MIT License - see the LICENSE file for details.
🙏 Acknowledgments
Next.js team for the amazing framework
FastAPI for the high-performance Python framework
WeasyPrint for PDF generation capabilities
Tailwind CSS for the utility-first CSS framework
📞 Support
For support, email your-email@example.com or open an issue in the repository.
🗺️ Roadmap
Add authentication
Implement resume templates
Add project showcase section
Integrate blog functionality
Add analytics dashboard
Implement CI/CD pipeline
Add automated testing
Performance optimizations
