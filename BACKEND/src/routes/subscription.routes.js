import express from "express";
import { subscribe, unsubscribe, getSubscribersCount, getSubscriptions } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Apply verifyJWT middleware to all routes
router.use(verifyJWT);

router.post("/subscribe", subscribe);
router.delete("/unsubscribe/:channelId", unsubscribe);
router.get("/subscribers/:channelId", getSubscribersCount); // Public route (does not need verifyJWT)
router.get("/subscriptions", getSubscriptions);

export default router;
