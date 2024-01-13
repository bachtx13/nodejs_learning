import {Router} from "express";
import {AdminController} from "../controller/AdminController";

const adminController = new AdminController();
const route = Router();

route.get(['/'], adminController.adminView)
export default route;