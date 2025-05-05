import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        collaborators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        videos: [
            {
                video: {
                    type: Schema.Types.ObjectId,
                    ref: "Video"
                },
                addedBy: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                addedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        shareLink: {
            token: {
                type: String,
                unique: true,
                trim: true},
            
            expiresAt: Date,
            
            maxUses: Number,
            uses: {
                type: Number,
                default: 0},
            
            active: {
                type: Boolean,
                default: true}
        }
    },
    { timestamps: true }
)

playlistSchema.index({name:1,owner:1},{unique:true})
export const Playlist = mongoose.model("Playlist", playlistSchema);