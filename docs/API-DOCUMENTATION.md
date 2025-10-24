# Sentinela PIX - API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Endpoints](#endpoints)
   - [Authentication](#authentication-endpoints)
   - [User Management](#user-management-endpoints)
   - [Fraud Reports](#fraud-report-endpoints)
   - [Risk Analysis](#risk-analysis-endpoints)
   - [Notifications](#notification-endpoints)
   - [System](#system-endpoints)
7. [WebSocket API](#websocket-api)
8. [Response Codes](#http-response-codes)

## Overview

The Sentinela PIX API is a RESTful API that provides access to fraud detection, reporting, and notification services. All API responses are returned in JSON format.

**API Version**: v1.0
**Base Protocol**: REST
**Authentication**: JWT Bearer Token
**Content-Type**: application/json

## Base URL

### Development
```
http://localhost:3001/api/v1
```

### Production
```
https://api.sentinela-pix.com/api/v1
```

## Authentication

### JWT Token Authentication

All protected endpoints require a valid JWT token in the Authorization header.

```http
Authorization: Bearer {jwt_token}
```

### Token Lifecycle

- **Expiration**: 3600 seconds (1 hour)
- **Refresh**: Automatic refresh before expiration
- **Revocation**: On logout or password change

### Obtaining a Token

Tokens are obtained through the `/auth/login` endpoint after successful authentication.

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      "field": "Specific field error information"
    },
    "timestamp": "2024-10-24T10:30:00Z",
    "path": "/api/v1/endpoint"
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Invalid email or password |
| `TOKEN_EXPIRED` | JWT token has expired |
| `TOKEN_INVALID` | JWT token is malformed or invalid |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Internal server error |

## Rate Limiting

### Limits

- **Authenticated Requests**: 100 requests per minute per user
- **Unauthenticated Requests**: 20 requests per minute per IP
- **WebSocket Connections**: 5 concurrent connections per user

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1635087600
```

## Endpoints

### Authentication Endpoints

#### Register New User

Creates a new user account.

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe",
  "cpf": "12345678901",
  "phone": "+5511999999999",
  "bank": "Banco do Brasil"
}
```

**Success Response (201 Created)**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "createdAt": "2024-10-24T10:30:00Z"
}
```

**Error Responses**
- `400 Bad Request`: Invalid input data
- `409 Conflict`: Email already registered
- `422 Unprocessable Entity`: Validation errors

#### User Login

Authenticates a user and returns JWT token.

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200 OK)**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "lastLogin": "2024-10-24T10:30:00Z"
}
```

**Error Responses**
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account inactive or locked
- `429 Too Many Requests`: Rate limit exceeded

#### User Logout

Invalidates the current JWT token.

```http
POST /auth/logout
Authorization: Bearer {token}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### Refresh Token

Refreshes an expiring JWT token.

```http
POST /auth/refresh
Authorization: Bearer {token}
```

**Success Response (200 OK)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### User Management Endpoints

#### Get Current User Profile

Returns the authenticated user's profile information.

```http
GET /users/me
Authorization: Bearer {token}
```

**Success Response (200 OK)**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "cpf": "12345678901",
  "phone": "+5511999999999",
  "bank": "Banco do Brasil",
  "twoFactorEnabled": false,
  "createdAt": "2024-10-01T10:30:00Z",
  "lastLogin": "2024-10-24T10:30:00Z",
  "statistics": {
    "reportsSent": 15,
    "fraudsDetected": 8,
    "successRate": 53.33
  }
}
```

#### Update User Profile

Updates the authenticated user's profile information.

```http
PUT /users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "full_name": "John Smith",
  "phone": "+5511888888888",
  "bank": "Itaú"
}
```

**Success Response (200 OK)**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": "John Smith",
  "phone": "+5511888888888",
  "bank": "Itaú",
  "updatedAt": "2024-10-24T10:35:00Z"
}
```

#### Change Password

Changes the authenticated user's password.

```http
PUT /users/me/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses**
- `401 Unauthorized`: Current password incorrect
- `422 Unprocessable Entity`: Password validation failed

#### Register FCM Token

Registers a Firebase Cloud Messaging token for push notifications.

```http
POST /users/fcm-token
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "fcmToken": "fGcI-8xqTQmX7Y..."
}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "FCM token registered successfully",
  "updatedAt": "2024-10-24T10:30:00Z"
}
```

#### Delete Account

Permanently deletes the authenticated user's account and all associated data.

```http
DELETE /users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "password": "currentPassword123",
  "confirmation": "DELETE"
}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### Fraud Report Endpoints

#### Create Fraud Report

Creates a new fraud report.

```http
POST /reports
Authorization: Bearer {token}
Content-Type: application/json

{
  "pixKey": "fraudster@email.com",
  "pixKeyType": "email",
  "amount": 5000.00,
  "transactionId": "E12345678",
  "victimBank": "Banco do Brasil",
  "fraudsterBank": "Itaú",
  "description": "Detailed description of the fraud incident"
}
```

**Success Response (201 Created)**
```json
{
  "reportId": "660e8400-e29b-41d4-a716-446655440001",
  "pixKey": "fraudster@email.com",
  "amount": 5000.00,
  "status": "pending",
  "riskScore": 45,
  "createdAt": "2024-10-24T10:30:00Z",
  "estimatedResponseTime": "2 hours"
}
```

**PIX Key Types**
- `email`: Email address
- `phone`: Phone number (+5511999999999)
- `cpf`: CPF (Brazilian tax ID)
- `cnpj`: CNPJ (Brazilian company ID)
- `random`: Random key (UUID format)

#### Get All Reports

Retrieves a paginated list of fraud reports.

```http
GET /reports?status=pending&limit=20&offset=0&sortBy=createdAt&order=desc
Authorization: Bearer {token}
```

**Query Parameters**
- `status` (optional): Filter by status (pending, confirmed, false_positive, resolved)
- `limit` (optional): Number of results per page (default: 20, max: 100)
- `offset` (optional): Number of results to skip (default: 0)
- `sortBy` (optional): Field to sort by (createdAt, amount, riskScore)
- `order` (optional): Sort order (asc, desc)
- `dateFrom` (optional): Filter reports from date (ISO 8601)
- `dateTo` (optional): Filter reports until date (ISO 8601)
- `minAmount` (optional): Minimum transaction amount
- `maxAmount` (optional): Maximum transaction amount

**Success Response (200 OK)**
```json
{
  "reports": [
    {
      "reportId": "660e8400-e29b-41d4-a716-446655440001",
      "pixKey": "fraudster@email.com",
      "amount": 5000.00,
      "status": "pending",
      "victimBank": "Banco do Brasil",
      "createdAt": "2024-10-24T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "totalPages": 8,
    "currentPage": 1
  }
}
```

#### Get Report by ID

Retrieves detailed information about a specific fraud report.

```http
GET /reports/{reportId}
Authorization: Bearer {token}
```

**Success Response (200 OK)**
```json
{
  "reportId": "660e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "pixKey": "fraudster@email.com",
  "pixKeyType": "email",
  "amount": 5000.00,
  "transactionId": "E12345678",
  "victimBank": "Banco do Brasil",
  "fraudsterBank": "Itaú",
  "description": "Detailed description",
  "status": "pending",
  "riskScore": 45,
  "createdAt": "2024-10-24T10:30:00Z",
  "updatedAt": "2024-10-24T10:30:00Z",
  "timeline": [
    {
      "event": "report_created",
      "timestamp": "2024-10-24T10:30:00Z",
      "description": "Report submitted"
    }
  ]
}
```

#### Update Report Status

Updates the status of a fraud report.

```http
PUT /reports/{reportId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Fraud confirmed by investigation"
}
```

**Valid Status Values**
- `pending`: Report submitted, awaiting review
- `confirmed`: Fraud confirmed
- `false_positive`: Not a fraud case
- `resolved`: Case resolved

**Success Response (200 OK)**
```json
{
  "reportId": "660e8400-e29b-41d4-a716-446655440001",
  "status": "confirmed",
  "updatedAt": "2024-10-24T11:00:00Z"
}
```

#### Delete Report

Deletes a fraud report.

```http
DELETE /reports/{reportId}
Authorization: Bearer {token}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

**Note**: Only the report creator or administrators can delete reports.

### Risk Analysis Endpoints

#### Get Risk Score for PIX Key

Retrieves risk analysis for a specific PIX key.

```http
GET /keys/{pixKey}/risk
Authorization: Bearer {token}
```

**Success Response (200 OK)**
```json
{
  "pixKey": "fraudster@email.com",
  "pixKeyType": "email",
  "riskLevel": "HIGH_RISK",
  "riskScore": 85,
  "reportCount": 5,
  "firstReportDate": "2024-10-15T14:30:00Z",
  "lastReportDate": "2024-10-24T09:15:00Z",
  "totalAmount": 25000.00,
  "affectedInstitutions": [
    "Banco do Brasil",
    "Itaú",
    "Bradesco"
  ],
  "riskFactors": [
    "Multiple reports in short timeframe",
    "High transaction amounts",
    "Multiple victim institutions"
  ],
  "recommendation": "Block transactions to this key"
}
```

**Risk Levels**
- `LOW_RISK`: 0-25 points
- `MEDIUM_RISK`: 26-50 points
- `HIGH_RISK`: 51-75 points
- `CRITICAL_RISK`: 76-100 points

#### Bulk Risk Analysis

Analyzes risk for multiple PIX keys in a single request.

```http
POST /keys/risk/bulk
Authorization: Bearer {token}
Content-Type: application/json

{
  "pixKeys": [
    "key1@email.com",
    "key2@email.com",
    "+5511999999999"
  ]
}
```

**Success Response (200 OK)**
```json
{
  "results": [
    {
      "pixKey": "key1@email.com",
      "riskLevel": "HIGH_RISK",
      "riskScore": 85,
      "reportCount": 5
    },
    {
      "pixKey": "key2@email.com",
      "riskLevel": "LOW_RISK",
      "riskScore": 15,
      "reportCount": 1
    },
    {
      "pixKey": "+5511999999999",
      "riskLevel": "MEDIUM_RISK",
      "riskScore": 40,
      "reportCount": 2
    }
  ],
  "processedAt": "2024-10-24T10:30:00Z"
}
```

### Notification Endpoints

#### Get User Notifications

Retrieves notifications for the authenticated user.

```http
GET /notifications?unread=true&limit=50&offset=0
Authorization: Bearer {token}
```

**Query Parameters**
- `unread` (optional): Filter by unread status (true/false)
- `type` (optional): Filter by notification type
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Number to skip (default: 0)

**Success Response (200 OK)**
```json
{
  "notifications": [
    {
      "notificationId": "770e8400-e29b-41d4-a716-446655440002",
      "type": "fraud_alert",
      "title": "New Fraud Report",
      "message": "A fraud report matching your institution was submitted",
      "icon": "warning",
      "color": "red",
      "readAt": null,
      "createdAt": "2024-10-24T10:30:00Z",
      "data": {
        "reportId": "660e8400-e29b-41d4-a716-446655440001"
      }
    }
  ],
  "unreadCount": 5,
  "total": 50
}
```

#### Mark Notification as Read

Marks a specific notification as read.

```http
PUT /notifications/{notificationId}/read
Authorization: Bearer {token}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "notificationId": "770e8400-e29b-41d4-a716-446655440002",
  "readAt": "2024-10-24T10:35:00Z"
}
```

#### Mark All Notifications as Read

Marks all notifications as read for the authenticated user.

```http
PUT /notifications/read-all
Authorization: Bearer {token}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "markedCount": 15,
  "readAt": "2024-10-24T10:35:00Z"
}
```

#### Create Notification

Creates a new notification (admin or system use).

```http
POST /notifications/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "type": "fraud_alert",
  "title": "New Fraud Alert",
  "message": "Suspicious activity detected on account",
  "icon": "warning",
  "color": "red",
  "data": {
    "reportId": "660e8400-e29b-41d4-a716-446655440001"
  }
}
```

**Success Response (201 Created)**
```json
{
  "notificationId": "770e8400-e29b-41d4-a716-446655440002",
  "deliveryStatus": "sent_via_websocket",
  "createdAt": "2024-10-24T10:30:00Z"
}
```

#### Delete Notification

Deletes a specific notification.

```http
DELETE /notifications/{notificationId}
Authorization: Bearer {token}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

### System Endpoints

#### Health Check

Checks the health status of the API and its dependencies.

```http
GET /health
```

**Success Response (200 OK)**
```json
{
  "status": "healthy",
  "timestamp": "2024-10-24T10:30:00Z",
  "uptime": 86400,
  "version": "1.0.0",
  "services": {
    "database": {
      "status": "connected",
      "responseTime": 5
    },
    "websocket": {
      "status": "running",
      "connections": 42
    },
    "firebase": {
      "status": "connected",
      "responseTime": 150
    }
  },
  "system": {
    "memoryUsage": "45%",
    "cpuUsage": "12%",
    "diskSpace": "70% free"
  }
}
```

#### API Status

Returns detailed API status and statistics.

```http
GET /status
Authorization: Bearer {token}
```

**Success Response (200 OK)**
```json
{
  "apiVersion": "1.0.0",
  "environment": "production",
  "timestamp": "2024-10-24T10:30:00Z",
  "statistics": {
    "totalReports": 1520,
    "totalUsers": 850,
    "activeUsers": 142,
    "totalNotifications": 5420,
    "averageResponseTime": 125
  },
  "rateLimit": {
    "limit": 100,
    "remaining": 95,
    "reset": 1635087600
  }
}
```

## WebSocket API

### Connection

```
ws://localhost:3001/ws (development)
wss://api.sentinela-pix.com/ws (production)
```

### Connection Authentication

After establishing WebSocket connection, send identification message:

```json
{
  "type": "identify",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Message Types

#### Server to Client: Notification

```json
{
  "type": "notification",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "type": "fraud_alert",
    "title": "New Fraud Report",
    "message": "A new fraud has been reported",
    "icon": "warning",
    "color": "red",
    "timestamp": "2024-10-24T10:30:00Z",
    "data": {
      "reportId": "660e8400-e29b-41d4-a716-446655440001"
    }
  }
}
```

#### Client to Server: Mark Read

```json
{
  "type": "notification_read",
  "notificationId": "770e8400-e29b-41d4-a716-446655440002"
}
```

#### Server to Client: Connection Status

```json
{
  "type": "connection_status",
  "status": "connected",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-10-24T10:30:00Z"
}
```

#### Heartbeat (Bidirectional)

```json
{
  "type": "ping"
}
```

Response:
```json
{
  "type": "pong",
  "timestamp": "2024-10-24T10:30:00Z"
}
```

## HTTP Response Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content to return |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 502 | Bad Gateway | Upstream service error |
| 503 | Service Unavailable | Service temporarily unavailable |

## Postman Collection

Import the following Postman collection to test all endpoints:

[Download Postman Collection](./postman/sentinela-pix-api.json)

## SDK Support

Official SDKs are planned for:
- JavaScript/TypeScript (Node.js and Browser)
- Python
- Java
- PHP

## API Versioning

The API uses URL versioning. Current version is v1.

Future versions will be accessible at:
```
https://api.sentinela-pix.com/api/v2
```

## Support

For API support and questions:
- GitHub Issues: https://github.com/MatheusGino71/A3-sistemas/issues
- Email: support@sentinela-pix.com

---

**Last Updated**: October 2024
**API Version**: 1.0.0
