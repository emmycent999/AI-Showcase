# Admin Dashboard Troubleshooting

## Steps to Debug

### 1. Check Backend Server
Make sure the backend is running:
```bash
cd server
npm run dev
```

You should see: `Server running on port 5000`

### 2. Check Browser Console
Open browser DevTools (F12) and check Console tab for:
- "Fetching admin data..."
- "Registrations response: 200"
- "Teams response: 200"
- "Votes response: 200"

If you see errors, note the status codes.

### 3. Test API Endpoints Directly

Open these URLs in browser:
- http://localhost:5000/api/teams (should return [])
- Test registration: Register a test user first

### 4. Check Database
In Supabase, verify:
- `registrations` table exists and has data
- `teams` table exists
- `votes` table exists

### 5. Common Issues

**Issue: "Failed to fetch"**
- Backend server not running
- Wrong port (should be 5000)
- CORS issue

**Issue: "401 Unauthorized"**
- Admin credentials wrong
- Check .env file: ADMIN_EMAIL and ADMIN_PASSWORD

**Issue: "No records found"**
- Database is empty
- Register test users first
- Check Supabase connection

**Issue: "Cannot add team"**
- Check browser console for error
- Verify teams table exists in Supabase
- Check admin authentication

### 6. Quick Test

1. Start backend: `cd server && npm run dev`
2. Start frontend: `cd "AI SHOW SYSTEM" && npm run dev`
3. Register a test participant at /register
4. Go to /admin
5. Check if registration appears
6. Try adding a team in Teams tab
7. Check browser console for any errors

### 7. Verify .env File

Make sure your .env has:
```
SUPABASE_URL=https://xipixcrrdmefoepjmjfx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_key_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
```

### 8. Check API Config

In frontend, verify `src/config/api.ts`:
```typescript
export const API_BASE_URL = 'http://localhost:5000';
```

## What to Check in Browser Console

When you open Admin page, you should see:
```
Fetching admin data...
Registrations response: 200
Registrations data: [...]
Teams response: 200
Teams data: []
Votes response: 200
Votes data: []
```

If you see different status codes:
- 401: Authentication failed
- 404: Route not found (backend not running)
- 500: Server error (check backend console)
