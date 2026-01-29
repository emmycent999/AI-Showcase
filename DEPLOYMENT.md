# Deployment Guide

## 1. GitHub Setup

```bash
cd "C:\Users\PC\Downloads\AI Showcase"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-showcase.git
git push -u origin main
```

## 2. Vercel Deployment (Frontend)

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variable:
   - `REACT_APP_API_URL` = Your App Runner URL (add after backend deployment)
6. Click "Deploy"

## 3. AWS App Runner Deployment (Backend)

### Prerequisites
- AWS Account
- AWS CLI installed
- Docker installed (optional, App Runner builds from source)

### Option A: Deploy from GitHub (Recommended)

1. Go to AWS Console → App Runner
2. Click "Create service"
3. **Source**:
   - Repository type: Source code repository
   - Connect to GitHub
   - Select your repository
   - Branch: `main`
   - Source directory: `server`
4. **Build settings**:
   - Runtime: Node.js 16
   - Build command: `npm install`
   - Start command: `node index.js`
   - Port: `5000`
5. **Service settings**:
   - Service name: `ai-showcase-backend`
   - CPU: 1 vCPU
   - Memory: 2 GB
6. **Environment variables** (Add all from .env):
   ```
   SUPABASE_URL=your_value
   SUPABASE_ANON_KEY=your_value
   SUPABASE_SERVICE_ROLE_KEY=your_value
   EMAIL_HOST=smtp.zoho.com
   EMAIL_PORT=465
   EMAIL_USER=info@cscveritas.xyz
   EMAIL_PASS=your_value
   ADMIN_EMAIL=admin
   ADMIN_PASSWORD=veritas2026
   PORT=5000
   ```
7. Click "Create & deploy"
8. Copy the App Runner URL (e.g., `https://xxxxx.us-east-1.awsapprunner.com`)

### Option B: Deploy with Dockerfile

Create `server/Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

Then follow Option A but select "Container registry" instead.

## 4. Update Frontend with Backend URL

1. Go back to Vercel
2. Settings → Environment Variables
3. Add/Update: `REACT_APP_API_URL` = Your App Runner URL
4. Redeploy

## 5. Certificate Templates

Upload certificate PNG files to server:
- Create `certificates` folder in server directory
- Upload: `Participant.png`, `Organizers.png`, `Alumni.png`

For App Runner, use S3:
1. Create S3 bucket
2. Upload certificate templates
3. Update `server/utils/pdfGenerator.js` to read from S3

## 6. Test Deployment

- Frontend: `https://your-app.vercel.app`
- Backend: `https://xxxxx.awsapprunner.com/api/validate?email=test@test.com`

## Troubleshooting

- **CORS errors**: Check App Runner allows your Vercel domain
- **Certificate generation fails**: Ensure templates are accessible
- **Email not sending**: Verify Zoho credentials and port 465 is open
