import {Router} from "express";
import {login, loginView, logout, register, registerView} from "../../controllers/auth-controller/auth";

const router = Router()

router.get('/login', loginView)
router.post('/login', login)


router.get('/register', registerView)
router.post('/register', register)

router.post('/logout', logout)

export default router;