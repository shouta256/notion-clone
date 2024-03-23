import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDocumentUserId1711106329789 implements MigrationInterface {
    name = 'AddDocumentUserId1711106329789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_7424ddcbdf1e9b067669eb0d3fd\``);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`userId\` \`userId\` int NULL DEFAULT '-1'`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_7424ddcbdf1e9b067669eb0d3fd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_7424ddcbdf1e9b067669eb0d3fd\``);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_7424ddcbdf1e9b067669eb0d3fd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
