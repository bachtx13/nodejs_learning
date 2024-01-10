import {Router} from "express";
import {userChangeStatus} from "../../controllers/user-controller/user";

const router = Router()


router.post('/change-status', userChangeStatus)

export default router;