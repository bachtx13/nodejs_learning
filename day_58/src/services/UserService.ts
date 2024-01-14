import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {decodeToken} from "../utils/jwt-util";
import {BlackList} from "../entity/BlackList";
import {UserStatusEnum} from "../enum/user-status";
import {LoginInformation} from "../entity/LoginInformation";
import {IUserResponse} from "../interfaces/response/user-response";

export class UserService {
    getUserLogged = async (request: Request, response: Response) => {
        try {
            const token = request.cookies["jwt-token"];
            if (!token) {
                request.flash("alert", "You are not logged yet")
                return
            }
            const userRepository = AppDataSource.getRepository(User);
            const payload = decodeToken(token);
            if (typeof payload === "string") {
                request.flash("alert", "You are not logged yet")
                return
            }

            const user = await userRepository.findOneBy({
                email: payload.email
            })
            if (!user) {
                request.flash("alert", "You are not logged yet")
                return
            }
            const blackListRepository = AppDataSource.getRepository(BlackList)
            const isTokenInBlackList = await blackListRepository.existsBy({
                token: token
            })
            if (isTokenInBlackList) {
                request.flash("alert", "Invalid login session, please login again")
                return
            }

            if (user.status === UserStatusEnum.INACTIVE) {
                request.flash("alert", "Your account is inactive")
                return
            }

            const loginInformationRepository = AppDataSource.getRepository(LoginInformation)
            const userAgent = request.get("user-agent") ?? ""
            let loginInformationWithCurrentUserAgent = await loginInformationRepository.findOneBy({
                user: user,
                userAgent: userAgent
            })

            if (!loginInformationWithCurrentUserAgent || (loginInformationWithCurrentUserAgent && loginInformationWithCurrentUserAgent.isLogout)) {
                request.flash("alert", "Invalid login session, please login again")
                return
            }
            loginInformationWithCurrentUserAgent.isLogout = false;
            loginInformationWithCurrentUserAgent.lastVisit = new Date();
            await loginInformationRepository.save(loginInformationWithCurrentUserAgent)
            return <IUserResponse>{
                id: user.id,
                email: user.email,
                status: user.status,
                age: user.age,
                username: user.username,
                role: user.role
            }
        } catch (err) {
            request.flash("alert", "Invalid login session, please login again")
            return
        }
    }
}