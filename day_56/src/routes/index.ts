import {Router} from "express";
import authRoute from "./auth-router";
import homeRouter from "./home-router";
import userRouter from "./user-router";

const router = Router()
router.use('/auth', authRoute)
router.use('/home', homeRouter)
router.use('/user', userRouter)

export default router