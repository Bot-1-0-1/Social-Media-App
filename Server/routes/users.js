import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../Middleware/authorization.js";

const router = express.Router();

/* Routes for read */

router.get("/:id" , verifyToken , getUser);
router.get("/:id/friends",verifyToken,getUserFriends);


/* UPDATE */

router.patch("/:id/:friendId" , verifyToken ,addRemoveFriend);


export default router ;