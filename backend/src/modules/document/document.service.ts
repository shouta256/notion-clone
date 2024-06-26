import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from 'src/entities/document.entity';
import { Repository } from 'typeorm';
import { DocumentDataDTO } from './documentDto/documentData.dto';

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
  ): Promise<Document> {
    if ('id' in updatedDocumentData) {
      const documentToUpdate = await this.documentService.findOne({
        where: { id: updatedDocumentData.id },
      });
      if (!documentToUpdate) {
        throw new NotFoundException('Document not found');
      }

      Object.assign(documentToUpdate, updatedDocumentData);

      const updatedDocument = await this.documentService.save(documentToUpdate);
      return updatedDocument;
    } else {
      throw new Error('id must be provided');
    }
  }

  //ドキュメントIdからドキュメントを取得する
  async getDocumentByDocumentId(documentId: number): Promise<Document> {
    const document = await this.documentService.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  //アーカイブされていないuserIdと一致するドキュメントを探し、階層構造で渡す
  async getDocumentsByUserId(userId: number): Promise<DocumentDataDTO[]> {
    const documents = await this.documentService.find({
      where: { userId: userId, isArchive: false },
    });

    if (!documents) {
      throw new NotFoundException('Document not found');
    }

    // ドキュメントをツリー形式に変換するための再帰的な関数
    const buildTree = (documents: Document[]): DocumentDataDTO[] => {
      const tree: DocumentDataDTO[] = [];
      const map: Record<number, DocumentDataDTO> = {};

      documents.forEach((doc) => {
        map[doc.id] = { id: doc.id, title: doc.title, children: [] };
      });

      documents.forEach((doc) => {
        const parent = map[doc.parentDocumentId];
        if (parent) {
          parent.children.push(map[doc.id]);
        } else {
          tree.push(map[doc.id]);
        }
      });

      return tree;
    };

    return buildTree(documents);
  }

  //parentIdに一致する子のドキュメントを探す
  async getDocumentsByParentId(parentDocumentId: number): Promise<Document[]> {
    const documents = await this.documentService.find({
      where: { parentDocumentId: parentDocumentId },
    });

    if (!documents) {
      throw new NotFoundException('Document not found');
    }

    return documents;
  }

  //ドキュメントをアーカイブする
  async moveToArchive(documentId: number): Promise<Document> {
    const document = await this.documentService.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    document.isArchive = true; // ドキュメントをアーカイブする
    const archivedDocument = await this.documentService.save(document); // ドキュメントを保存して返す

    return archivedDocument;
  }

  //ドキュメントとその子を全てアーカイブする
  async moveToArchiveRecursive(documentId: number): Promise<void> {
    await this.moveToArchive(documentId); // ドキュメントをアーカイブする

    // 子ドキュメントを取得して再帰的にアーカイブする
    const childDocuments = await this.getDocumentsByParentId(documentId);
    for (const childDocument of childDocuments) {
      await this.moveToArchiveRecursive(childDocument.id);
    }
  }

  //ドキュメントをリストアする
  async moveToRestore(documentId: number): Promise<Document> {
    const document = await this.documentService.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    document.isArchive = false;
    const archivedDocument = await this.documentService.save(document);

    return archivedDocument;
  }

  //ドキュメントとその子を全てリストアする
  async moveToRestoreRecursive(documentId: number): Promise<void> {
    await this.moveToRestore(documentId); // ドキュメントをリストアする

    // 子ドキュメントを取得して再帰的にリストアする
    const childDocuments = await this.getDocumentsByParentId(documentId);
    for (const childDocument of childDocuments) {
      await this.moveToRestoreRecursive(childDocument.id);
    }
  }

  // アーカイブのドキュメントを取得
  async getArchive(userId: number): Promise<Document[]> {
    if (!userId) {
      throw new Error('Invalid user ID.');
    }
    try {
      return await this.documentService.find({
        where: { userId: userId, isArchive: true },
      });
    } catch (error) {
      console.error('Failed to fetch archived documents:', error);
      throw error;
    }
  }

  //アーカイブのドキュメントを削除
  async deleteArchive(documentId: number): Promise<Document> {
    try {
      const documentToDelete = await this.documentService.findOne({
        where: { id: documentId },
      });

      if (!documentToDelete) {
        throw new NotFoundException('Document not found');
      }

      if (!documentToDelete.isArchive) {
        throw new BadRequestException('This document is not archived');
      }

      await this.documentService.delete(documentId);

      return documentToDelete;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete document',
        error.message,
      );
    }
  }
}
