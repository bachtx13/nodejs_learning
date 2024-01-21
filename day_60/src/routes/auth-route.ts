import {Router} from "express";
import {AuthController} from "../controller/AuthController";
import {authMiddleware} from "../middleware/auth-middleware";

const authController = new AuthController();
const route = Router();

route.get("/login", authController.loginView)
route.post("/login", authController.login)

route.get("/register", authController.registerView)
route.post("/register", authController.register)

route.post("/logout", authMiddleware, authController.logout)
route.post("/logout-other-device", authMiddleware, authController.logoutFromOtherDevice)
route.post("/logout-all-other-devices", authMiddleware, authController.logoutFromAllOtherDevices)

export default route;