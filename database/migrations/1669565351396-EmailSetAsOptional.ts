import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmailSetAsOptional1669565351396 implements MigrationInterface {
  name = 'EmailSetAsOptional1669565351396';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "passwordChangeDate" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "passwordChangeDate" SET DEFAULT '2022-10-18 07:12:42.718+00'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`,
    );
  }
}
