import {Router} from "express";
import {AuthController} from "../controller/AuthController";

const authController = new AuthController();
const route = Router();

route.get("/login", authController.loginView)
route.post("/login", authController.login)

route.get("/register", authController.registerView)
route.post("/register", authController.register)

route.post("/logout", authController.logout)
route.post("/logout-other-device", authController.logoutFromOtherDevice)
route.post("/logout-all-other-devices", authController.logoutFromAllOtherDevices)

export default route;