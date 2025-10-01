import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import type { Document } from "src/entities/document.entity";
// import { AuthGuard } from '@nestjs/passport';
import { AuthService } from "../auth/auth.service";
import JwtAuthenticationGuard from "../auth/jwtAuthentication.guard";
import { DocumentService } from "./document.service";
import { DocumentDataDTO } from "./documentDto/documentData.dto";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";

@Controller("document")
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private authService: AuthService,
  ) {}

  // Create a new document
  @UseGuards(JwtAuthenticationGuard)
  @Post("/")
  async createDocument(@Body() document: CreateDocumentDto, @Req() req: Request) {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    const documentToCreate = { ...document, userId: userId };

    return await this.documentService.createDocument(documentToCreate);
  }

  // Update a document
  @UseGuards(JwtAuthenticationGuard)
  @Patch("/")
  async updateDocument(@Body() document: UpdateDocumentDto, @Req() req: Request) {
    if (!("id" in document)) {
      throw new UnauthorizedException();
    }
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    await this.documentService.assertOwnership(document.id, userId);

    const documentToUpdate = { ...document };
    return await this.documentService.updateDocument(documentToUpdate);
  }

  // Get documents by userId as a tree
  @UseGuards(JwtAuthenticationGuard)
  @Get("/")
  async getDocumentsByUserId(@Req() req: Request): Promise<DocumentDataDTO[]> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.documentService.getDocumentsByUserId(userId);
  }

  // Get children by parentId
  @UseGuards(JwtAuthenticationGuard)
  @Get("getChildren/:parentDocumentId?")
  async getChildByParentId(
    @Param("parentDocumentId") parentDocumentId: number,
    @Req() req: Request,
  ): Promise<Document[]> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    return this.documentService.getDocumentsByParentId(parentDocumentId, userId);
  }

  // Get archived documents
  @UseGuards(JwtAuthenticationGuard)
  @Get("archive")
  async getArchive(@Req() req: Request): Promise<Document[]> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    return this.documentService.getArchive(userId);
  }

  // Archive the document and all its children
  @UseGuards(JwtAuthenticationGuard)
  @Put("archive/:documentId")
  async moveToArchive(
    @Param("documentId") documentId: number,
    @Req() req: Request,
  ): Promise<DocumentDataDTO> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    await this.documentService.assertOwnership(documentId, userId);
    await this.documentService.moveToArchiveRecursive(documentId, userId);
    return await this.documentService.getDocumentByDocumentId(documentId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete("archive/:documentId")
  async deleteArchive(@Param("documentId") documentId: number, @Req() req: Request) {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    await this.documentService.assertOwnership(documentId, userId);
    return await this.documentService.deleteArchive(documentId);
  }

  // Restore the document and all its children
  @UseGuards(JwtAuthenticationGuard)
  @Patch("restore/:documentId")
  async moveToRecover(
    @Param("documentId") documentId: number,
    @Req() req: Request,
  ): Promise<DocumentDataDTO[]> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    await this.documentService.assertOwnership(documentId, userId);
    await this.documentService.moveToRestoreRecursive(documentId, userId);
    return await this.documentService.getDocumentsByUserId(userId);
  }

  // Get a document by documentId
  @UseGuards(JwtAuthenticationGuard)
  @Get(":documentId")
  async getDocumentById(
    @Param("documentId", ParseIntPipe) documentId: number,
    @Req() req: Request,
  ): Promise<Document> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    await this.documentService.assertOwnership(documentId, userId);
    return this.documentService.getDocumentByDocumentId(documentId);
  }
}
