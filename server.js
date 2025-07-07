require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const favicon = require('serve-favicon');

const User = require("./models/User");
const Contact = require("./models/Contact");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

// Debug logs
console.log("✅ Loaded PORT:", PORT);
console.log("✅ Loaded JWT_SECRET:", !!JWT_SECRET);
console.log("✅ Loaded MONGODB_URI:", !!MONGODB_URI);

// Safety check
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined");
  process.exit(1);
}

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
  console.error("❌ MongoDB Error:", err.message);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// File paths
const frontendPath = path.join(__dirname, "public");
const authPath = path.join(frontendPath, "auth.html");
const indexPath = path.join(frontendPath, "index.html");

console.log("📁 Frontend path:", frontendPath);
console.log("📁 Auth.html exists:", fs.existsSync(authPath));
console.log("📁 Index.html exists:", fs.existsSync(indexPath));

// 🔥 STEP 1: API Routes (First Priority)
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.json({ error: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hash });
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ status: "ok", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await Contact.create({ name, email, subject, message });
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔥 STEP 2: Static Files (Second Priority)
app.use(express.static(frontendPath, {
  index: false, // Don't auto-serve index.html
  setHeaders: (res, path, stat) => {
    console.log("📁 Serving static:", path);
  }
}));

// 🔥 STEP 3: Specific Page Routes (Third Priority)
app.get("/", (req, res) => {
  console.log("🏠 Root route - serving auth page");
  if (fs.existsSync(authPath)) {
    res.sendFile(authPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Login</title></head>
      <body>
        <h1>Login Page</h1>
        <form action="/api/login" method="post">
          <input type="email" name="email" placeholder="Email" required>
          <input type="password" name="password" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
        <a href="/dashboard">Go to Dashboard</a>
      </body>
      </html>
    `);
  }
});

app.get("/auth", (req, res) => {
  console.log("🔐 Auth route - serving auth page");
  res.redirect("/");
});

app.get("/dashboard", (req, res) => {
  console.log("📊 Dashboard route - serving index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Dashboard</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <h1>Welcome to Dashboard</h1>
        <p>This is your main application</p>
        <a href="/">Back to Login</a>
        <script src="/script.js"></script>
      </body>
      </html>
    `);
  }
});

app.get("/index", (req, res) => {
  console.log("📄 Index route - redirecting to dashboard");
  res.redirect("/dashboard");
});

// 🔥 STEP 4: Fallback for unknown routes (Last Priority)
app.use((req, res) => {
  if (req.method === "GET") {
    console.log("❓ Unknown route:", req.path, "- redirecting to auth");
    res.redirect("/");
  } else {
    res.status(404).json({ error: "Route not found" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Auth/Login: http://localhost:${PORT}/`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`🔧 API Health: http://localhost:${PORT}/api/health`);
});
