# Frontend-Backend Integration Complete

## Setup Instructions

### 1. Start Backend Server
```bash
cd "C:\Users\PC\Downloads\AI Showcase\server"
npm run dev
```
Server runs on: http://localhost:5000

### 2. Start Frontend
```bash
cd "C:\Users\PC\Downloads\AI Showcase\AI SHOW SYSTEM"
npm run dev
```
Frontend runs on: http://localhost:5173 (Vite default)

### 3. Database Setup
Ensure Supabase tables are created:
- registrations table
- votes table

SQL scripts are in the main README.md

## API Integration Summary

### Register Page
- Connects to: POST /api/register
- Maps form fields to backend schema
- Shows success badge on completion

### Vote Page
- Connects to: POST /api/vote
- Validates registered email
- Prevents duplicate voting

### Admin Page
- Connects to: GET /api/admin/registrations
- Requires admin credentials in headers
- Displays all registrations with filters

## Admin Credentials
Email: admin@example.com
Password: secure_password

(Change these in .env file)

## API Configuration
All API endpoints are centralized in: src/config/api.ts
Change VITE_API_URL in .env for production deployment
