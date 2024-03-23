import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteDocumentUserId1711105605287 implements MigrationInterface {
    name = 'DeleteDocumentUserId1711105605287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_7424ddcbdf1e9b067669eb0d3fd\``);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_7424ddcbdf1e9b067669eb0d3fd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_7424ddcbdf1e9b067669eb0d3fd\``);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`userId\` \`userId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_7424ddcbdf1e9b067669eb0d3fd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
