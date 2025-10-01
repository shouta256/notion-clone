import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Document } from "src/entities/document.entity";
import { Repository } from "typeorm";
import { DocumentDataDTO } from "./documentDto/documentData.dto";

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentService: Repository<Document>,
  ) {}

  // Ownership check (prevent IDOR)
  async assertOwnership(documentId: number, userId: number): Promise<Document> {
    const document = await this.documentService.findOne({
      where: { id: documentId },
    });
    if (!document) {
      throw new NotFoundException("Document not found");
    }
    if (document.userId !== userId) {
      throw new ForbiddenException("You do not have access to this document");
    }
    return document;
  }

  // Create a new document
  async createDocument(document: Partial<Document>) {
    const createdDocument = await this.documentService.save(document as Document);
    return createdDocument;
  }

  // Update a document
  async updateDocument(updatedDocumentData: Partial<Document>): Promise<Document> {
    if ("id" in updatedDocumentData) {
      const documentToUpdate = await this.documentService.findOne({
        where: { id: updatedDocumentData.id },
      });
      if (!documentToUpdate) {
        throw new NotFoundException("Document not found");
      }

      // 更新可能なフィールドのみを反映（userId / isArchive はここでは変更不可）
      if (typeof updatedDocumentData.title !== "undefined") {
        documentToUpdate.title = updatedDocumentData.title;
      }
      if (typeof updatedDocumentData.content !== "undefined") {
        documentToUpdate.content = updatedDocumentData.content as unknown;
      }
      if (typeof updatedDocumentData.parentDocumentId !== "undefined") {
        documentToUpdate.parentDocumentId = updatedDocumentData.parentDocumentId as number;
      }

      const updatedDocument = await this.documentService.save(documentToUpdate);
      return updatedDocument;
    }
    throw new Error("id must be provided");
  }

  // Get a document by documentId
  async getDocumentByDocumentId(documentId: number): Promise<Document> {
    const document = await this.documentService.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException("Document not found");
    }

    return document;
  }

  // Find non-archived documents by userId and return as a tree
  async getDocumentsByUserId(userId: number): Promise<DocumentDataDTO[]> {
    const documents = await this.documentService.find({
      where: { userId: userId, isArchive: false },
    });

    if (!documents) {
      throw new NotFoundException("Document not found");
    }

  // Helper: build a tree from flat documents (recursive)
    const buildTree = (documents: Document[]): DocumentDataDTO[] => {
      const tree: DocumentDataDTO[] = [];
      const map: Record<number, DocumentDataDTO> = {};

      for (const doc of documents) {
        map[doc.id] = { id: doc.id, title: doc.title, children: [] };
      }

      for (const doc of documents) {
        const parent = map[doc.parentDocumentId];
        if (parent) {
          parent.children.push(map[doc.id]);
        } else {
          tree.push(map[doc.id]);
        }
      }

      return tree;
    };

    return buildTree(documents);
  }

  // Find children by parentId (scoped by user)
  async getDocumentsByParentId(parentDocumentId: number, userId: number): Promise<Document[]> {
    const documents = await this.documentService.find({
      where: { parentDocumentId: parentDocumentId, userId },
    });

    if (!documents) {
      throw new NotFoundException("Document not found");
    }

    return documents;
  }

  // Archive a document
  async moveToArchive(documentId: number): Promise<Document> {
    const document = await this.documentService.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException("Document not found");
    }

  document.isArchive = true; // Mark as archived
  const archivedDocument = await this.documentService.save(document); // Save and return

    return archivedDocument;
  }

  // Archive the document and all its children
  async moveToArchiveRecursive(documentId: number, userId: number): Promise<void> {
    await this.moveToArchive(documentId); // Archive current

    // Get children and archive recursively
    const childDocuments = await this.getDocumentsByParentId(documentId, userId);
    for (const childDocument of childDocuments) {
      await this.moveToArchiveRecursive(childDocument.id, userId);
    }
  }

  // Restore a document
  async moveToRestore(documentId: number): Promise<Document> {
    const document = await this.documentService.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException("Document not found");
    }

    document.isArchive = false;
    const archivedDocument = await this.documentService.save(document);

    return archivedDocument;
  }

  // Restore the document and all its children
  async moveToRestoreRecursive(documentId: number, userId: number): Promise<void> {
    await this.moveToRestore(documentId); // Restore current

    // Get children and restore recursively
    const childDocuments = await this.getDocumentsByParentId(documentId, userId);
    for (const childDocument of childDocuments) {
      await this.moveToRestoreRecursive(childDocument.id, userId);
    }
  }

  // Get archived documents
  async getArchive(userId: number): Promise<Document[]> {
    if (!userId) {
      throw new Error("Invalid user ID.");
    }
    try {
      return await this.documentService.find({
        where: { userId: userId, isArchive: true },
      });
    } catch (error) {
      console.error("Failed to fetch archived documents:", error);
      throw error;
    }
  }

  // Delete archived document(s)
  async deleteArchive(documentId: number): Promise<Document> {
    try {
      const docRepo = this.documentService;
      const documentToDelete = await docRepo.findOne({
        where: { id: documentId },
      });

      if (!documentToDelete) {
        throw new NotFoundException("Document not found");
      }

      if (!documentToDelete.isArchive) {
        throw new BadRequestException("This document is not archived");
      }

      // transactional recursive delete
      await docRepo.manager.transaction(async (manager) => {
        const deleteSubtree = async (id: number) => {
          const children = await manager.find(Document, {
            where: { parentDocumentId: id },
          });
          for (const child of children) {
            await deleteSubtree(child.id);
          }
          await manager.delete(Document, { id });
        };

        await deleteSubtree(documentId);
      });

      return documentToDelete;
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message)
          : undefined;
      throw new InternalServerErrorException("Failed to delete document", message);
    }
  }
}
