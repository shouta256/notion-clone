import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from 'src/entities/document.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentService: Repository<Document>,
  ) {}

  //新規ドキュメントを作成する
  async createDocument(document: Document) {
    const createdDocument = await this.documentService.save(document);
    return createdDocument;
  }

  // ドキュメントを更新する
  async updateDocument(
    updatedDocumentData: Partial<Document>,
  ): Promise<Document | null> {
    const documentToUpdate = await this.documentService.findOne({
      where: { id: updatedDocumentData.id },
    });
    if (!documentToUpdate) {
      return null;
    }

    Object.assign(documentToUpdate, updatedDocumentData);

    const updatedDocument = await this.documentService.save(documentToUpdate);
    return updatedDocument;
  }

  //アーカイブされていないuserIdと一致するドキュメントを探す
  async getDocumentsByUserId(userId: number): Promise<Document[]> {
    return this.documentService.find({
      where: { userId: userId, isArchive: false },
    });
  }

  //parentIdに一致する子のドキュメントを探す
  async getDocumentsByParentId(parentDocumentId: number): Promise<Document[]> {
    try {
      const documents = await this.documentService.find({
        where: { parentDocumentId: parentDocumentId },
      });
      return documents;
    } catch (error) {
      throw new UnauthorizedException('ドキュメントが存在しません');
    }
  }

  //ドキュメントをアーカイブする
  async moveToArchive(documentId: number): Promise<Document | null> {
    const document = await this.documentService.findOne({
      where: { id: documentId },
    });
    if (!document) {
      return null; // ドキュメントが見つからない場合は null を返す
    }

    document.isArchive = true; // ドキュメントをアーカイブする
    const archivedDocument = await this.documentService.save(document); // ドキュメントを保存して返す

    return archivedDocument;
  }

  //ドキュメントとその子を全てアーカイブする
  async moveToArchiveRecursive(documentId: number): Promise<void> {
    // ドキュメントをアーカイブする
    await this.moveToArchive(documentId);

    // 子ドキュメントを取得して再帰的にアーカイブする
    const childDocuments = await this.getDocumentsByParentId(documentId);
    for (const childDocument of childDocuments) {
      await this.moveToArchiveRecursive(childDocument.id);
    }
  }

  //ドキュメントをリストアする
  async moveToRestore(documentId: number): Promise<Document | null> {
    const document = await this.documentService.findOne({
      where: { id: documentId },
    });
    if (!document) {
      return null;
    }

    document.isArchive = false;
    const archivedDocument = await this.documentService.save(document);

    return archivedDocument;
  }

  //ドキュメントとその子を全てリストアする
  async moveToRestoreRecursive(documentId: number): Promise<void> {
    // ドキュメントをリストアする
    await this.moveToRestore(documentId);

    // 子ドキュメントを取得して再帰的にリストアする
    const childDocuments = await this.getDocumentsByParentId(documentId);
    for (const childDocument of childDocuments) {
      await this.moveToRestoreRecursive(childDocument.id);
    }
  }
}
