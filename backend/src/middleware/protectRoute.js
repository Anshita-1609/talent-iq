import { requireAuth } from "@clerk/express";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

const isClerkEnabled =
  ENV.CLERK_PUBLISHABLE_KEY &&
  ENV.CLERK_SECRET_KEY &&
  !ENV.CLERK_PUBLISHABLE_KEY.includes("your_clerk_publishable_key") &&
  !ENV.CLERK_SECRET_KEY.includes("your_clerk_secret_key");

export const protectRoute = [
  ...(isClerkEnabled ? [requireAuth()] : []),
  async (req, res, next) => {
    try {
      const clerkId = isClerkEnabled
        ? req.auth().userId
        : req.headers["x-mock-user-clerk-id"] ||
          process.env.MOCK_USER_CLERK_ID ||
          "user_2abc123def456";

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      let user = User.findOne({ clerkId });
      if (!user) user = User.findOne({ id: clerkId });

      if (!user) return res.status(404).json({ message: "User not found" });

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
