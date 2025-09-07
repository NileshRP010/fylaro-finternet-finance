# API Documentation

## Overview

The Fylaro Finance API provides comprehensive endpoints for invoice tokenization, marketplace operations, and user management. This RESTful API is built with Node.js/Express and follows OpenAPI 3.0 specifications.

## Base URL

```
Development: http://localhost:3001/api
Production: https://your-api-domain.com/api
```

## Authentication

All protected endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Core Endpoints

### Authentication

#### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "userType": "business",
  "companyName": "Example Corp",
  "walletAddress": "0x742d35Cc2C3c7e3..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "user_123",
    "email": "user@example.com",
    "userType": "business",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/login

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "userType": "business",
      "walletAddress": "0x742d35Cc2C3c7e3..."
    }
  }
}
```

### Invoice Management

#### POST /invoices/upload

Upload and tokenize a new invoice.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**

```
file: [invoice.pdf]
invoiceData: {
  "invoiceNumber": "INV-2025-001",
  "amount": "10000.00",
  "currency": "USD",
  "dueDate": "2025-12-31",
  "buyerName": "Client Company",
  "description": "Consulting services"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Invoice uploaded and tokenized successfully",
  "data": {
    "invoiceId": "inv_456",
    "tokenId": "1",
    "ipfsHash": "QmX7KV9...",
    "contractAddress": "0x1FA52B372eC9675337D0c8ddF97CCEcC2c8Ba2B3",
    "transactionHash": "0xa1b2c3d4..."
  }
}
```

#### GET /invoices

Retrieve user's invoices with pagination.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (pending, verified, funded, paid)
- `sortBy`: Sort field (createdAt, amount, dueDate)
- `sortOrder`: Sort direction (asc, desc)

**Response:**

```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "inv_456",
        "invoiceNumber": "INV-2025-001",
        "amount": "10000.00",
        "currency": "USD",
        "status": "verified",
        "tokenId": "1",
        "fundingProgress": 75.5,
        "createdAt": "2025-09-07T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### GET /invoices/:id

Retrieve detailed invoice information.

**Response:**

```json
{
  "success": true,
  "data": {
    "invoice": {
      "id": "inv_456",
      "invoiceNumber": "INV-2025-001",
      "amount": "10000.00",
      "currency": "USD",
      "status": "verified",
      "tokenId": "1",
      "ipfsHash": "QmX7KV9...",
      "contractAddress": "0x1FA52B372eC9675337D0c8ddF97CCEcC2c8Ba2B3",
      "creditScore": 85,
      "riskRating": "B+",
      "fundingProgress": 75.5,
      "investors": 12,
      "dueDate": "2025-12-31",
      "verificationDetails": {
        "kycVerified": true,
        "documentVerified": true,
        "fraudCheck": "passed"
      }
    }
  }
}
```

### Marketplace

#### GET /marketplace/invoices

Browse available invoices for investment.

**Query Parameters:**

- `page`: Page number
- `limit`: Items per page
- `minAmount`: Minimum invoice amount
- `maxAmount`: Maximum invoice amount
- `riskRating`: Filter by risk rating (A+, A, B+, B, C+, C)
- `industry`: Filter by industry sector
- `daysToMaturity`: Maximum days to maturity

**Response:**

