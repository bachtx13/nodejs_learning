import {NextFunction, Request, Response} from "express";
import httpContext from "express-http-context";
import {UserService} from "../services/UserService";
import {AppDataSource} from "../data-source";
import {LoginInformation} from "../entity/LoginInformation";
import passport from "passport";


const publicRoutes = ["/auth/login", "/auth/register", "/", "/home"]
const userService = new UserService()
const middleware = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userLogged = await userService.getUserLogged(request, response)
        httpContext.set("user-logged", userLogged)
        if (!userLogged && !publicRoutes.includes(request.path)) {
            return response.redirect('/auth/login')
        }
        // request.flash("alert", "")
        return next()
    } catch (err) {
        request.flash("alert", "You are not logged yet")
        return response.redirect('/auth/login')
    }

}

const authMiddleware = passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/auth/login',
    failureFlash: "You are not logged yet"
})

const loginMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    const loginInformationRepository = AppDataSource.getRepository(LoginInformation)
    const userAgent = request.get("user-agent") ?? ""

    let loginInformationWithCurrentUserAgent = await loginInformationRepository.findOneBy({
        // user: user,
        userAgent: userAgent
    })
    if (!loginInformationWithCurrentUserAgent || (loginInformationWithCurrentUserAgent && loginInformationWithCurrentUserAgent.isLogout)) {
        return
    }
    loginInformationWithCurrentUserAgent.isLogout = false;
    loginInformationWithCurrentUserAgent.lastVisit = new Date();
    await loginInformationRepository.save(loginInformationWithCurrentUserAgent)
}
export {
    middleware,
    authMiddleware
}