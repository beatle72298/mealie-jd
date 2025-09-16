# Mealie-JD Server Deployment Guide

## Quick Deployment

Your custom Mealie container is now publicly available and can be deployed on any server with Docker without authentication.

### Simple Docker Run
```bash
# Pull the image
docker pull ghcr.io/beatle72298/mealie-jd:latest

# Run the container
docker run -d \
  --name mealie-personal \
  -p 9000:9000 \
  -v mealie-data:/app/data \
  --restart unless-stopped \
  ghcr.io/beatle72298/mealie-jd:latest
```

### Docker Compose Deployment (Recommended)

1. **Create `docker-compose.yml` on your server:**
```yaml
services:
  mealie:
    container_name: mealie-personal
    image: ghcr.io/beatle72298/mealie-jd:latest
    restart: unless-stopped
    volumes:
      - mealie-data:/app/data/
    ports:
      - "9000:9000"
    environment:
      # Basic Configuration
      ALLOW_SIGNUP: "false"
      LOG_LEVEL: "INFO"
      
      # Database Configuration
      DB_ENGINE: sqlite
      
      # Security Settings (CHANGE THIS!)
      SECRET_KEY: "your-unique-secret-key-here"
      
      # Optional: Change default credentials
      # DEFAULT_EMAIL: "admin@example.com"
      # DEFAULT_PASSWORD: "your-secure-password"

volumes:
  mealie-data:
    driver: local
```

2. **Deploy:**
```bash
docker-compose up -d
```

## Updates

When you push a new version, update your server:

```bash
# Pull latest image
docker pull ghcr.io/beatle72298/mealie-jd:latest

# Restart with new image
docker-compose down && docker-compose up -d
```

## Access

- **URL:** `http://your-server-ip:9000`
- **Default Login:** `changeme@example.com` / `MyPassword`

## Features

This custom build includes:
- ✅ **Notes section moved above cooking steps**
- ✅ All standard Mealie features
- ✅ SQLite database (no additional setup required)

## Troubleshooting

**Check logs:**
```bash
docker logs mealie-personal
# or with docker-compose
docker-compose logs -f
```

**Check if running:**
```bash
docker ps | grep mealie
```

**Test connectivity:**
```bash
curl -I http://localhost:9000
```