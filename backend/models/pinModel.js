import mongoose from "mongoose";

const pinSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: {
        id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            comment: {
                type: String,
                required: true,
            },
        }
    ],

    saves: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
],
}, { timestamps: true });

export default mongoose.model("Pin", pinSchema);
