import express from 'express'
import { loginUser, myProfile, userProfile,registerUser, followAndUnfollow, logoutUser , updateUser } from '../controllers/userControllers.js'
import {isAuth} from "../middlewares/isAuth.js"
import { uploadFile } from "../middlewares/multer.js"

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",isAuth,logoutUser)
router.get("/me",isAuth, myProfile);
router.get("/:id",isAuth,userProfile);
router.post("/follow/:id",isAuth,followAndUnfollow)
router.put("/:id", isAuth, uploadFile, updateUser)
export default router;