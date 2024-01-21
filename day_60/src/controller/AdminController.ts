import {NextFunction, Request, Response} from "express";
import httpContext from "express-http-context";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {UserRoleEnum} from "../enum/user-role";
import {IErrorModel} from "../interfaces/common/error-model";
import {IUserResponse} from "../interfaces/response/user-response";

export class AdminController {
    async adminView(request: Request, response: Response, next: NextFunction) {
        const userLogged = <IUserResponse>httpContext.get('user-logged')
        const userRepository = AppDataSource.getRepository(User)
        const user = await userRepository.findOneBy({
            id: userLogged.id
        })

        if (!user || user.role !== UserRoleEnum.ADMIN) {
            request.flash("alert", "You need permission to access")
            return response.redirect("/home")
        }
        const users = await userRepository.findBy({
            role: UserRoleEnum.NORMAL_USER
        })
        const error = <IErrorModel>{}

        error.alert = request.flash("alert")[0]
        response.render('admin/admin', {
            users: users,
            userLogged: userLogged,
            error
        })
    }
}