const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

// Full-stack projects (151-200) with random selection
const fullstackProjects = [
  { number: 151, name: 'Real-time Chat Application', tech: 'Node.js + React + Socket.io + MongoDB' },
  { number: 152, name: 'E-Learning Platform', tech: 'Express + Vue.js + MySQL + JWT' },
  { number: 153, name: 'Social Media Feed', tech: 'Node.js + React + PostgreSQL + Redis' },
  { number: 154, name: 'Project Management Tool', tech: 'Express + Angular + MongoDB + WebSocket' },
  { number: 155, name: 'Video Streaming App', tech: 'Node.js + React + AWS S3 + PostgreSQL' },
  { number: 156, name: 'Real-time Collaboration Editor', tech: 'Express + React + MongoDB + Operational Transformation' },
  { number: 157, name: 'AI Chatbot Platform', tech: 'Node.js + React + OpenAI API + PostgreSQL' },
  { number: 158, name: 'Multi-vendor E-Commerce', tech: 'Express + Vue.js + MySQL + Stripe' },
  { number: 159, name: 'Fitness Tracking App', tech: 'Node.js + React Native + Firebase + MongoDB' },
  { number: 160, name: 'Job Board Platform', tech: 'Express + React + PostgreSQL + Elasticsearch' },
  { number: 161, name: 'Restaurant Delivery System', tech: 'Node.js + React + Google Maps + MySQL' },
  { number: 162, name: 'Live Event Booking', tech: 'Express + Vue.js + PostgreSQL + Stripe' },
  { number: 163, name: 'Healthcare Portal', tech: 'Node.js + React + MySQL + HIPAA Compliant' },
  { number: 164, name: 'Music Streaming Service', tech: 'Express + React + MongoDB + AWS CloudFront' },
  { number: 165, name: 'Real Estate Marketplace', tech: 'Node.js + React + PostgreSQL + Mapbox' },
  { number: 166, name: 'Inventory Management System', tech: 'Express + Angular + MySQL + Barcode Scanner' },
  { number: 167, name: 'Travel Booking Platform', tech: 'Node.js + React + PostgreSQL + Payment Gateway' },
  { number: 168, name: 'Blog Publishing Platform', tech: 'Express + Next.js + PostgreSQL + Markdown' },
  { number: 169, name: 'Appointment Scheduling SaaS', tech: 'Node.js + React + MongoDB + Calendar API' },
  { number: 170, name: 'Analytics Dashboard', tech: 'Express + React + BigQuery + Chart.js' },
  { number: 171, name: 'Note-Taking Collaboration App', tech: 'Node.js + React + MongoDB + Operational Transform' },
  { number: 172, name: 'Online Banking System', tech: 'Express + React + PostgreSQL + AES Encryption' },
  { number: 173, name: 'Weather Dashboard with Alerts', tech: 'Node.js + React + WeatherAPI + WebSocket' },
  { number: 174, name: 'Subscription Box Service', tech: 'Express + Vue.js + MySQL + Recurring Billing' },
  { number: 175, name: 'Crypto Trading Bot', tech: 'Node.js + React + MongoDB + Binance API' },
  { number: 176, name: 'Document Management System', tech: 'Express + React + PostgreSQL + File Storage' },
  { number: 177, name: 'Social Network Platform', tech: 'Node.js + React + MongoDB + Redis' },
  { number: 178, name: 'Task Automation Platform', tech: 'Express + React + PostgreSQL + Webhooks' },
  { number: 179, name: 'Survey & Polling Tool', tech: 'Node.js + React + MongoDB + D3.js' },
  { number: 180, name: 'HR Management System', tech: 'Express + Angular + MySQL + Leave Management' },
  { number: 181, name: 'IoT Device Dashboard', tech: 'Node.js + React + MongoDB + MQTT' },
  { number: 182, name: 'CRM System', tech: 'Express + React + PostgreSQL + Lead Scoring' },
  { number: 183, name: 'File Sharing Platform', tech: 'Node.js + React + AWS S3 + MongoDB' },
  { number: 184, name: 'Virtual Classroom', tech: 'Express + React + WebRTC + PostgreSQL' },
  { number: 185, name: 'Gaming Tournament Platform', tech: 'Node.js + React + PostgreSQL + Leaderboard' },
  { number: 186, name: 'Fashion E-Commerce', tech: 'Express + React + MySQL + AR Try-on' },
  { number: 187, name: 'Podcast Platform', tech: 'Node.js + React + MongoDB + Audio Processing' },
  { number: 188, name: 'Book Club Community', tech: 'Express + Vue.js + PostgreSQL + Social Features' },
  { number: 189, name: 'Expense Splitting App', tech: 'Node.js + React + MongoDB + Payment Integration' },
  { number: 190, name: 'Habit Tracking App', tech: 'Express + React + PostgreSQL + Notifications' },
  { number: 191, name: 'Code Snippet Manager', tech: 'Node.js + React + MongoDB + Syntax Highlighting' },
  { number: 192, name: 'Dating Application', tech: 'Express + React Native + MongoDB + Geolocation' },
  { number: 193, name: 'Property Management App', tech: 'Node.js + React + PostgreSQL + Tenant Portal' },
  { number: 194, name: 'Freelance Marketplace', tech: 'Express + React + MySQL + Escrow Payment' },
  { number: 195, name: 'Content Creator Hub', tech: 'Node.js + React + MongoDB + CDN Integration' },
  { number: 196, name: 'Insurance Portal', tech: 'Express + React + PostgreSQL + Claims Management' },
  { number: 197, name: 'Supply Chain Tracker', tech: 'Node.js + React + MongoDB + GPS Tracking' },
  { number: 198, name: 'Mental Health App', tech: 'Express + React + PostgreSQL + Therapist Matching' },
  { number: 199, name: 'Logistics Management', tech: 'Node.js + React + MySQL + Route Optimization' },
  { number: 200, name: 'Educational Video Platform', tech: 'Express + React + PostgreSQL + HLS Streaming' },
];

