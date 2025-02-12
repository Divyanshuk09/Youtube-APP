import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId, //user who is subscribing
            ref: 'User',
            required: true
        },
        channel: {
            type: Schema.Types.ObjectId, //user to whom "subscriber" is subscribing
            ref: 'User',
            required: true,
            validate: {
                validator: function (value) {
                    return value.toString() !== this.subscriber.toString();
                },
                message: "User cannot subscribe to themselves.",
            }
        },
    }
    , { timestamps: true }
);
// ✅ Prevent duplicate subscriptions (one user can't subscribe to the same channel twice)
subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });

// ✅ Middleware: Delete subscriptions when a user deletes their account
subscriptionSchema.pre("remove", async function (next) {
    await mongoose.model("Subscription").deleteMany({
        $or: [{ subscriber: this._id }, { channel: this._id }],
    });
    next();
})


export const Subscription = mongoose.model("Subscription", subscriptionSchema);