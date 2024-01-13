import {Router} from "express";
import authRoute from "./auth-route";
import homeRoute from "./home-route";
import userRoute from "./user-route";
import adminRoute from "./admin-route";

const route = Router()

route.use('', homeRoute)
route.use('/auth', authRoute)
route.use('/user', userRoute)
route.use('/admin', adminRoute)

export default route;