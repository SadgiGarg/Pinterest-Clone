import TryCatch from "../utils/TryCatch.js";
import Pin from "../models/pinModel.js";
import getDataUrl from "../utils/dataUri.js";
import cloudinary from "../config/cloudinary.js";

export const createPin = TryCatch(async (req, res) => {
    const { title, pin } = req.body;
    const file = req.file;
    const fileUrl = getDataUrl(file);
    const cloud = await cloudinary.uploader.upload(fileUrl.content);
    await Pin.create({
        title,
        pin,
        image: {
            id: cloud.public_id,
            url: cloud.secure_url,
        },
        owner: req.user._id,
    });
    res.json({ message: "Pin created" });
});

export const getAllPins = TryCatch(async (req, res) => {
    const pins = await Pin.find().populate("owner", "-password").sort({ createdAt: -1 });
    res.json(pins);
});

export const getSinglePin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id)
        .populate("owner", "-password")
        .populate("comments.user", "-password");
    res.json(pin);
});

export const addComment = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);
    if (!pin)
        return res.status(404).json({ message: "Pin not found" });
    pin.comments.push({
        user: req.user._id,
        name: req.user.name,
        comment: req.body.comment,
    });
    await pin.save();
    res.json({ message: "Comment added" });
});

export const deleteComment = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);
    if (!pin)
        return res.status(404).json({ message: "Pin not found" });
    if (!req.query.commentId)
        return res.status(400).json({ message: "Comment id is required" });
    const commentIndex = pin.comments.findIndex(
        (item) => item._id.toString() === req.query.commentId.toString()
    );
    if (commentIndex === -1) {
        return res.status(404).json({ message: "Comment not found" });
    }
    const comment = pin.comments[commentIndex];
    if (comment.user.toString() === req.user._id.toString()) {
        pin.comments.splice(commentIndex, 1);
        await pin.save();
        return res.json({ message: "Comment deleted" });
    } else {
        return res.status(403).json({ message: "You are not owner of this comment" });
    }
});

export const deletePin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);
    if (!pin)
        return res.status(404).json({ message: "Pin not found" });
    if (pin.owner.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Not authorized" });
    await cloudinary.uploader.destroy(pin.image.id);
    await pin.deleteOne();
    res.json({ message: "Pin deleted" });
});

export const updatePin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);
    if (!pin)
        return res.status(404).json({ message: "Pin not found" });
    if (pin.owner.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Not authorized" });
    pin.title = req.body.title;
    pin.pin = req.body.pin;
    await pin.save();
    res.json({ message: "Pin updated successfully", pin });
});

export const searchPins = TryCatch(async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }
    const pins = await Pin.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { pin: { $regex: query, $options: "i" } },
        ],
    })
        .populate("owner", "-password")
        .sort({ createdAt: -1 });
    res.json(pins);
});