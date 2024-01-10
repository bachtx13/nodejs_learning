import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigration1704857065089 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `create table if not exists users
                (
                    id        uuid primary key,
                    username  varchar(50)  not null,
                    password  varchar(100) not null,
                    full_name varchar(50)  not null,
                    age       int,
                    status    int          not null default 0
                );`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
