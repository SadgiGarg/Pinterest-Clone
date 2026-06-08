import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import TryCatch from "../utils/TryCatch.js";
import generateToken from "../utils/generateTokens.js";

export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password, profilePic, bio } = req.body;

    let user = await User.findOne({ email });
    if (user)
        return res.status(400).json({
            message: "Already have an account with this email",
        });

    const hashPassword = await bcrypt.hash(password, 10);

    user = await User.create({
        name,
        email,
        profilePic,
        bio,
        password: hashPassword,
    });

    generateToken(user._id, res);

    res.status(201).json({
        user,
        message: "User Registered",
    });
});

export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({
            message: "No user with this email",
        });

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
        return res.status(400).json({
            message: "Wrong password",
        });

    generateToken(user._id, res);

    res.json({
        user,
        message: "Logged in",
    });
});

export const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json(user);
});
export const userProfile= TryCatch(async(req,res)=> {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
});
export const followAndUnfollow = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!user)
        return res.status(404).json({
            message: "User not found",
        });

    if (user._id.toString() === loggedInUser._id.toString())
        return res.status(400).json({
            message: "You can't follow yourself",
        });

    if (user.followers.includes(loggedInUser._id)) {
        // Unfollow
        user.followers.pull(loggedInUser._id);
        loggedInUser.following.pull(user._id);

        await user.save();
        await loggedInUser.save();

        res.json({ message: "User unfollowed" });
    } else {
        // Follow
        user.followers.push(loggedInUser._id);
        loggedInUser.following.push(user._id);

        await user.save();
        await loggedInUser.save();

        res.json({ message: "User followed" });
    }
});
export const logoutUser = TryCatch(async (req, res) => {
    res.cookie("token", "", {
        maxAge: 0,
    });

    res.json({
        message: "Logged out successfully",
    });
});
export const updateUser = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (!user)
        return res.status(404).json({ message: "User not found" })

    if (user._id.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Not authorized" })

    user.name = req.body.name || user.name
    user.bio = req.body.bio || user.bio

    await user.save()

    res.json({ message: "Profile updated", user })
})
export const searchPins = TryCatch(async (req, res) => {
    const { query } = req.query

    if (!query) {
        return res.status(400).json({ message: "Search query is required" })
    }

    const pins = await Pin.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { pin: { $regex: query, $options: "i" } },
        ],
    })
        .populate("owner", "-password")
        .sort({ createdAt: -1 })

    res.json(pins)
})
