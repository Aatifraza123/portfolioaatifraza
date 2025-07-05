require("dotenv").config(); // ✅ Load .env before anything else

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const User = require("./models/User");
const Contact = require("./models/Contact");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

// ✅ Debug: Check if .env values are loaded
console.log("✅ Loaded PORT:", PORT);
console.log("✅ Loaded JWT_SECRET:", !!JWT_SECRET);
console.log("✅ Loaded MONGODB_URI:", !!MONGODB_URI);

// ✅ Add safety check before connecting
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in environment variables");
  console.error("❌ Please check your .env file contains a valid MONGODB_URI");
  process.exit(1);
}

// ✅ Connect to MongoDB with proper options and error handling
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
  .then(() => {
    console.log("✅ MongoDB Connected successfully");
    console.log("✅ Database:", mongoose.connection.name);
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    if (err.message.includes('authentication failed')) {
      console.error("❌ Check your MongoDB username and password");
    }
    if (err.message.includes('network timeout')) {
      console.error("❌ Check your internet connection and MongoDB Atlas IP whitelist");
    }
    process.exit(1);
  });

// ✅ MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
});

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Paths
const frontendPath = path.join(__dirname, "..", "frontend");
const indexPath = path.join(frontendPath, "index.html");
const loginTogglePath = path.join(frontendPath, "logintoggle.html");

// ✅ Logs
console.log("Frontend path:", frontendPath);
console.log("Index.html exists:", fs.existsSync(indexPath));
console.log("Logintoggle.html exists:", fs.existsSync(loginTogglePath));

// ✅ Serve static files
app.use(express.static(frontendPath));

// ✅ Routes
app.get("/", (req, res) => res.sendFile(indexPath));
app.get("/logintoggle", (req, res) => res.sendFile(loginTogglePath));

// ✅ Register
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

// ✅ Login
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

// ✅ Contact
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

// ✅ SPA fallback
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Fallback: index.html not found");
    }
  } else {
    next();
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});




