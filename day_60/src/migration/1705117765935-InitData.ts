import {MigrationInterface, QueryRunner} from "typeorm";
import {UserStatusEnum} from "../enum/user-status";
import {UserRoleEnum} from "../enum/user-role";
import {hashPassword} from "../utils/password-util";

export class InitData1705117765935 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const admin = {
            email: "admin@gmail.com",
            password: await hashPassword("Hongha@0705"),
            role: UserRoleEnum.ADMIN,
            status: UserStatusEnum.ACTIVE
        }
        await queryRunner.query(`
            INSERT INTO "user"("email", "password", "role", "status")
            VALUES('${admin.email}', '${admin.password}', '${admin.role}', ${admin.status})
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
