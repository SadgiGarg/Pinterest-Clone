import express from'express';
import {isAuth }from "../middlewares/isAuth.js";
import {uploadFile} from "../middlewares/multer.js";
import { createPin,getAllPins,getSinglePin,addComment, deleteComment, deletePin,updatePin, searchPins, savePin,toggleLikePin} from '../controllers/pinControllers.js';
const router= express.Router();
router.post("/new", isAuth, uploadFile,createPin);
router.get("/all",isAuth, getAllPins);
router.get("/search", isAuth, searchPins)
router.post("/save/:id",isAuth,savePin)
router.get("/:id", isAuth, getSinglePin);
router.put("/:id", isAuth, updatePin);
router.delete("/:id",isAuth,deletePin);
router.post("/comment/:id", isAuth, addComment);
router.delete("/comment/:id",isAuth,deleteComment);
router.put("/like/:id", isAuth, toggleLikePin);
export default router;