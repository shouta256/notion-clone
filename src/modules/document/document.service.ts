import { Injectable } from '@nestjs/common';
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
  async getDocumentsByUserIdAndParentId(
    userId: number,
    parentDocumentId: number,
  ): Promise<Document[] | number> {
    try {
      const documents = await this.documentService.find({
        where: { userId, parentDocumentId },
      });
      return documents;
    } catch (error) {
      console.error('Error fetching documents:', error);
      return 500;
    }
  }
}
