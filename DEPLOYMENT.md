# Deployment Guide

## Prerequisites

- Docker and Docker Compose
- Domain name (for production)
- SSL certificates (recommended)

## Quick Start

### Development
```bash
# Clone repository
git clone <repository-url>
cd resume-portfolio

# Copy environment files
cp .env.example .env
cp nextjs/.env.example nextjs/.env.local
cp pdf-service/.env.example pdf-service/.env

# Start development services
docker-compose up --build
```

### Production

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Application Deployment
```bash
# Clone repository
git clone <repository-url>
cd resume-portfolio

# Configure environment
cp .env.example .env
# Edit .env with your domain and settings

# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d --build
```

#### 3. SSL Setup (Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Update nginx configuration for SSL
# Edit nginx/nginx.conf to include SSL settings
```

## Environment Variables

### Required
- `NODE_ENV`: Set to `production`
- `NEXT_PUBLIC_APP_URL`: Your domain URL
- `PDF_SERVICE_URL`: Internal PDF service URL

### Optional
- `LOG_LEVEL`: Logging level (info, debug, error)
- `WORKERS`: Number of PDF service workers
- `REDIS_URL`: Redis connection string

## Health Checks

- Frontend: `http://your-domain.com`
- PDF Service: `http://your-domain.com:8000/health`
- Redis: Internal service

## Monitoring

```bash
# View logs
docker-compose logs -f

# Check service status
docker-compose ps

# Restart services
docker-compose restart [service-name]
```

## Backup

```bash
# Backup Redis data
docker-compose exec redis redis-cli BGSAVE

# Backup application
tar -czf backup-$(date +%Y%m%d).tar.gz resume-portfolio/
```

## Troubleshooting

### PDF Generation Issues
1. Check PDF service logs: `docker-compose logs pdf-service`
2. Verify Redis connection: `docker-compose exec redis redis-cli ping`
3. Test PDF endpoint: `curl -X POST http://localhost:8000/api/pdf -H "Content-Type: application/json" -d '{"html":"<h1>Test</h1>","filename":"test.pdf"}'`

### Performance Issues
1. Increase PDF service workers in environment
2. Monitor Redis memory usage
3. Check Docker resource limits

### SSL Issues
1. Verify certificate validity: `sudo certbot certificates`
2. Renew certificates: `sudo certbot renew`
3. Check nginx configuration: `sudo nginx -t`