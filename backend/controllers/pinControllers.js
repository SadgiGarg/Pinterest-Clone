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
        title, pin,
        image: { id: cloud.public_id, url: cloud.secure_url },
        owner: req.user._id,
    });
    res.json({ message: "Pin created" });
});

// ✅ Pagination + payload minimization
export const getAllPins = TryCatch(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const pins = await Pin.find()
        .populate("owner", "name profilePic")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Pin.countDocuments();

    res.json({
        pins,
        page,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
    });
});

export const getSinglePin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id)
        .populate("owner", "-password")
        .populate("comments.user", "name profilePic");
    res.json(pin);
});

// ✅ Fixed - only store user ObjectId reference
export const addComment = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);
    if (!pin)
        return res.status(404).json({ message: "Pin not found" });
    pin.comments.push({
        user: req.user._id,
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
    if (commentIndex === -1)
        return res.status(404).json({ message: "Comment not found" });
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

// ✅ Search with pagination
export const searchPins = TryCatch(async (req, res) => {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    if (!query)
        return res.status(400).json({ message: "Search query is required" });

    const pins = await Pin.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { pin: { $regex: query, $options: "i" } },
        ],
    })
        .populate("owner", "name profilePic")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.json(pins);
});

export const savePin = TryCatch(async (req, res) => {
    const pin = await Pin.findById(req.params.id);
    if (!pin)
        return res.status(404).json({ message: "Pin not found" });
    const isAlreadySaved = pin.saves.includes(req.user._id);
    if (isAlreadySaved) {
        pin.saves.pull(req.user._id);
        await pin.save();
        res.json({ message: "Pin unsaved", saves: pin.saves.length });
    } else {
        pin.saves.push(req.user._id);
        await pin.save();
        res.json({ message: "Pin saved", saves: pin.saves.length });
    }
});
export const toggleLikePin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) return res.status(404).json({ message: "Pin not found" });

    // req.user._id comes from your login auth middleware
    const userId = req.user._id; 

    // Check if the user already liked this pin
    const isLiked = pin.likes.includes(userId);

    if (isLiked) {
      // Unlike: Remove user ID from array
      pin.likes = pin.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Like: Push user ID into array
      pin.likes.push(userId);
    }

    await pin.save();
    
    // Return the updated likes array and status to the frontend
    res.status(200).json({ 
      likes: pin.likes, 
      isLiked: !isLiked, 
      count: pin.likes.length 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};