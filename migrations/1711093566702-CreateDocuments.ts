import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDocuments1711093566702 implements MigrationInterface {
    name = 'CreateDocuments1711093566702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`document\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`parentDocumentId\` int NULL DEFAULT '-1', \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`document\``);
    }

}
