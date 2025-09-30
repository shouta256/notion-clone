import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddDocumentContent1711238361256 implements MigrationInterface {
  name = "AddDocumentContent1711238361256";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `document` ADD `content` json NULL");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `document` DROP COLUMN `content`");
  }
}
