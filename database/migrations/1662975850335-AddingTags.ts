import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingTags1662975850335 implements MigrationInterface {
  name = 'AddingTags1662975850335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "events" ADD "tagId" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_2751f71174cc243afa31670ea95" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_2751f71174cc243afa31670ea95"`,
    );
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "tagId"`);
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}
