import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDocumentIsArchive1711109237032 implements MigrationInterface {
    name = 'AddDocumentIsArchive1711109237032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`parentDocumentId\``);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`parent_document_id\` int NULL DEFAULT '-1'`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`user_id\` int NOT NULL DEFAULT '-1'`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`is_archive\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_7424ddcbdf1e9b067669eb0d3fd\``);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_7424ddcbdf1e9b067669eb0d3fd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_7424ddcbdf1e9b067669eb0d3fd\``);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`userId\` \`userId\` int NULL DEFAULT '-1'`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_7424ddcbdf1e9b067669eb0d3fd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`is_archive\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP COLUMN \`parent_document_id\``);
        await queryRunner.query(`ALTER TABLE \`document\` ADD \`parentDocumentId\` int NULL DEFAULT '-1'`);
    }

}
