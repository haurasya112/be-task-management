import express from "express";
import { Login, Logout, Register, getUsers, refreshToken } from "../controller/user.controller.js";
import { VerifyToken } from "../middleware/verify_token.js";

const router = express.Router();

router.post('/register',Register);
router.post('/login',Login);
router.get('/token',refreshToken);
router.delete('/logout',Logout);

export default router;