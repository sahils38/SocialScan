import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { loginWithPlaywright } from './server';

// Initialize Express app
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to handle Playwright login
app.post('/api/login', loginWithPlaywright);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
