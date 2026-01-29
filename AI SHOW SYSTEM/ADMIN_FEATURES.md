# Admin Features Update

## New Features Added

### 1. Team Management
- Admin can add/delete teams for voting
- Teams are stored in Supabase database
- Each team has: name, category, description, color

### 2. Live Voting Results
- Real-time vote counting per team
- Visual progress bars
- Percentage calculations

### 3. Fixed Admin Data Fetching
- Now properly fetches registrations, teams, and votes
- All data loads on page load

## Database Setup

Run this SQL in Supabase:

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Admin Dashboard Tabs

1. **Registrations** - View all registrations, send certificates
2. **Teams** - Add/remove teams for voting
3. **Voting** - View live voting results with charts

## How to Use

### Add Teams:
1. Go to Admin Dashboard
2. Click "Teams" tab
3. Click "Add Team"
4. Fill in: Name, Category, Description, Color
5. Click "Save Team"

### View Voting Results:
1. Go to Admin Dashboard
2. Click "Voting" tab
3. See real-time vote counts and percentages

### Live Voting Page:
- Users visit `/live-voting`
- Teams are loaded from database
- Votes are saved to database
- One vote per email enforced

## API Endpoints Added

- `GET /api/teams` - Get all teams
- `POST /api/teams` - Add team (admin only)
- `DELETE /api/teams/:id` - Delete team (admin only)
