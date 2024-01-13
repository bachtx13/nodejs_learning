import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation} from "typeorm"
import {User} from "./User";

@Entity()
export class LoginInformation {

    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column()
    userAgent: string
    @Column()
    lastVisit: Date
    @Column()
    isLogout: boolean
    @ManyToOne(() => User, user => user.loginInformation, {
        cascade: true
    })
    user: Relation<User>
}
