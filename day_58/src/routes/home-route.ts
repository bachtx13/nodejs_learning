import {Router} from "express";
import {HomeController} from "../controller/HomeController";

const homeController = new HomeController();
const route = Router();

route.get(['/home', ''], homeController.homeView)


export default route;