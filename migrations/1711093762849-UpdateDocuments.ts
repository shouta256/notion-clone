import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDocuments1711093762849 implements MigrationInterface {
    name = 'UpdateDocuments1711093762849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_7424ddcbdf1e9b067669eb0d3fd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_7424ddcbdf1e9b067669eb0d3fd\``);
    }

}
