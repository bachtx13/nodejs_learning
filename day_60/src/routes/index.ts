import {Router} from "express";
import authRoute from "./auth-route";
import homeRoute from "./home-route";
import userRoute from "./user-route";
import adminRoute from "./admin-route";
import {authMiddleware} from "../middleware/auth-middleware";

const route = Router()

route.use('', homeRoute)
route.use('/auth', authRoute)
route.use('/user', authMiddleware, userRoute)
route.use('/admin', authMiddleware, adminRoute)

export default route;