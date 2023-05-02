import express from "express";
import { login } from "../controllers/auth.js"

const router = express.Router();                    // Allow express to identify that the routes are being configured and 
                                                    // Allows to have routes in seperate files

router.post("/login", login);                      // Used instead of app.use

export default router;