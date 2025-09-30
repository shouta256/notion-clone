import { MigrationInterface, QueryRunner } from 'typeorm';

export class DocumentSelfRef1717065600000 implements MigrationInterface {
  name = 'DocumentSelfRef1717065600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make parent_document_id nullable
    await queryRunner.query(
      `ALTER TABLE document MODIFY parent_document_id INT NULL DEFAULT NULL`,
    );
    // Add FK for self reference (if not exists)
    await queryRunner.query(
      `ALTER TABLE document ADD CONSTRAINT FK_document_parent FOREIGN KEY (parent_document_id) REFERENCES document(id) ON DELETE SET NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FK
    await queryRunner.query(
      `ALTER TABLE document DROP FOREIGN KEY FK_document_parent`,
    );
    // Revert to NOT NULL with default -1 (legacy)
    await queryRunner.query(
      `ALTER TABLE document MODIFY parent_document_id INT NULL DEFAULT -1`,
    );
  }
}
