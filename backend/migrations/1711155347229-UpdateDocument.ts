import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDocument1711155347229 implements MigrationInterface {
    name = 'UpdateDocument1711155347229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_7424ddcbdf1e9b067669eb0d3fd\` ON \`document\``);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`userId\` \`userId\` int NOT NULL DEFAULT '-1'`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_7424ddcbdf1e9b067669eb0d3fd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_7424ddcbdf1e9b067669eb0d3fd\``);
        await queryRunner.query(`ALTER TABLE \`document\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`CREATE INDEX \`FK_7424ddcbdf1e9b067669eb0d3fd\` ON \`document\` (\`userId\`)`);
    }

}
