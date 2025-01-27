"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const server_1 = require("./server");
// Initialize Express app
const app = (0, express_1.default)();
const PORT = 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Route to handle Playwright login
app.post('/api/login', server_1.loginWithPlaywright);
// Start server
app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
