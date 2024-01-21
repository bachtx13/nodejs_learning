import {Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm"
import {LoginInformation} from "./LoginInformation";
import {UserStatusEnum} from "../enum/user-status";
import {UserRoleEnum} from "../enum/user-role";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({unique: true})
    email: string

    @Column()
    password: string

    @Column({default: UserStatusEnum.INACTIVE})
    status: number
    @Column({default: UserRoleEnum.NORMAL_USER})
    role: string
    @Column({default: "User"})
    username: string
    @Column({default: 10})
    age: number
    @OneToMany(() => LoginInformation, loginInformation => loginInformation.user)
    loginInformation: Relation<LoginInformation[]>
}