```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "inv_789",
        "invoiceNumber": "INV-2025-002",
        "amount": "15000.00",
        "currency": "USD",
        "riskRating": "A-",
        "creditScore": 92,
        "industry": "Technology",
        "daysToMaturity": 45,
        "expectedYield": 8.5,
        "fundingProgress": 32.0,
        "minimumInvestment": "100.00"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### POST /marketplace/invest

Invest in a tokenized invoice.

**Request Body:**

```json
{
  "invoiceId": "inv_789",
  "amount": "1000.00",
  "currency": "USD"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Investment successful",
  "data": {
    "investmentId": "invest_101",
    "invoiceId": "inv_789",
    "amount": "1000.00",
    "tokensReceived": "1000",
    "transactionHash": "0xa1b2c3d4...",
    "expectedReturn": "1085.00",
    "maturityDate": "2025-12-31"
  }
}
```

### Trading

#### GET /trading/orderbook/:pair

Retrieve order book for a trading pair.

**Parameters:**

- `pair`: Trading pair (e.g., "INV1-USDC")

**Response:**

```json
{
  "success": true,
  "data": {
    "pair": "INV1-USDC",
    "lastPrice": "1.025",
    "priceChange24h": "+2.5%",
    "volume24h": "50000.00",
    "bids": [
      {
        "price": "1.020",
        "amount": "5000",
        "total": "5100.00"
      }
    ],
    "asks": [
      {
        "price": "1.030",
        "amount": "3000",
        "total": "3090.00"
      }
    ]
  }
}
```

#### POST /trading/orders

Place a trading order.

**Request Body:**

```json
{
  "pair": "INV1-USDC",
  "type": "limit",
  "side": "buy",
  "amount": "1000",
  "price": "1.025"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "order_555",
    "pair": "INV1-USDC",
    "type": "limit",
    "side": "buy",
    "amount": "1000",
    "price": "1.025",
    "status": "pending",
    "createdAt": "2025-09-07T10:30:00Z"
  }
}
```

### Credit Scoring

#### GET /credit/score/:userId

Retrieve credit score for a user.

**Response:**

```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "creditScore": 785,
    "riskRating": "A-",
    "scoringFactors": {
      "paymentHistory": 85,
      "businessStability": 78,
      "industryRisk": 82,
      "financialHealth": 88,
      "collateralValue": 75
    },
    "recommendations": [
      "Improve payment consistency for better scoring",
      "Diversify customer base to reduce concentration risk"
    ],
    "lastUpdated": "2025-09-07T10:30:00Z"
  }
}
```

### Documents

#### POST /documents/upload

Upload documents to IPFS with encryption.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**

```
file: [document.pdf]
metadata: {
  "documentType": "invoice",
  "description": "Invoice for consulting services",
  "accessLevel": "private"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "documentId": "doc_999",
    "ipfsHash": "QmX7KV9...",
    "encryptionKey": "encrypted_key_hash",
    "accessUrl": "https://gateway.pinata.cloud/ipfs/QmX7KV9...",
    "uploadedAt": "2025-09-07T10:30:00Z"
  }
}
```

## WebSocket Events

### Connection

```javascript
const socket = io("ws://localhost:3001", {
  auth: {
    token: "your-jwt-token",
  },
});
```

### Events

#### invoice_status_update

Triggered when invoice status changes.

```javascript
socket.on("invoice_status_update", (data) => {
  console.log("Invoice status updated:", data);
  // {
  //   invoiceId: 'inv_456',
  //   status: 'funded',
  //   fundingProgress: 100.0,
  //   timestamp: '2025-09-07T10:30:00Z'
  // }
});
```

#### trade_executed

Triggered when a trade is executed.

```javascript
socket.on("trade_executed", (data) => {
  console.log("Trade executed:", data);
  // {
  //   orderId: 'order_555',
  //   pair: 'INV1-USDC',
  //   price: '1.025',
  //   amount: '1000',
  //   timestamp: '2025-09-07T10:30:00Z'
  // }
});
```

#### payment_received

Triggered when payment is received for an invoice.

```javascript
socket.on("payment_received", (data) => {
  console.log("Payment received:", data);
  // {
  //   invoiceId: 'inv_456',
  //   amount: '10000.00',
  //   currency: 'USD',
  //   settlementStarted: true,
  //   timestamp: '2025-09-07T10:30:00Z'
  // }
});
```

## Error Handling

All API responses follow a consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "amount",
        "message": "Amount must be greater than 0"
      }
    ]
  }
}
```

### Common Error Codes

- `AUTHENTICATION_REQUIRED`: Missing or invalid authentication
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `VALIDATION_ERROR`: Request validation failed
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_SERVER_ERROR`: Unexpected server error

## Rate Limiting

API endpoints are rate-limited to ensure fair usage:

- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute
- Upload endpoints: 10 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1693123200
```