// Template files for Frontend
const frontendHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{PROJECT_NAME}} - Frontend</title>
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <div id="app">
    <header>
      <h1>{{PROJECT_NAME}}</h1>
      <p>Frontend Application</p>
    </header>
    <main>
      <section class="content">
        <p>Welcome to {{PROJECT_NAME}}</p>
      </section>
    </main>
  </div>
  <script src="js/app.js"></script>
</body>
</html>`;

const frontendCSS = `:root {
  --primary: #2563eb;
  --secondary: #64748b;
  --background: #f8fafc;
  --text: #1e293b;
  --border: #e2e8f0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--background);
  color: var(--text);
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border);
}

.content p {
  font-size: 1.1rem;
  color: var(--secondary);
}

@media (max-width: 768px) {
  header h1 {
    font-size: 1.8rem;
  }

  main {
    padding: 1rem;
  }

  .content {
    padding: 1.5rem;
  }
}`;

const frontendJS = `// Frontend Application
console.log('Frontend application loaded');

// Initialize API endpoint
const API_BASE_URL = 'http://localhost:3000/api';

// Sample function to fetch data from backend
async function fetchData(endpoint) {
  try {
    const response = await fetch(API_BASE_URL + endpoint);
    if (!response.ok) {
      throw new Error('HTTP error! status: ' + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchData };
}`;

const frontendPackage = `{
  "name": "{{PROJECT_FOLDER}}-frontend",
  "version": "1.0.0",
  "description": "Frontend for {{PROJECT_NAME}}",
  "main": "js/app.js",
  "scripts": {
    "start": "http-server . -p 3000",
    "dev": "http-server . -p 3000 -c-1",
    "build": "echo 'Build process here'"
  },
  "keywords": ["frontend", "react", "vue"],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "http-server": "^14.1.1"
  }
}`;

// Template files for Backend
const backendPackage = `{
  "name": "{{PROJECT_FOLDER}}-backend",
  "version": "1.0.0",
  "description": "Backend API for {{PROJECT_NAME}}",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "keywords": ["backend", "api", "express"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "mongoose": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "jest": "^29.0.0"
  }
}`;

const backendServer = `const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '{{PROJECT_NAME}} Backend is running' });
});

