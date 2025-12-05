import express from "express";
import { getUserCreations, getPublishedCreations, toggleLikeCreation } from "../controllers/usercontroller.js";
import { auth } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.get('/get-user-creations', auth, getUserCreations);
userRouter.get('/get-published-creations', getPublishedCreations);
userRouter.post('/toggle-like-creation', auth, toggleLikeCreation); 

// Define user-related routes here
export default userRouter;
