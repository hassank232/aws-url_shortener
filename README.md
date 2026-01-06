# URL Shortener - Serverless Full-Stack Application

Full-stack serverless URL shortener built with TypeScript, deployed on AWS with global CDN distribution and real-time analytics.

🔗 **Live Demo:** https://d1yn9748vp9aub.cloudfront.net

📺 **Watch Full Demo Video:** [COMING SOON]


### Video Walkthrough
The video demonstrates:
- Live URL shortening in action
- Copy-to-clipboard functionality
- DynamoDB real-time data updates
- AWS infrastructure overview

---

## Description

URL shortener that transforms long URLs into short, shareable links. Built entirely with TypeScript and deployed on AWS serverless infrastructure, this application demonstrates cloud-native architecture patterns, microservices design, and scalable NoSQL database implementation.

The application handles URL shortening, redirect management, and click tracking with atomic counters to prevent race conditions—all while scaling automatically and costing essentially nothing to run.

---

## Features

**URL Shortening** - Convert long URLs into short, shareable links  
**Instant Redirects** - HTTP 301 permanent redirects with click tracking  
**Copy to Clipboard** - One-click copying with visual feedback  
**Click Analytics** - Real-time click tracking with atomic counters  
**URL Validation** - Frontend and backend validation for security  
**Global CDN** - Fast loading worldwide via CloudFront  
**HTTPS Enabled** - Free SSL certificate included  
**Responsive Design** - Works on desktop, tablet, and mobile  

---

## Tech Stack

| Category          | Technology                                   |
|-------------------|----------------------------------------------|
| **Frontend**      | Next.js, React, TypeScript, Tailwind CSS     |
| **Backend**       | AWS Lambda (Node.js), TypeScript             |
| **API**           | AWS API Gateway (REST API)                   |
| **Database**      | AWS DynamoDB (NoSQL)                         |
| **CDN & Hosting** | AWS S3, CloudFront                           |
| **Monitoring**    | AWS CloudWatch                               |
| **Security**      | AWS IAM, CORS                                |

---

## Architecture
```
                          User's Browser
                                │
                ┌───────────────┴───────────────┐
                ↓                               ↓
         CloudFront CDN                  API Gateway
    (Global Edge Locations)         (REST API Endpoints)
                │                               │
                ↓                               ↓
         S3 Static Website            ┌─────────┴─────────┐
      (React Frontend Files)          ↓                   ↓
                             Lambda: shortenUrl    Lambda: redirectUrl
                             (Create short URLs)   (Redirect + clicks)
                                      │                   │
                                      └─────────┬─────────┘
                                                ↓
                                         DynamoDB Table
                                       (URL mappings + clicks)
```

### **Request Flow:**

#### **Shortening a URL:**
1. User enters long URL in frontend
2. Frontend validates URL format
3. POST request to `/shorten` endpoint
4. API Gateway triggers `shortenUrl` Lambda
5. Lambda generates random 6-character code
6. Lambda saves mapping to DynamoDB
7. Returns short code to frontend

#### **Clicking a Short URL:**
1. User clicks shortened link
2. GET request to `/{shortCode}` endpoint
3. API Gateway triggers `redirectUrl` Lambda
4. Lambda queries DynamoDB for long URL
5. Lambda **atomically increments** click counter
6. Returns HTTP 301 redirect
7. Browser automatically redirects to destination

---

## API Endpoints

| Endpoint          | Method | Lambda      | Purpose          | Response                                    |
|-------------------|--------|-------------|------------------|---------------------------------------------|
| `/shorten`        | POST   | shortenUrl  | Create short URL | `{"shortCode": "abc123", "longUrl": "..."}` |
| `/{shortCode}`    | GET    | redirectUrl | Redirect user    | HTTP 301 to long URL                        |
| `/api/{shortCode}`| GET    | getUrl      | Get analytics    | `{"shortCode": "...", "clicks": 5, ...}`    |

**Live API Base URL:** `https://ilcz7i7t4d.execute-api.us-east-1.amazonaws.com/dev`

---

## Key Technical Implementations

### **1. Microservices Architecture**
Each Lambda function has a single responsibility:
- **shortenUrl** - URL creation only
- **redirectUrl** - User-facing redirects
- **getUrl** - Analytics API (read-only)

### **2. Serverless Benefits**
- **Auto-scaling:** Handles 0 to millions of requests
- **Pay-per-use:** Only charged when functions run
- **No server management:** AWS handles infrastructure
- **Global distribution:** CloudFront serves from 400+ edge locations

---

## What I Learned

- Built production-ready serverless REST APIs with AWS Lambda and TypeScript  
- Designed NoSQL data models in DynamoDB with proper primary key selection  
- Implemented atomic operations to prevent race conditions  
- Configured API Gateway with Lambda proxy integration for RESTful endpoints  
- Deployed Next.js static sites to S3 with CloudFront CDN  
- Managed AWS infrastructure with CLI 
- Used CloudWatch for logging and monitoring serverless applications  
- Configured CORS policies for cross-origin API access  
- Applied least-privilege security with IAM roles and policies

---

## AWS Infrastructure

### **DynamoDB Table Schema:**
```
Table: url-mappings
Primary Key: shortCode (String)
Attributes:
  - longUrl (String)
  - clicks (Number)
  - createdAt (String - timestamp)
```

### **Lambda Functions:**

| Function    | Runtime  | Triggers                         |
|-------------|----------|----------------------------------|
| shortenUrl  | Node.js  | API Gateway POST /shorten        |
| getUrl      | Node.js  | API Gateway GET /api/{shortCode} |
| redirectUrl | Node.js  | API Gateway GET /{shortCode}     |

---

## Contact

**Hassan Khalid**

- Email: hassank2413@gmail.com  
- LinkedIn: [linkedin.com/in/hassankhalid24](https://linkedin.com/in/hassankhalid24)  
- Portfolio: [hk24.netlify.app](https://hk24.netlify.app)  

---