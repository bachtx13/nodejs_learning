import {NextFunction, Request, Response} from "express";
import {getUserRepository} from "../../repositories";
import {IUserChangeStatus} from "../../interfaces/user-change-status";

const userChangeStatus = async (req: Request<IUserChangeStatus>, res: Response, next: NextFunction) => {
    try {
        const {
            id
        } = <IUserChangeStatus>req.body;
        if (!id) {
            res.redirect(req.path)
        }
        const userRepository = await getUserRepository()
        const user = await userRepository.findOneBy({
            id
        })
        if (user) {
            user.status = (user.status === 0) ? 1 : 0;
            await userRepository.save(user)
        }
        return res.redirect(req.get('referer') ?? "/home")
    } catch (err) {
        console.log(err)
    }
}

export {
    userChangeStatus
}