import express from "express";
import { deleteTask, getTaskById, getTasks, saveTask, updateTask } from "../controller/task.controller.js";
import { VerifyToken } from "../middleware/verify_token.js";

const router = express.Router();

router.get('/tasks',VerifyToken, getTasks);
router.get('/tasks/:id', VerifyToken, getTaskById);
router.post('/tasks', VerifyToken, saveTask);
router.patch('/tasks/:id', VerifyToken, updateTask);
router.delete('/tasks/:id', VerifyToken, deleteTask);

export default router;