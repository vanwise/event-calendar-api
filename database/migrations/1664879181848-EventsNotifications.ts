import { MigrationInterface, QueryRunner } from "typeorm";

export class EventsNotifications1664879181848 implements MigrationInterface {
    name = 'EventsNotifications1664879181848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startDateISO" TIMESTAMP WITH TIME ZONE NOT NULL, "title" text NOT NULL, "body" text NOT NULL, "data" text, "isRead" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notificationSubscriptions" ("endpoint" character varying NOT NULL, "expirationTime" integer, "keys" text NOT NULL, CONSTRAINT "PK_abab0de795090b29f26d42bd967" PRIMARY KEY ("endpoint"))`);
        await queryRunner.query(`CREATE TABLE "notificationSubscriptionsUsers" ("subscriptionEndpoint" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_f89a27bf41d02dfce946ee45841" PRIMARY KEY ("subscriptionEndpoint", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c1642b58db716903fa1e5b3321" ON "notificationSubscriptionsUsers" ("subscriptionEndpoint") `);
        await queryRunner.query(`CREATE INDEX "IDX_0b86dd648ba6aeed8a939e46b0" ON "notificationSubscriptionsUsers" ("userId") `);
        await queryRunner.query(`ALTER TABLE "events" ADD "notificationId" uuid`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "UQ_62ebf0a47d6d2e72f8cccc87c00" UNIQUE ("notificationId")`);
        await queryRunner.query(`ALTER TABLE "events" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "lastName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login")`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_62ebf0a47d6d2e72f8cccc87c00" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_9929fa8516afa13f87b41abb263" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notificationSubscriptionsUsers" ADD CONSTRAINT "FK_c1642b58db716903fa1e5b33217" FOREIGN KEY ("subscriptionEndpoint") REFERENCES "notificationSubscriptions"("endpoint") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "notificationSubscriptionsUsers" ADD CONSTRAINT "FK_0b86dd648ba6aeed8a939e46b0f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notificationSubscriptionsUsers" DROP CONSTRAINT "FK_0b86dd648ba6aeed8a939e46b0f"`);
        await queryRunner.query(`ALTER TABLE "notificationSubscriptionsUsers" DROP CONSTRAINT "FK_c1642b58db716903fa1e5b33217"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_9929fa8516afa13f87b41abb263"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_62ebf0a47d6d2e72f8cccc87c00"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "lastName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "UQ_62ebf0a47d6d2e72f8cccc87c00"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "notificationId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0b86dd648ba6aeed8a939e46b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1642b58db716903fa1e5b3321"`);
        await queryRunner.query(`DROP TABLE "notificationSubscriptionsUsers"`);
        await queryRunner.query(`DROP TABLE "notificationSubscriptions"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
