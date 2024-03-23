import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDocumentIsArchive1711150625916 implements MigrationInterface {
    name = 'UpdateDocumentIsArchive1711150625916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`is_archive\` \`is_archive\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`is_archive\` \`is_archive\` tinyint NOT NULL DEFAULT '1'`);
    }

}
