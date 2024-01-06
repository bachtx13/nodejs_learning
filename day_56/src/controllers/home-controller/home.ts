import {Request, Response} from "express";
import {userRepository} from "../../repositories";
import {UserResponse} from "../../interfaces/user-response";

const homeView = async (req: Request, res: Response) => {
    try {
        const userId = req.cookies['user-id'];
        if (!userId) {
            return res.redirect('/auth/login')
        }
        const userLogin = await (await userRepository()).findOneBy({
            id: userId
        })
        return res.render("home", {
            title: 'Home',
            message: {},
            user: <UserResponse>{
                fullName: userLogin?.fullName,
                age: userLogin?.age
            }
        });
    } catch (err) {
        console.log(err)
    }
}

export {
    homeView
}