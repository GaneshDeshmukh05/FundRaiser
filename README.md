# Group Gift Fundraiser 🎁

A full-stack web application for organizing group gift fundraisers with real-time contribution tracking.

## Stack
- **Frontend**: React + Vite + TailwindCSS v3
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Project Structure
```
CP/
├── backend/          # Express API server
│   ├── models/       # Mongoose schemas
│   ├── routes/       # REST API routes
│   └── server.js     # Entry point
└── frontend/         # React app
    └── src/
        ├── components/   # Reusable UI components
        ├── pages/        # Route pages
        └── utils/        # Helpers
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally on `mongodb://localhost:27017`

### 1. Start Backend
```bash
cd backend
npm install
node server.js
# → Server at http://localhost:5000
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
# → App at http://localhost:5173
```

## Pages
| Route | Description |
|-------|------------|
| `/` | Home / Landing page |
| `/create` | Create a new fundraiser |
| `/f/:id` | Public contribution page |
| `/dashboard/:id` | Organizer dashboard |
| `/thankyou` | Post-contribution success page |

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/fundraisers` | Create fundraiser |
| GET | `/api/fundraisers/:id` | Get fundraiser |
| PUT | `/api/fundraisers/:id` | Update fundraiser |
| PUT | `/api/fundraisers/:id/close` | Close fundraiser |
| GET | `/api/fundraisers/:id/export` | Export CSV |
| POST | `/api/contributions` | Add contribution |
| GET | `/api/contributions/:fundraiserId` | List contributions |
| PUT | `/api/contributions/:id/confirm` | Confirm contribution |
| DELETE | `/api/contributions/:id` | Delete contribution |
