import {MigrationInterface, QueryRunner} from "typeorm";

export class InitTables1705108096504 implements MigrationInterface {
    name = 'InitTables1705108096504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "black_list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, CONSTRAINT "PK_6969ca1c62bdf4fef47a85b8195" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "login_information" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userAgent" character varying NOT NULL, "lastVisit" TIMESTAMP NOT NULL, "isLogout" boolean NOT NULL, "userId" uuid, CONSTRAINT "PK_ad5d81480b774478c8300b98b09" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "status" integer NOT NULL DEFAULT '0', "role" character varying NOT NULL DEFAULT 'NORMAL_USER',"username" character varying NOT NULL DEFAULT 'user' ,"age" integer NOT NULL DEFAULT '10', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "login_information" ADD CONSTRAINT "FK_d6ae7c28269a562f0f65acc708c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "login_information" DROP CONSTRAINT "FK_d6ae7c28269a562f0f65acc708c"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "login_information"`);
        await queryRunner.query(`DROP TABLE "black_list"`);
    }

}
