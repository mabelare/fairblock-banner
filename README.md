# Fairblock Banner Generator

A web application to generate custom banners with Discord profile pictures.

## Features
- Discord profile picture integration
- Custom banner generation with logo overlay
- Background music
- Gallery to save generated banners
- Blue/black themed UI

## Local Development

### Prerequisites
- Node.js 18+ 
- Discord Bot Token

### Setup

1. Clone the repository
```bash
git clone https://github.com/mabelare/fairblock-banner.git
cd fairblock-banner
```

2. Install frontend dependencies
```bash
cd my-banner
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Configure environment variables
Create a `.env` file in `my-banner/backend/`:
```
DISCORD_TOKEN=your_discord_bot_token_here
```

5. Start the backend server
```bash
cd my-banner/backend
node index.js
```

6. Start the frontend dev server
```bash
cd my-banner
npm run dev
```

7. Open http://localhost:5173 in your browser

## Deployment

### Netlify (Frontend Only)
The frontend is automatically configured for Netlify deployment via `netlify.toml`.

**Important:** The backend Discord API requires a separate deployment (e.g., Heroku, Railway, Render).

### Backend Deployment
Deploy the `my-banner/backend` folder to your preferred Node.js hosting service and update the API endpoint in the frontend code.

## Tech Stack
- **Frontend:** Vite, Vanilla JS, Tailwind CSS
- **Backend:** Node.js, Express, Discord API
- **Canvas:** HTML5 Canvas for image generation

## License
MIT
