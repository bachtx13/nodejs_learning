import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity({name: "users"})
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    username: string

    @Column()
    password: string

    @Column({name: "full_name"})
    fullName: string
    @Column()
    age: number

}
