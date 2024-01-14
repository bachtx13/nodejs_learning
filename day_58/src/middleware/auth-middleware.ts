import {NextFunction, Request, Response} from "express";
import httpContext from "express-http-context";
import {UserService} from "../services/UserService";


const publicRoutes = ["/auth/login", "/auth/register", "/", "/home"]
const userService = new UserService()
const middleware = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userLogged = await userService.getUserLogged(request, response)
        httpContext.set("user-logged", userLogged)
        if (!userLogged && !publicRoutes.includes(request.path)) {
            return response.redirect('/auth/login')
        }
        request.flash("alert", "")
        return next()
    } catch (err) {
        request.flash("alert", "You are not logged yet")
        return response.redirect('/auth/login')
    }

}

export default middleware