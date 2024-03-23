import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { Document } from 'src/entities/document.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Controller('document')
@UseGuards(AuthGuard('jwt'))
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private authService: AuthService,
  ) {}

  //新規ドキュメントを作成
  @Post('/')
  async createDocument(@Body() document: Document, @Request() req: Request) {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    const documentToCreate = { ...document, userId: userId };

    return await this.documentService.createDocument(documentToCreate);
  }

  //ドキュメントを更新
  @Patch('/')
  async updateDocument(@Body() document: Document, @Request() req: Request) {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    const documentToUpdate = { ...document, userId: userId };

    return await this.documentService.updateDocument(documentToUpdate);
  }

  //userIdからドキュメントを取得
  @Get('/')
  async getDocumentsByUserId(
    @Request() req: Request,
  ): Promise<Document[] | number> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    if (!userId) {
      return 401;
    }
    return this.documentService.getDocumentsByUserId(userId);
  }

  //parentIdから子ドキュメントを取得
  @Get('getChildren/:parentDocumentId?')
  async getChildByParentId(
    @Param('parentDocumentId') parentDocumentId: number,
  ): Promise<Document[] | number> {
    return this.documentService.getDocumentsByParentId(parentDocumentId);
  }

  //ドキュメントとその子を全てアーカイブする
  @Patch('archive/:documentId')
  async moveToArchive(
    @Param('documentId') documentId: number,
    @Request() req: Request,
  ): Promise<Document[]> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);

    await this.documentService.moveToArchiveRecursive(documentId);

    return await this.documentService.getDocumentsByUserId(userId);
  }

  //ドキュメントとその子を全てリストアする
  @Patch('restore/:documentId')
  async moveToRecover(
    @Param('documentId') documentId: number,
    @Request() req: Request,
  ): Promise<Document[]> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    await this.documentService.moveToRestoreRecursive(documentId);

    return await this.documentService.getDocumentsByUserId(userId);
  }
}
