import { Router } from "express";
import AppController from "../controllers/AppController";
import UsersController from "../controllers/UsersController";
import AuthController from "../controllers/AuthController";
import FilesController from "../controllers/FilesController";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.get("/status", AppController.getStatus);
router.get("/stats", AppController.getStats);
router.post("/users", UsersController.postNew);
router.get("/connect", AuthController.getConnect);
router.get("/users/me", [verifyToken], UsersController.getMe);
router.get("/disconnect", [verifyToken], AuthController.getDisconnect);
router.post("/files", [verifyToken], FilesController.postUpload);

export default router;
