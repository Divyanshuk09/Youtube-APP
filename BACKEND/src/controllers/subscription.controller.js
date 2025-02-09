import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subcription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Subscribe to a channel
const subscribe = asyncHandler(async (req, res) => {
    const { channelId } = req.body;
    const userId = req.user._id;

    if (userId.toString() === channelId.toString()) {
        throw new ApiError(400, "You can't subscribe to your own channel");
    }

    // ✅ Check if already subscribed
    const existingSub = await Subscription.findOne({ subscriber: userId, channel: channelId });
    if (existingSub) {
        throw new ApiError(400, "You are already subscribed to this channel");
    }

    // ✅ Create new subscription
    await Subscription.create({ subscriber: userId, channel: channelId });

    res.status(200).json(new ApiResponce(200, "Subscription created successfully"));
});

// ✅ Unsubscribe from a channel
const unsubscribe = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user._id;

    // ✅ Corrected deletion query
    const deletedSub = await Subscription.findOneAndDelete({
        subscriber: userId,
        channel: channelId
    });

    if (!deletedSub) {
        throw new ApiError(400, "You are not subscribed to this channel");
    }

    res.status(200).json(new ApiResponce(200, "Subscription deleted successfully"));
});

// ✅ Get subscriber count for a channel
const getSubscribersCount = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    const count = await Subscription.countDocuments({ channel: channelId });

    res.status(200).json(new ApiResponce(200, { count }, "Subscriber count fetched successfully!"));
});

// ✅ Get your own subscriptions (channels you follow)
const getSubscriptions = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // ✅ Fetch subscriptions and return only `channelName` & `avatar`
    const subscriptions = await Subscription.find({ subscriber: userId })
        .populate("channel", "channelName avatar")
        .lean(); // Converts to plain JSON

    // ✅ Extract only the channel details
    const channels = subscriptions.map(sub => sub.channel);

    res.status(200).json(new ApiResponce(200, channels, "Subscriptions fetched successfully!"));
});

export {
    subscribe,
    unsubscribe,
    getSubscribersCount,
    getSubscriptions
};
