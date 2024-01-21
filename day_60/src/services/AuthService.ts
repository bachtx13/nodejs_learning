import {VerifyDoneFnType} from "../types/verify-done-fn-type";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {LoginInformation} from "../entity/LoginInformation";
import {BlackList} from "../entity/BlackList";
import {UserStatusEnum} from "../enum/user-status";
import {VerifyCallbackWithRequest} from "passport-jwt";
import {IJwtPayload} from "../interfaces/common/jwt-payload";
import {getTokenFromCookies, setUserLogged} from "../utils/http-util";

export class AuthService {

    authUser: VerifyCallbackWithRequest = async (request: any, payload: IJwtPayload, done: VerifyDoneFnType) => {
        try {
            if (!payload) {
                return done(null, false)
            }
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({
                email: payload.email
            })
            if (!user) {
                return done(null, false)
            }
            const blackListRepository = AppDataSource.getRepository(BlackList)
            const isTokenInBlackList = await blackListRepository.existsBy({
                token: getTokenFromCookies(request)
            })
            if (isTokenInBlackList) {
                return done(null, false)

            }
            if (user.status === UserStatusEnum.INACTIVE) {
                return done(null, false)
            }
            const loginInformationRepository = AppDataSource.getRepository(LoginInformation)
            const userAgent = request.get("user-agent") ?? ""

            let loginInformationWithCurrentUserAgent = await loginInformationRepository.findOneBy({
                user: user,
                userAgent: userAgent
            })
            if (!loginInformationWithCurrentUserAgent || (loginInformationWithCurrentUserAgent && loginInformationWithCurrentUserAgent.isLogout)) {
                return done(null, false)
            }
            loginInformationWithCurrentUserAgent.isLogout = false;
            loginInformationWithCurrentUserAgent.lastVisit = new Date();
            await loginInformationRepository.save(loginInformationWithCurrentUserAgent)
            setUserLogged(user)
            return done(null, user)
        } catch (err) {

            console.log(err)
            return done(err, false)
        }
    }
}
