import {NextFunction, Request, Response} from "express";
import {getUserRepository} from "../repositories";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const nonSecurePaths = ['/auth/login', '/auth/register'];
        if (nonSecurePaths.includes(req.path)) {
            return next();
        }

        const userId = req.cookies['user-id'];
        if (!userId) {
            return res.redirect('/auth/login')
        }
        const userRepository = await getUserRepository();

        const userExisted = await userRepository.existsBy({
            id: userId
        })
        if (userExisted) {
            return next()
        }
        req.flash("not-logged-yet-error", "You are not logged yet");
        return res.redirect("/auth/login")
    } catch (err) {
        req.flash('some-error', 'Some error')
        res.redirect("/auth/login");
    }
}

