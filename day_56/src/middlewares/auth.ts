import {NextFunction, Request, Response} from "express";
import {getUserRepository} from "../repositories";
import {UserStatus} from "../enums/user-status";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const nonSecurePaths = ['/auth/login', '/auth/register'];
        if (nonSecurePaths.includes(req.path)) {
            return next();
        }

        const userId = req.cookies['user-id'];
        if (!userId) {
            return redirectToLogin(req, res, next, "Not logged yet")
        }

        const userRepository = await getUserRepository();

        const userExisted = await userRepository.findOneBy({
            id: userId
        })

        if (!userExisted) {
            return redirectToLogin(req, res, next, "Your account is not exists")
        } else if (userExisted.status === UserStatus.INACTIVE) {
            return redirectToLogin(req, res, next, "Your account is inactive")
        }
        return next()
    } catch (err) {
        req.flash('some-error', 'Some error')
        res.redirect("/auth/login");
    }
}


const redirectToLogin = (req: Request, res: Response, next: NextFunction, message: string) => {
    req.flash("login-error", message);
    if (req.path === "/auth/login") {
        return next()
    }
    return res.redirect("/auth/login")
}
