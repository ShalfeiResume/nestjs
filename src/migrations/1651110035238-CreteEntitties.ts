import {MigrationInterface, QueryRunner} from "typeorm";

export class CreteEntitties1651110035238 implements MigrationInterface {
    name = 'CreteEntitties1651110035238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "date" integer, "time" integer, "description" character varying, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "login" character varying, "password" character varying, "firstName" character varying, "lastName" character varying, "email" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
    }

}
