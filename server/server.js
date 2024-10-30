// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./Schema/User.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares with proper CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Adjust this to your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    error: "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Signup endpoint with proper error handling
app.post("/signup", async (req, res) => {
  try {
    // console.log("Received signup request:", {
    //   ...req.body,
    //   password: req.body.password ? "***" : undefined,
    // });

    const { fullname, email, password } = req.body;

    // Validate required fields
    if (!email?.trim() || !password?.trim() || !fullname?.trim()) {
      return res.status(400).json({
        error: "All fields are required",
        details: {
          email: !email?.trim() ? "Email is required" : null,
          password: !password?.trim() ? "Password is required" : null,
          fullname: !fullname?.trim() ? "Full name is required" : null,
        },
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({
      "personal_info.email": email.toLowerCase(),
    });
    if (existingUser) {
      return res.status(409).json({
        error: "Account already exists",
        details: "This email is already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create username from email
    let username = email.split("@")[0];
    const usernameExists = await User.findOne({
      "personal_info.username": username,
    });
    if (usernameExists) {
      username = `${username}${Math.random().toString(36).slice(2, 7)}`;
    }

    // Create new user
    const user = new User({
      personal_info: {
        fullname: fullname.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        username,
      },
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_ACCESS_KEY,
      { expiresIn: "7d" }
    );

    // Send success response
    res.status(200).json({
      access_token: token,
      profile_img: user.personal_info.profile_img,
      username: user.personal_info.username,
      fullname: user.personal_info.fullname,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      error: "Registration failed",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : "An error occurred during registration",
    });
  }
});

// Signin endpoint
app.post("/signin", async (req, res) => {
  try {
    // console.log("Received signin request for email:", req.body.email);

    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({
      "personal_info.email": email.toLowerCase(),
    });
    if (!user) {
      return res.status(404).json({
        error: "Account not found",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.personal_info.password
    );
    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_ACCESS_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      access_token: token,
      profile_img: user.personal_info.profile_img,
      username: user.personal_info.username,
      fullname: user.personal_info.fullname,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      error: "Sign in failed",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : "An error occurred during sign in",
    });
  }
});

// Connect to MongoDB
const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_LOCATION);
    console.log("Connected to MongoDB successfully!");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Enable cookies cross-origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Start server
startServer();
