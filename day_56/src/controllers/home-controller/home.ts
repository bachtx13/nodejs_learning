import {Request, Response} from "express";
import {getUserRepository} from "../../repositories";
import {UserResponse} from "../../interfaces/user-response";

const homeView = async (req: Request, res: Response) => {
    try {
        const userId = req.cookies['user-id'];
        const userRepository = await getUserRepository();
        const userLogin = await userRepository.findOneBy({
            id: userId
        });
        const userList = await userRepository.find()
        console.log(userList)
        return res.render("home", {
            title: 'Home',
            message: {},
            user: <UserResponse>{
                fullName: userLogin?.fullName,
                age: userLogin?.age
            },
            userList: userList
        });
    } catch (err) {
        console.log(err)
    }
}

export {
    homeView
}