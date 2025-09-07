# Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Fylaro Finance platform across different environments, from local development to production deployment on cloud infrastructure.

## Prerequisites

### System Requirements

- Node.js 18.0 or higher
- npm 8.0 or higher
- Git 2.30 or higher
- Docker 20.10 or higher (optional)
- PostgreSQL 13 or higher
- Redis 6.0 or higher

### Required Accounts and Services

- Arbitrum Sepolia testnet access
- Pinata IPFS account for document storage
- MongoDB Atlas or local MongoDB instance
- Vercel/Netlify account for frontend hosting
- AWS/GCP/Azure account for backend hosting (optional)

### Environment Setup

```bash
# Clone repository
git clone https://github.com/NileshRP010/fylaro-finternet-finance.git
cd fylaro-finternet-finance

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies (deployment-ready)
cd frontend-deploy
npm install
cd ..
```

## Local Development Deployment

### Database Setup

#### PostgreSQL Setup

```sql
-- Create database
CREATE DATABASE fylaro_finance;

-- Create user
CREATE USER fylaro_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE fylaro_finance TO fylaro_user;

-- Connect to database and create tables
\c fylaro_finance

-- Run migration scripts
-- (Tables will be created automatically by Sequelize migrations)
```

#### MongoDB Setup (Alternative)

```bash
# Start MongoDB locally
mongod --dbpath /data/db

# Or use MongoDB Atlas connection string
# mongodb+srv://username:password@cluster.mongodb.net/fylaro_finance
```

#### Redis Setup

```bash
# Start Redis locally
redis-server

# Or use Redis Cloud
# redis://username:password@hostname:port
```

### Smart Contract Deployment

#### Local Hardhat Network

```bash
# Start local Hardhat network
npx hardhat node

# Deploy contracts to local network
npx hardhat run scripts/deploy-full-ecosystem.js --network localhost

# Initialize contracts
npx hardhat run scripts/initialize-invoice-token.js --network localhost
```

#### Arbitrum Sepolia Deployment

```bash
# Set up environment variables
cp .env.example .env

# Edit .env with your configuration
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
PRIVATE_KEY=your_private_key_here
ARBISCAN_API_KEY=your_arbiscan_api_key

# Deploy to Arbitrum Sepolia
npx hardhat run scripts/deploy-full-ecosystem.js --network arbitrum-sepolia

# Verify contracts on Arbiscan
npm run verify:arbitrum-sepolia
```

### Backend Deployment

#### Environment Configuration

```bash
# Backend environment setup
cd backend
cp .env.example .env

# Configure backend environment
DATABASE_URL=postgresql://fylaro_user:secure_password@localhost:5432/fylaro_finance
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
ARBITRUM_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
CONTRACT_PRIVATE_KEY=your_contract_private_key
```

#### Start Backend Services

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start

# With PM2 (recommended for production)
npm install -g pm2
pm2 start ecosystem.config.js
```

### Frontend Deployment

#### Local Development

```bash
# Start frontend development server
cd frontend-deploy
npm run dev

# Access application at http://localhost:8080
```

#### Build for Production

```bash
# Build frontend for production
npm run build

# Preview production build
npm run preview
```

## Production Deployment

### Backend Production Deployment

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start application
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: fylaro_finance
      POSTGRES_USER: fylaro_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:6-alpine
    restart: unless-stopped

volumes:
  postgres_data:
```

#### AWS ECS Deployment

```yaml
# task-definition.json
{
  "family": "fylaro-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskRole",
  "containerDefinitions":
    [
      {
        "name": "fylaro-backend",
        "image": "your-ecr-repo/fylaro-backend:latest",
        "portMappings": [{ "containerPort": 3001, "protocol": "tcp" }],
        "environment": [{ "name": "NODE_ENV", "value": "production" }],
        "secrets":
          [
            {
              "name": "DATABASE_URL",
              "valueFrom": "arn:aws:secretsmanager:region:account:secret:database-url",
            },
          ],
        "logConfiguration":
          {
            "logDriver": "awslogs",
            "options":
              {
                "awslogs-group": "/ecs/fylaro-backend",
                "awslogs-region": "us-east-1",
                "awslogs-stream-prefix": "ecs",
              },
          },
      },
    ],
}
```

### Frontend Production Deployment

#### Vercel Deployment

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "@vite_api_base_url",
    "VITE_WEBSOCKET_URL": "@vite_websocket_url",
    "VITE_CHAIN_ID": "421614",
    "VITE_INVOICE_TOKEN_ADDRESS": "0x1FA52B372eC9675337D0c8ddF97CCEcC2c8Ba2B3"
  }
}
```

Deployment steps:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
vercel env add VITE_API_BASE_URL production
```

#### Netlify Deployment

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### AWS S3 + CloudFront Deployment

```bash
# Build the application
npm run build

# Sync to S3 bucket
aws s3 sync dist/ s3://your-bucket-name/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Infrastructure as Code

#### Terraform Configuration

```hcl
# main.tf
provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "fylaro_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "fylaro-vpc"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "fylaro_cluster" {
  name = "fylaro-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# RDS Instance
