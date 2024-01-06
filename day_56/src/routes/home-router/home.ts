import {Router} from "express";
import {homeView} from "../../controllers/home-controller/home";

const router = Router()

router.get("/", homeView)

export default router;