// Sample API endpoint
app.get('/api/data', (req, res) => {
  res.json({
    success: true,
    message: 'Sample data from {{PROJECT_NAME}} backend',
    data: []
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});

module.exports = app;`;

const backendEnv = `# {{PROJECT_NAME}} Backend Configuration
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/{{PROJECT_FOLDER}}
JWT_SECRET=your_jwt_secret_key_here
API_KEY=your_api_key_here`;

const backendMiddleware = `// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Verify token here
  next();
};

module.exports = { authenticateToken };`;

const backendRoutes = `const express = require('express');
const router = express.Router();

// Sample routes for {{PROJECT_NAME}}

// GET all items
router.get('/', (req, res) => {
  res.json({ message: 'Get all items' });
});

// GET single item
router.get('/:id', (req, res) => {
  res.json({ message: 'Get item ' + req.params.id });
});

// POST create item
router.post('/', (req, res) => {
  res.json({ message: 'Item created', data: req.body });
});

// PUT update item
router.put('/:id', (req, res) => {
  res.json({ message: 'Item ' + req.params.id + ' updated' });
});

// DELETE item
router.delete('/:id', (req, res) => {
  res.json({ message: \`Item \${req.params.id} deleted\` });
});

module.exports = router;`;

const backendREADME = `# {{PROJECT_NAME}} - Backend

Backend API for {{PROJECT_NAME}}

## Stack
{{TECH_STACK}}

## Installation

\`\`\`bash
npm install
\`\`\`

## Running

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production
\`\`\`bash
npm start
\`\`\`

## API Endpoints

- \`GET /api/health\` - Health check
- \`GET /api/data\` - Get data
- \`POST /api/data\` - Create data
- \`PUT /api/data/:id\` - Update data
- \`DELETE /api/data/:id\` - Delete data

## Environment Variables

Create a \`.env\` file with:
- \`NODE_ENV\` - development/production
- \`PORT\` - Server port
- \`DATABASE_URL\` - Database connection string
- \`JWT_SECRET\` - JWT secret key

## Testing

\`\`\`bash
npm test
\`\`\`
`;

const frontendREADME = `# {{PROJECT_NAME}} - Frontend

Frontend application for {{PROJECT_NAME}}

## Project Structure

\`\`\`
├── index.html          # Main HTML file
├── styles/
│   └── main.css       # Main stylesheet
├── js/
│   └── app.js         # Main JavaScript file
└── assets/            # Images, fonts, etc.
\`\`\`

## Features

- Responsive Design
- Modern CSS
- Vanilla JavaScript

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

\`\`\`bash
npm run build
\`\`\`

## API Configuration

Update \`js/app.js\` with your backend API URL:

\`\`\`javascript
const API_BASE_URL = 'http://localhost:3000/api';
\`\`\`

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript

## License

MIT
`;

function createProject(project) {
  const projectNumber = String(project.number).padStart(3, '0');
  const projectFolder = projectNumber + '. ' + project.name;
  const projectPath = path.join(rootDir, projectFolder);

  try {
    // Create main project folder
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    // Create Frontend folder structure
    const frontendPath = path.join(projectPath, 'Frontend');
    const frontendStylesPath = path.join(frontendPath, 'styles');
    const frontendJsPath = path.join(frontendPath, 'js');
    const frontendAssetsPath = path.join(frontendPath, 'assets');

    [frontendPath, frontendStylesPath, frontendJsPath, frontendAssetsPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Create Frontend files
    fs.writeFileSync(
      path.join(frontendPath, 'index.html'),
      frontendHTML.replace(/{{PROJECT_NAME}}/g, project.name)
    );
    fs.writeFileSync(
      path.join(frontendStylesPath, 'main.css'),
      frontendCSS
    );
    fs.writeFileSync(
      path.join(frontendJsPath, 'app.js'),
      frontendJS
    );
    fs.writeFileSync(
      path.join(frontendPath, 'package.json'),
      frontendPackage
        .replace(/{{PROJECT_FOLDER}}/g, projectFolder)
        .replace(/{{PROJECT_NAME}}/g, project.name)
    );
    fs.writeFileSync(
      path.join(frontendPath, 'README.md'),
      frontendREADME.replace(/{{PROJECT_NAME}}/g, project.name)
    );

    // Create Backend folder structure
    const backendPath = path.join(projectPath, 'Backend');
    const backendRoutesPath = path.join(backendPath, 'routes');
    const backendMiddlewarePath = path.join(backendPath, 'middleware');
    const backendModelsPath = path.join(backendPath, 'models');

    [backendPath, backendRoutesPath, backendMiddlewarePath, backendModelsPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Create Backend files
    fs.writeFileSync(
      path.join(backendPath, 'server.js'),
      backendServer.replace(/{{PROJECT_NAME}}/g, project.name)
    );
    fs.writeFileSync(
      path.join(backendPath, 'package.json'),
      backendPackage
        .replace(/{{PROJECT_FOLDER}}/g, projectFolder)
        .replace(/{{PROJECT_NAME}}/g, project.name)
    );
    fs.writeFileSync(
      path.join(backendPath, '.env'),
      backendEnv.replace(/{{PROJECT_NAME}}/g, project.name).replace(/{{PROJECT_FOLDER}}/g, projectFolder)
    );
    fs.writeFileSync(
      path.join(backendMiddlewarePath, 'auth.js'),
      backendMiddleware
    );
    fs.writeFileSync(
      path.join(backendRoutesPath, 'index.js'),
      backendRoutes.replace(/{{PROJECT_NAME}}/g, project.name)
    );
    fs.writeFileSync(
      path.join(backendPath, 'README.md'),
      backendREADME
        .replace(/{{PROJECT_NAME}}/g, project.name)
        .replace(/{{TECH_STACK}}/g, project.tech)
    );

    console.log('✓ Created: ' + projectFolder);
    return true;
  } catch (error) {
    console.error('✗ Error creating ' + projectFolder + ':', error.message);
    return false;
  }
}

// Main execution
console.log('\\n🚀 Generating Full-Stack Projects (151-200)...\\n');

let successCount = 0;
let failureCount = 0;

fullstackProjects.forEach(project => {
  if (createProject(project)) {
    successCount++;
  } else {
    failureCount++;
  }
});

console.log('\\n✅ Generation Complete!');
console.log('📊 Summary:');
console.log('   ✓ Created: ' + successCount);
console.log('   ✗ Failed: ' + failureCount);
console.log('\\n📁 All projects are in the root directory with Frontend & Backend folders');
console.log('📝 Next steps:');
console.log('   1. cd into any Frontend folder and run: npm install && npm start');
console.log('   2. In a new terminal, cd into the corresponding Backend folder and run: npm install && npm run dev');
