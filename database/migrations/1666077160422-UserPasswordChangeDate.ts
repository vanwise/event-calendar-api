import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPasswordChangeDate1666077160422 implements MigrationInterface {
  name = 'UserPasswordChangeDate1666077160422';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "passwordChangeDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '"2022-10-18T07:12:42.718Z"'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "passwordChangeDate"`,
    );
  }
}
