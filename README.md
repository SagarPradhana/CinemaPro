# Entertainment Management System

A full-stack entertainment management platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **6 Content Categories**: Movies, Music, Series, Dramas, Anime, Comics/Manga
- **Rich UI**: Modern design with Framer Motion animations, responsive layouts
- **Admin Panel**: Full CRUD operations for all content types
- **Search**: Global search across all content categories
- **Pagination**: Efficient paginated listings
- **Image Upload**: Cloudinary integration for media storage

## Tech Stack

### Backend
- Node.js + Express.js (TypeScript)
- MongoDB with Mongoose ODM
- Cloudinary for image storage
- Multer for file handling
- CORS, dotenv, express-validator

### Frontend
- Vite + React + TypeScript
- Tailwind CSS
- Framer Motion for animations
- shadcn/ui components
- Redux Toolkit for state
- React Router v6
- Axios for HTTP

## Project Structure

```
/client          → Vite React TS frontend
/server          → Express.js TS backend
  /models        → Mongoose schemas
  /routes        → API route handlers
  /controllers   → Business logic
  /middleware    → Auth, validation
/client/src
  /components/ui → Reusable components
  /pages         → Route pages
  /store         → Redux slices
  /hooks         → Custom hooks
  /types         → TS interfaces
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in server folder:
```env
MONGODB_URI=mongodb://localhost:27017/entertainment
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
ADMIN_PASSWORD=admin123
```

4. Start the server:
```bash
npm run dev
```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in client folder:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

4. Start the development server:
```bash
npm run dev
```

The client will run on http://localhost:3000

## API Endpoints

Base URL: `/api/v1`

| Content | Endpoints |
|---------|-----------|
| Movies | GET/POST `/movies`, GET/PUT/DELETE `/movies/:id` |
| Music | GET/POST `/music`, GET/PUT/DELETE `/music/:id` |
| Series | GET/POST `/series`, GET/PUT/DELETE `/series/:id` |
| Dramas | Same as Series (type=drama) |
| Comics | GET/POST `/comics`, GET/PUT/DELETE `/comics/:id` |

### Special Routes
- `GET /home` - Featured + latest from all categories
- `GET /search?q=` - Global search

### Query Parameters
- `?page=1&limit=12` - Pagination
- `?search=query` - Search
- `?genre=Action` - Filter by genre
- `?isLatest=true` - Latest items
- `?isFeatured=true` - Featured items
- `?type=manga` - Filter by type (comics)

## Frontend Routes

| Route | Page |
|-------|------|
| `/` | Home |
| `/movies` | Movies listing |
| `/movies/:id` | Movie detail |
| `/music` | Music listing |
| `/music/:id` | Music detail |
| `/series` | Series listing |
| `/series/:id` | Series detail |
| `/dramas` | Dramas listing |
| `/dramas/:id` | Drama detail |
| `/comics` | Comics listing |
| `/comics/:id` | Comic detail |
| `/search` | Global search |
| `/admin` | Admin dashboard |

## Design System

### Colors
- Primary: `#6C47FF` (rich violet)
- Secondary: `#FF4F7B` (vibrant pink)
- Background: `#FAFAFA`
- Surface: `#FFFFFF`
- Text: `#0D0D0D` / `#6B7280`

### Typography
- Font: Inter
- Hero: 48-64px, 700
- Card titles: 16-18px, 600
- Body: 14px, 400

### Components
- Cards: White bg, 16px radius, shadow-card, hover lift
- Hero: Full-width backdrop with gradient overlay
- Animations: Page transitions, staggered card entrance, hover scale

## Admin Panel

Access at `/admin` with password `admin123`

Features:
- Add/Edit/Delete all content types
- Toggle isLatest and isFeatured flags
- Dashboard with content counts
- Modal forms for quick editing

## License

MIT