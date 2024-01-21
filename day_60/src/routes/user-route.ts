import {Router} from "express";
import {UserController} from "../controller/UserController";

const userController = new UserController()
const route = Router();

route.post('/change-status', userController.changeStatus)

route.get(['', '/information'], userController.userInformationView)
route.post(['/change-information'], userController.changeUserInformation)

route.get(['/devices'], userController.devicesLoggedInView)

route.get(['/change-password'], userController.changePasswordView)
route.post(['/change-password'], userController.changePassword)

export default route;