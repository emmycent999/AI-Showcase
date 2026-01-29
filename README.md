# AI Showcase Event Website

Full-stack web application for AI Showcase & Hackathon event with registration, validation, voting, and certificate distribution.

## Features

- Multi-role registration (Participant, Organizer, Alumni)
- Registration validation
- Voting system with duplicate prevention
- Admin dashboard
- Automated certificate generation and email delivery
- Green, White, Blue color theme

## Tech Stack

**Frontend:** React, React Router
**Backend:** Node.js, Express
**Database:** Supabase
**Email:** Nodemailer
**PDF:** PDFKit

## Setup Instructions

### 1. Database Setup (Supabase)

Create two tables in Supabase:

**registrations table:**
```sql
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  phone TEXT,
  institution TEXT,
  role TEXT,
  team_name TEXT,
  graduation_year TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**votes table:**
```sql
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  team_name TEXT NOT NULL,
  voted_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Environment Variables

Create `.env` file in the root directory:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
PORT=5000
```

### 3. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Run the Application

```bash
# Terminal 1 - Run server
cd server
npm run dev

# Terminal 2 - Run client
cd client
npm start
```

The app will open at `http://localhost:3000`

## API Endpoints

- `POST /api/register` - Register user
- `GET /api/validate` - Validate registration
- `POST /api/vote` - Submit vote
- `GET /api/admin/registrations` - Get all registrations (admin)
- `GET /api/admin/votes` - Get voting results (admin)
- `POST /api/certificate/send` - Send certificate to user (admin)
- `POST /api/certificate/send-all` - Send certificates to all users (admin)

## Routes

- `/` - Homepage
- `/participant` - Participant registration
- `/organiser` - Organizer registration
- `/alumni` - Alumni registration
- `/validate` - Validate registration
- `/vote` - Vote for teams
- `/admin` - Admin dashboard

## Security Notes

- Admin routes protected with basic authentication
- Duplicate email prevention
- One vote per user enforcement
- Server-side validation on all inputs

## Future Enhancements

- QR code check-in
- Real-time voting leaderboard
- CSV export functionality
- Multi-event support
