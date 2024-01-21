import {Request, Response} from "express";
import httpContext from "express-http-context";
import {IUserResponse} from "../interfaces/response/user-response";
import {User} from "../entity/User";

const getTokenFromCookies = (request: Request) => {
    const token = request.cookies['jwt-token']
    return token ? token.substring(7, token.length) : ""
}
const setTokenToCookies = (response: Response, token: string) => {
    response.cookie("jwt-token", "Bearer " + token)
}

const getUserLogged = () => {
    return httpContext.get("user-logged")
}
const setUserLogged = (user: User) => {
    httpContext.set("user-logged", <IUserResponse>{
        id: user.id,
        email: user.email,
        status: user.status,
        age: user.age,
        username: user.username,
        role: user.role
    })
}
export {
    getTokenFromCookies,
    setTokenToCookies,
    setUserLogged,
    getUserLogged
}