import {Request, Response} from "express";
import {UserRequest} from "../../interfaces/user-request";
import {RegisterRequest} from "../../interfaces/register-request";
import {User} from "../../entity/User";
import {getUserRepository} from "../../repositories";
import {comparePassword, hashPassword} from "../../utils/password-util";
import {LoginRequest} from "../../interfaces/login-request";
import {addDate} from "../../utils/date-util";

const loginView = (req: Request, res: Response) => {
    const error = req.flash('login-error');
    res.render("auth/login", {
        title: 'Login',
        message: {
            error: error,
        },
        user: <UserRequest>{
            username: '',
            password: ''
        }
    });
}
const registerView = (req: Request, res: Response) => {
    res.render("auth/register", {
        title: 'Register',
        message: {},
        user: <RegisterRequest>{
            username: '',
            password: '',
            fullName: '',
            age: 0
        }
    });
}

const register = async (req: Request<RegisterRequest>, res: Response) => {
    try {
        const {
            username,
            age,
            password,
            fullName
        } = <RegisterRequest>req.body;
        const usernameExist = await (await getUserRepository()).existsBy({
            username
        })
        if (usernameExist) {
            return res.render("auth/register", {
                title: 'Register',
                message: {
                    username: {
                        error: "Username already exists"
                    }
                },
                user: <RegisterRequest>{
                    username,
                    password,
                    fullName,
                    age,
                    status: 0
                }
            });
        }
        const newUser: User = new User();
        newUser.username = username
        newUser.password = await hashPassword(password)
        newUser.fullName = fullName
        newUser.age = age
        const userRegistered = await (await getUserRepository()).save(newUser)
        return res.redirect('/auth/login')
    } catch (err) {
        console.log(err)
    }
}
const login = async (req: Request<RegisterRequest>, res: Response) => {
    try {
        const {
            username,
            password,
        } = <LoginRequest>req.body;
        const newUser: User = new User();
        newUser.username = username
        newUser.password = password
        const userLogin = await (await getUserRepository()).findOneBy({
            username: username
        })
        if (!userLogin) {
            return res.render("auth/login", {
                title: 'Login',
                message: {
                    username: {
                        error: "Username not found"
                    }
                },
                user: <UserRequest>{
                    username: username,
                    password: password
                }
            });
        }
        if (userLogin?.password && userLogin?.password != '' && await comparePassword(password, userLogin?.password)) {
            res.cookie('user-id', userLogin.id, {
                expires: addDate(new Date(), 7)
            })
            return res.redirect('/home')
        }
        return res.render("auth/login", {
            title: 'Login',
            message: {
                password: {
                    error: "Password not match"
                }
            },
            user: <UserRequest>{
                username: username,
                password: password
            }
        });
    } catch (err) {
        console.log(err)
    }
}

const logout = (req: Request<RegisterRequest>, res: Response) => {
    try {
        res.clearCookie('user-id')
        res.redirect('/auth/login')
    } catch (err) {
        console.log(err)
    }
}
export {
    loginView,
    registerView,
    register,
    login,
    logout
}