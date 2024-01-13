import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {NextFunction, Request, Response} from "express";
import {ILoginRequest} from "../interfaces/request/login-request";
import {comparePassword, hashPassword} from "../utils/password-util";
import {generateToken} from "../utils/jwt-util";
import {registerValidator} from "../validators";
import {IRegisterRequest} from "../interfaces/request/register-request";
import {ValidationError} from "yup";
import {IErrorModel} from "../interfaces/common/error-model";
import {UserStatusEnum} from "../enum/user-status";
import {LoginInformation} from "../entity/LoginInformation";
import {BlackList} from "../entity/BlackList";
import httpContext from "express-http-context";
import {ILogoutOtherDeviceRequest} from "../interfaces/request/logout-other-device-request";
import {UserRoleEnum} from "../enum/user-role";

export class AuthController {

    async loginView(request: Request, response: Response, next: NextFunction) {

        const userLogging = <ILoginRequest>{
            email: "",
            password: ""
        }

        const error = <IErrorModel>{
            alert: request.flash("alert")[0]
        }
        response.render('auth/login', {
            title: "Login",
            user: userLogging,
            error: error
        })
    }

    async login(request: Request, response: Response, next: NextFunction) {
        const {
            email,
            password
        } = <ILoginRequest>request.body;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({
            email
        });
        if (!user) {
            return response.render('auth/login', {
                user: {
                    email, password
                },
                error: {
                    email: "Email is not registered"
                }
            })
        }
        if (!(user?.password && await comparePassword(password, user.password))) {
            return response.render('auth/login', {
                user: {
                    email, password
                },
                error: {
                    password: "Password does not match"
                }
            })
        }
        if (user.status === UserStatusEnum.INACTIVE) {
            request.flash("alert", "Your account is inactive")
            return response.redirect('/auth/login')
        }
        const userAgent = request.get("user-agent") ?? "";
        const token = generateToken({
            email: email,
            userAgent: userAgent
        })
        const loginInformationRepository = AppDataSource.getRepository(LoginInformation)
        let loginInformation = await loginInformationRepository.findOneBy({
            user: user,
            userAgent: userAgent
        })
        if (!loginInformation) {
            loginInformation = new LoginInformation();
            loginInformation.user = user
            loginInformation.userAgent = userAgent
        }
        loginInformation.lastVisit = new Date();
        loginInformation.isLogout = false;
        await loginInformationRepository.save(loginInformation)
        response.cookie("jwt-token", token)
        if (user.role === UserRoleEnum.ADMIN) {
            return response.redirect("/admin")
        }
        return response
            .redirect('/')
    }

    async registerView(request: Request, response: Response, next: NextFunction) {
        const userRegistering = <IRegisterRequest>{
            email: "",
            password: "",
            passwordConfirmation: ""
        }

        const error = <IErrorModel>{
            alert: request.flash("alert")[0]
        }
        response.render('auth/register', {
            title: "Register",
            user: userRegistering,
            error: error
        })
    }

    async register(request: Request, response: Response, next: NextFunction) {
        const registerRequest = <IRegisterRequest>request.body;
        try {
            const {
                email,
                password,
                passwordConfirmation
            } = registerRequest;
            const registerValidate = await registerValidator.validate(registerRequest)
            const userRepository = AppDataSource.getRepository(User);
            const userRegister = new User();

            const isUserExisted = await userRepository.existsBy({
                email: email
            })
            if (isUserExisted) {
                const error: IErrorModel = {};
                error["email"] = "Email already registered"
                return response.render('auth/register', {
                    title: "Register",
                    user: registerRequest,
                    error: error
                })
            }

            userRegister.email = email
            userRegister.password = await hashPassword(password)
            await userRepository.save(userRegister)
            return response.redirect("/auth/login")
        } catch (err) {
            if (err instanceof ValidationError) {
                const error: IErrorModel = {};
                error[err?.path! ?? "alert"] = err.errors[0]
                return response.render('auth/register', {
                    title: "Register",
                    user: registerRequest,
                    error: error
                })
            }
        }
    }

    async logout(request: Request, response: Response, next: NextFunction) {
        try {
            const user = httpContext.get('user-logged')
            if (!user) {
                request.flash("alert", "You are not logged yet")
                return response.redirect("/auth/login")
            }

            const blackListRepository = AppDataSource.getRepository(BlackList)
            const newBlackListItem = new BlackList();
            newBlackListItem.token = request.cookies['jwt-token'];
            await blackListRepository.save(newBlackListItem)

            const loginInformationRepository = AppDataSource.getRepository(LoginInformation)
            const loginInformationList = await loginInformationRepository.findBy({
                user: user,
                userAgent: request.get("user-agent")
            })
            if (loginInformationList.length > 0) {
                loginInformationList.forEach((loginInformation) => {
                    loginInformation.isLogout = true
                })
                await loginInformationRepository.save(loginInformationList)
            }
            httpContext.set("user-logged", undefined)
            response.clearCookie('jwt-token');
            return response.redirect("/auth/login")
        } catch (err) {
            request.flash("alert", "Some error")
            return response.redirect("/auth/login")
        }
    }


    async logoutFromOtherDevice(request: Request, response: Response, next: NextFunction) {
        try {
            const user = httpContext.get("user-logged")
            const {
                deviceId
            } = <ILogoutOtherDeviceRequest>request.body;
            const loginInformationRepository = AppDataSource.getRepository(LoginInformation)
            const loginInformation = await loginInformationRepository.findOneBy({
                user: user,
                id: deviceId
            })
            if (loginInformation) {
                loginInformation.isLogout = true;
                await loginInformationRepository.save(loginInformation)
            }
            return response.redirect(request.get("referer") ?? "")
        } catch (err) {
            return response.redirect(request.get("referer") ?? "")
        }
    }

    async logoutFromAllOtherDevices(request: Request, response: Response, next: NextFunction) {
        try {
            const user = httpContext.get("user-logged")
            const loginInformationRepository = AppDataSource.getRepository(LoginInformation)
            const loginInformationList = await loginInformationRepository.findBy({
                user: user,
                isLogout: false
            })
            loginInformationList.forEach((loginInformation) => {
                loginInformation.isLogout = true;
            })
            await loginInformationRepository.save(loginInformationList)
            return response.redirect(request.get("referer") ?? "")
        } catch (err) {
            return response.redirect(request.get("referer") ?? "")
        }
    }

}