resource "aws_db_instance" "fylaro_db" {
  identifier           = "fylaro-database"
  engine              = "postgres"
  engine_version      = "13.7"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  storage_encrypted   = true

  db_name  = "fylaro_finance"
  username = "fylaro_user"
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.fylaro_db_subnet_group.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot = true

  tags = {
    Name = "fylaro-database"
  }
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "fylaro_cache_subnet" {
  name       = "fylaro-cache-subnet"
  subnet_ids = aws_subnet.private_subnets[*].id
}

resource "aws_elasticache_cluster" "fylaro_redis" {
  cluster_id           = "fylaro-redis"
  engine              = "redis"
  node_type           = "cache.t3.micro"
  num_cache_nodes     = 1
  parameter_group_name = "default.redis6.x"
  port                = 6379
  subnet_group_name   = aws_elasticache_subnet_group.fylaro_cache_subnet.name
  security_group_ids  = [aws_security_group.redis_sg.id]
}
```

## Monitoring and Logging

### Application Monitoring

#### Health Check Endpoints

```javascript
// Backend health check
app.get("/health", async (req, res) => {
  const health = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  };

  try {
    // Check database connection
    await sequelize.authenticate();
    health.database = "connected";

    // Check Redis connection
    await redisClient.ping();
    health.redis = "connected";

    // Check external services
    const pinataHealth = await checkPinataHealth();
    health.ipfs = pinataHealth ? "connected" : "disconnected";

    res.status(200).json(health);
  } catch (error) {
    health.status = "ERROR";
    health.error = error.message;
    res.status(503).json(health);
  }
});
```

#### Prometheus Metrics

```javascript
const prometheus = require("prom-client");

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
});

const httpRequestsTotal = new prometheus.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// Middleware to collect metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;

    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);

    httpRequestsTotal.labels(req.method, route, res.statusCode).inc();
  });

  next();
};

app.use(metricsMiddleware);
app.get("/metrics", (req, res) => {
  res.set("Content-Type", prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});
```

### Logging Configuration

#### Winston Logger Setup

```javascript
const winston = require("winston");
const { ElasticsearchTransport } = require("winston-elasticsearch");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: "fylaro-backend",
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  },
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

if (process.env.NODE_ENV === "production") {
  logger.add(
    new ElasticsearchTransport({
      level: "info",
      clientOpts: {
        node: process.env.ELASTICSEARCH_URL,
      },
      index: "fylaro-logs",
    })
  );
} else {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
```

## Security Configuration

### SSL/TLS Setup

#### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d api.fylaro.finance

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Nginx Configuration

```nginx
# /etc/nginx/sites-available/fylaro-api
server {
    listen 80;
    server_name api.fylaro.finance;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.fylaro.finance;

    ssl_certificate /etc/letsencrypt/live/api.fylaro.finance/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.fylaro.finance/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

## Backup and Recovery

### Database Backup Strategy

```bash
#!/bin/bash
# backup-script.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="fylaro_finance"
DB_USER="fylaro_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/fylaro_${DATE}.sql

# Compress backup
gzip $BACKUP_DIR/fylaro_${DATE}.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/fylaro_${DATE}.sql.gz s3://fylaro-backups/database/

# Cleanup old local backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

# Log backup completion
echo "$(date): Database backup completed: fylaro_${DATE}.sql.gz" >> /var/log/backup.log
```

### Smart Contract Backup

```javascript
// backup-contracts.js
const fs = require("fs");
const path = require("path");

async function backupContractData() {
  const contracts = [
    "InvoiceToken",
    "Marketplace",
    "Settlement",
    "PaymentTracker",
    "CreditScoring",
  ];

  const backup = {
    timestamp: new Date().toISOString(),
    network: "arbitrum-sepolia",
    contracts: {},
  };

  for (const contractName of contracts) {
    const contract = await ethers.getContractAt(
      contractName,
      contractAddresses[contractName]
    );

    // Backup critical state
    backup.contracts[contractName] = {
      address: contract.address,
      totalSupply: (await contract.totalSupply?.()) || null,
      owner: (await contract.owner?.()) || null,
      // Add other critical state variables
    };
  }

  // Save backup
  const backupPath = path.join(
    __dirname,
    "backups",
    `contracts_${Date.now()}.json`
  );
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

  console.log(`Contract backup saved to: ${backupPath}`);
}
```

## Performance Optimization

### Caching Strategy

#### Redis Caching

```javascript
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);

class CacheService {
  static async get(key) {
    try {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  static async set(key, value, ttl = 3600) {
    try {
      await client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  static async invalidate(pattern) {
    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      console.error("Cache invalidate error:", error);
    }
  }
}

// Cache middleware
const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}:${JSON.stringify(req.query)}`;

    const cached = await CacheService.get(key);
    if (cached) {
      return res.json(cached);
    }

    res.originalJson = res.json;
    res.json = function (data) {
      CacheService.set(key, data, ttl);
      res.originalJson.call(this, data);
    };

    next();
  };
};
```

### Database Optimization

#### Connection Pooling

```javascript
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000,
  },
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  retry: {
    match: [
      /ETIMEDOUT/,
      /EHOSTUNREACH/,
      /ECONNRESET/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /ESOCKETTIMEDOUT/,
      /EHOSTUNREACH/,
      /EPIPE/,
      /EAI_AGAIN/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
    ],
    max: 3,
  },
});
```

This comprehensive deployment guide covers all aspects of deploying the Fylaro Finance platform from development to production environments with proper monitoring, security, and optimization practices.
