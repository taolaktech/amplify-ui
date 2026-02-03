# Amplify Backend - Template-Based Ad Generation Platform

NestJS backend for template-based ad generation using Google Gemini for AI-powered template parsing and creative generation.

## Tech Stack

- **Framework**: NestJS 10
- **Database**: MongoDB with Mongoose
- **Storage**: AWS S3 (templates + generated creatives)
- **AI Engine**: Google Gemini (Gems) for template parsing and creative generation
- **Auth**: Firebase Admin (validates tokens from existing auth system)
- **Credits**: Integrated credit system with usage tracking
- **Logging**: Winston with daily rotate files
- **Documentation**: Swagger/OpenAPI

## Project Structure

```
amplify-backend/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   └── modules/
│       ├── auth/                  # Authentication & authorization
│       │   ├── guards/            # Auth guards
│       │   ├── strategies/        # Firebase strategy
│       │   └── decorators/        # @CurrentUser
│       ├── templates/             # Template ingestion & parsing
│       ├── campaigns/             # Campaign management & generation
│       ├── credits/               # Credit usage tracking
│       ├── ai/                    # Gemini service for AI operations
│       ├── storage/               # S3 storage service
│       ├── audit/                 # Audit logging
│       └── health/                # Health check endpoint
├── Dockerfile
├── docker-compose.yml             # Production compose
├── docker-compose.dev.yml         # Development compose
└── .env.example                   # Environment variables template
```

## Architecture

```
User → UI → API
API → S3 (Templates)
API → Google Gemini (Transform / Generate)
API → MongoDB
API → S3 (Generated Ads)
```

### Key Services

- **Gemini Service**: Template parsing & creative generation
- **Template Service**: Template lifecycle management
- **Campaign Service**: Campaign orchestration & creative generation
- **Credit Service**: Usage tracking & enforcement

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB 7+ (or use Docker)
- npm or yarn

### Local Development

1. **Clone and install dependencies**:
   ```bash
   cd amplify-backend
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB** (if not using Docker):
   ```bash
   # Using Docker for MongoDB only
   docker run -d -p 27017:27017 --name amplify-mongo \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD=password \
     mongo:7
   ```

4. **Run the development server**:
   ```bash
   npm run start:dev
   ```

5. **Access the API**:
   - API: http://localhost:4000/api/v1
   - Swagger Docs: http://localhost:4000/api/docs
   - Health Check: http://localhost:4000/api/v1/health

### Using Docker Compose (Development)

```bash
# Start all services (API + MongoDB + Mongo Express)
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f api

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Using Docker Compose (Production)

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 4000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `AWS_REGION` | AWS region for S3 | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes |
| `AWS_S3_BUCKET_NAME` | S3 bucket for templates | Yes |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key | Yes |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `OPENAI_MODEL` | OpenAI model (default: gpt-4-turbo-preview) | No |
| `NANOBABABA_API_URL` | Nanobababa API URL | Yes |
| `NANOBABABA_API_KEY` | Nanobababa API key | Yes |
| `AMPLIFY_WALLET_API_URL` | Existing wallet API URL for subscriptions | Yes |
| `LOG_LEVEL` | Logging level (default: info) | No |
| `LOG_DIR` | Log files directory (default: logs) | No |
| `CORS_ORIGIN` | Allowed CORS origin (default: http://localhost:3000) | No |

## API Endpoints

### Health
- `GET /api/v1/health` - Health check

### Templates
- `GET /api/v1/templates` - List all templates with filters
- `GET /api/v1/templates/:id` - Get template by ID
- `GET /api/v1/templates/:id/parsed` - Get parsed JSON for a template
- `POST /api/v1/templates` - Create template (auth required)
- `POST /api/v1/templates/parse` - Parse template using Gemini (auth required)
- `PUT /api/v1/templates/:id` - Update template (auth required)
- `DELETE /api/v1/templates/:id` - Delete template (auth required)

### Campaigns
- `POST /api/v1/campaigns` - Create a new campaign (auth required)
- `GET /api/v1/campaigns` - Get all campaigns for current user (auth required)
- `GET /api/v1/campaigns/:id` - Get campaign by ID (auth required)
- `GET /api/v1/campaigns/:id/creatives` - Get creatives for a campaign (auth required)
- `POST /api/v1/campaigns/generate` - Generate creatives for a campaign (auth required)
- `POST /api/v1/campaigns/estimate-credits` - Estimate credits required (auth required)
- `DELETE /api/v1/campaigns/:id` - Delete a campaign (auth required)

### Credits
- `GET /api/v1/credits` - Get current credit balance (auth required)
- `GET /api/v1/credits/history` - Get credit transaction history (auth required)
- `GET /api/v1/credits/usage` - Get credit usage for a period (auth required)

## Authentication

The API uses Firebase tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

The backend validates tokens using Firebase Admin SDK and integrates with the existing Amplify Wallet API for subscription validation.

## Credit System

The platform uses a credit-based system for ad generation:

| Action | Credits |
|--------|---------|
| Image generation | 1 credit |
| Video generation | 3 credits |

Features:
- Real-time credit deduction
- Per-campaign credit breakdown
- Historical credit usage chart
- Block generation when credits are insufficient

## Data Models

### Template
```json
{
  "_id": "templateId",
  "type": "image | video",
  "sourceS3Url": "string",
  "parsedJson": {},
  "status": "pending | parsing | active | failed"
}
```

### Creative
```json
{
  "_id": "creativeId",
  "campaignId": "string",
  "type": "image | video",
  "outputS3Url": "string",
  "creditsUsed": 1,
  "createdAt": "date"
}
```

### Campaign
```json
{
  "_id": "campaignId",
  "products": [],
  "templates": [],
  "creatives": [],
  "totalCreditsUsed": 0,
  "status": "draft | generating | generated | published"
}
```

## Logging & Audit Trail

Winston logger is configured with:
- Console output (colorized in development)
- Daily rotating log files in `logs/` directory
- Separate error log files
- Audit trail logs for tracking user actions

Audit events are logged for:
- Template creation, updates, deletions
- Ad saves/unsaves
- Template usage

## Deployment

### Standalone Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start in production:
   ```bash
   npm run start:prod
   ```

### Docker Deployment

```bash
# Build image
docker build -t amplify-backend .

# Run container
docker run -d -p 4000:4000 \
  --env-file .env \
  --name amplify-backend \
  amplify-backend
```

### Cloud Deployment

The backend can be deployed to:
- **AWS ECS/Fargate** - Use the Dockerfile
- **Google Cloud Run** - Use the Dockerfile
- **Heroku** - Add a Procfile: `web: npm run start:prod`
- **Railway/Render** - Connect to Git repository

## Connecting to Frontend

Update the frontend to use this backend by setting the API URL:

```typescript
// In your frontend .env
NEXT_PUBLIC_DASHBOARD_API_URL=http://localhost:4000/api/v1
```

Then update API calls in the frontend to use this new backend for dashboard v2 features.

## Development

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## License

UNLICENSED - Private
