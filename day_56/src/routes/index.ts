import {Router} from "express";
import authRoute from "./auth-router";
import homeRouter from "./home-router";

const router = Router()
router.use('/auth', authRoute)
router.use('/home', homeRouter)

export default router