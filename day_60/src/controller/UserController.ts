import {NextFunction, Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {IChangeUserStatusRequest} from "../interfaces/request/change-user-status-request";
import {UserStatusEnum} from "../enum/user-status";
import {IErrorModel} from "../interfaces/common/error-model";
import httpContext from "express-http-context";
import {LoginInformation} from "../entity/LoginInformation";
import useragent from "express-useragent";
import {ILoginInformationResponse} from "../interfaces/response/login-information-response";
import moment from "moment";
import {changePasswordValidator, userInformationValidator} from "../validators";
import {ValidationError} from "yup";
import {IChangeUserInformationRequest} from "../interfaces/request/change-user-information-request";
import {IUserResponse} from "../interfaces/response/user-response";
import {IChangePasswordRequest} from "../interfaces/request/change-password-request";
import {comparePassword, hashPassword} from "../utils/password-util";

export class UserController {

    async changeStatus(request: Request, response: Response, next: NextFunction) {
        const changeStatusRequest = <IChangeUserStatusRequest>request.body;
        try {
            const {
                userId
            } = changeStatusRequest;
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({
                id: userId
            })
            if (!user) {
                request.flash("alert", "User does not exists")
                return response.redirect(request.get("referer") ?? "/")
            }
            user.status = user.status === UserStatusEnum.INACTIVE ? UserStatusEnum.ACTIVE : UserStatusEnum.INACTIVE;
            await userRepository.save(user)
            return response.redirect(request.get("referer") ?? "/")
        } catch (err) {
            request.flash("alert", "Some error")
            return response.redirect(request.get("referer") ?? "/")
        }
    }

    async devicesLoggedInView(request: Request, response: Response, next: NextFunction) {
        try {
            const error = <IErrorModel>{
                alert: request.flash("alert")[0]
            }
            const user = httpContext.get("user-logged")
            const loginInformationRepository = AppDataSource.getRepository(LoginInformation)
            const loginInformationList = await loginInformationRepository.find({
                order: {
                    lastVisit: "desc"
                },
                where: {
                    user: user
                }
            })

            const loginInformationResponseList = loginInformationList.map((loginInformation) => {
                const {
                    browser,
                    os,
                    platform,
                    version
                } = useragent.parse(loginInformation.userAgent)

                return <ILoginInformationResponse>{
                    browser,
                    os,
                    platform,
                    version,
                    isLogout: loginInformation.isLogout,
                    deviceId: loginInformation.id,
                    lastVisit: moment(loginInformation.lastVisit).fromNow().toString()
                }
            })

            response.render('user/user-devices-logged-in', {
                title: "Login",
                userLogged: user,
                loginInformationList: loginInformationResponseList,
                error: error,
                pathActive: 'devices'
            })
        } catch (err) {
            request.flash("alert", "Some error")
            return response.redirect("/auth/login")
        }
    }

    async userInformationView(request: Request, response: Response, next: NextFunction) {
        try {
            const user = httpContext.get("user-logged")
            response.render('user/user-information', {
                title: "User Information",
                userLogged: user,
                pathActive: 'user-information'
            })
        } catch (err) {

        }
    }

    async changeUserInformation(request: Request, response: Response, next: NextFunction) {
        const changeInformationRequest = <IChangeUserInformationRequest>request.body;
        try {
            const {
                username,
                age
            } = changeInformationRequest;
            const userLogged = <IUserResponse>httpContext.get("user-logged")
            await userInformationValidator.validate(changeInformationRequest)
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({
                id: userLogged.id
            })

            if (user) {
                user.username = username;
                user.age = age;
                await userRepository.save(user)
            }
            return response.redirect(request.get("referer") ?? "")
        } catch (err) {
            if (err instanceof ValidationError) {
                const error: IErrorModel = {};
                error[err?.path! ?? "alert"] = err.errors[0]
                return response.render('user/user-information', {
                    title: "User Information",
                    userLogged: changeInformationRequest,
                    error: error
                })
            }
        }
    }

    async changePasswordView(request: Request, response: Response, next: NextFunction) {
        try {
            const user = httpContext.get("user-logged")
            const changePasswordUser = <IChangePasswordRequest>{
                newPassword: "",
                oldPassword: "",
                confirmationPassword: ""
            }
            response.render('user/change-password', {
                title: "Change Password",
                userLogged: user,
                changePasswordUser: changePasswordUser,
                pathActive: 'change-password'
            })
        } catch (err) {

        }
    }

    async changePassword(request: Request, response: Response, next: NextFunction) {
        const changePasswordRequest = <IChangePasswordRequest>request.body;
        const userLogged = <IUserResponse>httpContext.get("user-logged")
        try {
            const {
                oldPassword,
                newPassword,
                confirmationPassword
            } = changePasswordRequest;
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({
                id: userLogged.id
            })
            if (!user) {
                return response.render('user/change-password', {
                    title: "User Information",
                    userLogged: userLogged,
                    changePasswordUser: changePasswordRequest,
                    error: {
                        alert: "User not found, please reload page"
                    }
                })
            }
            if (!(await comparePassword(oldPassword, user.password))) {
                return response.render('user/change-password', {
                    title: "User Information",
                    userLogged: userLogged,
                    changePasswordUser: changePasswordRequest,
                    error: {
                        oldPassword: "Old Password does not match"
                    }
                })
            }
            await changePasswordValidator.validate(changePasswordRequest)
            user.password = await hashPassword(newPassword)
            await userRepository.save(user)

            const loginInformationRepository = AppDataSource.getRepository(LoginInformation)
            const loginInformationList = await loginInformationRepository.findBy({
                user: user,
                isLogout: false
            })
            loginInformationList.forEach((loginInformation) => {
                loginInformation.isLogout = true;
            })
            await loginInformationRepository.save(loginInformationList)
            request.flash("alert", "Change password successfully, please login")
            return response.redirect("/auth/login")
        } catch (err) {
            if (err instanceof ValidationError) {
                const error: IErrorModel = {};
                error[err?.path! ?? "alert"] = err.errors[0]
                return response.render('user/change-password', {
                    title: "User Information",
                    userLogged: userLogged,
                    changePasswordUser: changePasswordRequest,
                    error: error
                })
            }
        }
    }
}