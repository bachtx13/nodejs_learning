import {NextFunction, Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {decodeToken} from "../utils/jwt-util";
import httpContext from "express-http-context";
import {UserStatusEnum} from "../enum/user-status";
import {BlackList} from "../entity/BlackList";
import {LoginInformation} from "../entity/LoginInformation";
import {IUserResponse} from "../interfaces/response/user-response";

const middleware = async (request: Request, response: Response, next: NextFunction) => {

    try {

        const uncheckRoute = ["/auth/login", "/auth/register"]
        if (uncheckRoute.includes(request.path)) {
            return next()
        }
        const token = request.cookies["jwt-token"];
        if (!token) {
            const uncheckHomeRoute = ["/", "/home"]
            if (uncheckHomeRoute.includes(request.path)) {
                return next()
            }
            request.flash("alert", "You are not logged yet")
            return response.redirect('/auth/login')
        }
        const userRepository = AppDataSource.getRepository(User);
        const payload = decodeToken(token);
        if (typeof payload === "string") {
            return
        }
        const user = await userRepository.findOneBy({
            email: payload.email
        })
        if (!user) {
            const uncheckHomeRoute = ["/", "/home"]
            if (uncheckHomeRoute.includes(request.path)) {
                return next()
            }
            request.flash("alert", "You are not logged yet")
            return response.redirect('/auth/login')
        }
        const blackListRepository = AppDataSource.getRepository(BlackList)
        const isTokenInBlackList = await blackListRepository.existsBy({
            token: token
        })
        if (isTokenInBlackList) {
            request.flash("alert", "Invalid login session, please login again")
            return response.redirect('/auth/login')
        }

        if (user.status === UserStatusEnum.INACTIVE) {
            request.flash("alert", "Your account is inactive")
            return response.redirect('/auth/login')
        }

        const loginInformationRepository = AppDataSource.getRepository(LoginInformation)
        const userAgent = request.get("user-agent") ?? ""
        let loginInformationWithCurrentUserAgent = await loginInformationRepository.findOneBy({
            user: user,
            userAgent: userAgent
        })

        if (loginInformationWithCurrentUserAgent && loginInformationWithCurrentUserAgent.isLogout) {
            request.flash("alert", "Invalid login session, please login again")
            return response.redirect('/auth/login')
        }
        if (!loginInformationWithCurrentUserAgent) {
            request.flash("alert", "Invalid login session, please login again")
            return response.redirect('/auth/login')
        }
        loginInformationWithCurrentUserAgent.isLogout = false;
        loginInformationWithCurrentUserAgent.lastVisit = new Date();
        await loginInformationRepository.save(loginInformationWithCurrentUserAgent)
        const userLogged = <IUserResponse>{
            id: user.id,
            email: user.email,
            status: user.status,
            age: user.age,
            username: user.username,
            role: user.role
        }
        httpContext.set("user-logged", userLogged)

        return next()
    } catch (err) {
        request.flash("alert", "You are not logged yet")
        return response.redirect('/auth/login')
    }

}
export default middleware