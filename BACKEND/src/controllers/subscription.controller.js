import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subcription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponce} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// subscribe to channel
const subscribe = asyncHandler(async (req, res) => {
    const { channelId } = req.body;
    const userId = req.user._id

    if (userId == channelId) {
        throw new ApiError(
            400,
            "You can't subscribe to your own channel",
        )
    }

    const existingSub = await Subscription.findOne({ subscriber: userId, channel: channelId });
    if (existingSub) {
        throw new ApiError(
            400,
            "You are already subscribed to this channel",
        )

    }

    const newSubscription = new Subscription({ subscriber: userId, channel: channelId });
    await newSubscription.save()

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                "Subscription created successfully",
            )
        )
})

// unsubscribe from channel
const unsubscribe = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user._id;
console.log("channelid:", channelId, "userId:", userId)

    const deletedSub = await Subscription.findOneAndDelete({subscriber: userId }, { channel: channelId });
        
    if (!deletedSub) {
        throw new ApiError(
            400,
            "You are not subscribed to this channel")
    }
    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                "Subscription deleted successfully",
            )
        )

})

//get subscriber count for a channel
const getSubscribersCount = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    const count = await Subscription.countDocuments({ channel: channelId });

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                { count },
                "Subscriber count fetched successfully!"));
});

//get your own subscription (who you follow)

const getSubscriptions = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const subscriptions = await Subscription.find({ subscriber: userId })
        .populate("channel", "username avatar")
        .lean();

    // Extract only the channel details
    const channels = subscriptions.map(sub => sub.channel);

    res.status(200).json(new ApiResponce(200, channels, "Subscriptions fetched successfully!"));
});

export{
    subscribe,
    unsubscribe,
    getSubscribersCount,
    getSubscriptions
}