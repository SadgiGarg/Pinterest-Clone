import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import TryCatch from "../utils/TryCatch.js";
import generateToken from "../utils/generateTokens.js";
import cloudinary from "../config/cloudinary.js";
import getDataUrl from "../utils/dataUri.js";

export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user)
        return res.status(400).json({ message: "Already have an account with this email" });

    const hashPassword = await bcrypt.hash(password, 10);

    user = await User.create({ name, email, password: hashPassword });

    generateToken(user._id, res);

    // ✅ Sanitize - remove password
    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;

    res.status(201).json({ user: sanitizedUser, message: "User Registered" });
});

export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({ message: "No user with this email" });

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
        return res.status(400).json({ message: "Wrong password" });

    generateToken(user._id, res);

    // ✅ Sanitize - remove password
    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;

    res.json({ user: sanitizedUser, message: "Logged in" });
});

export const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
});

// 🔑 Make sure Pin is imported at the top of userController.js if it isn't already!
import Pin from "../models/pinModel.js"; 
import mongoose from "mongoose";

export const userProfile = TryCatch(async (req, res) => {
    const userId = req.params.id;

    // 1. Double-check that the string ID format is structurally valid for MongoDB
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID format" });
    }

    // 2. Fetch the target user details
    const user = await User.findById(userId).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // 3. 🎯 THE FIX: Query the Pin collection for pins owned by this user
    // We cast the string parameters to a proper ObjectId instance
    const pins = await Pin.find({ owner: new mongoose.Types.ObjectId(userId) })
        .populate("owner", "name profilePic")
        .sort({ createdAt: -1 });

    // 4. Send BOTH the user information and their pins back to the frontend
    res.json({
        user,
        pins
    });
});

export const followAndUnfollow = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!user)
        return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === loggedInUser._id.toString())
        return res.status(400).json({ message: "You can't follow yourself" });

    if (user.followers.includes(loggedInUser._id)) {
        user.followers.pull(loggedInUser._id);
        loggedInUser.following.pull(user._id);
        await user.save();
        await loggedInUser.save();
        res.json({ message: "User unfollowed" });
    } else {
        user.followers.push(loggedInUser._id);
        loggedInUser.following.push(user._id);
        await user.save();
        await loggedInUser.save();
        res.json({ message: "User followed" });
    }
});

export const logoutUser = TryCatch(async (req, res) => {
    res.cookie("token", "", { maxAge: 0 });
    res.json({ message: "Logged out successfully" });
});

export const updateUser = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user)
        return res.status(404).json({ message: "User not found" });

    if (user._id.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Not authorized" });

    if (req.file) {
        if (user.profilePic?.id) {
            await cloudinary.uploader.destroy(user.profilePic.id);
        }
        const fileUrl = getDataUrl(req.file);
        const cloud = await cloudinary.uploader.upload(fileUrl.content);
        user.profilePic = { id: cloud.public_id, url: cloud.secure_url };
    }

    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;

    await user.save();

    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;

    res.json({ message: "Profile updated", user: sanitizedUser });
});
