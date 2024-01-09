import {AppDataSource} from "../database/data-source";
import {User} from '../entity/User'

const getUserRepository = async () => {
    if (AppDataSource.isInitialized) {
        return AppDataSource.getRepository(User)
    }
    return (await AppDataSource.initialize()).getRepository(User)
}

export {
    getUserRepository
}