# Mental Health App - Backend

Backend API for Mental Health App

## Stack
Express + React + PostgreSQL + Therapist Matching

## Installation

```bash
npm install
```

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/data` - Get data
- `POST /api/data` - Create data
- `PUT /api/data/:id` - Update data
- `DELETE /api/data/:id` - Delete data

## Environment Variables

Create a `.env` file with:
- `NODE_ENV` - development/production
- `PORT` - Server port
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT secret key

## Testing

```bash
npm test
```
