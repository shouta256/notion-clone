import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
  Patch,
  Delete,
  Put,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { Document } from 'src/entities/document.entity';
// import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { DocumentDataDTO } from './documentDto/documentData.dto';
import JwtAuthenticationGuard from '../auth/jwtAuthentication.guard';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Request } from 'express';

@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private authService: AuthService,
  ) {}

  //新規ドキュメントを作成
  @UseGuards(JwtAuthenticationGuard)
  @Post('/')
  async createDocument(
    @Body() document: CreateDocumentDto,
    @Req() req: Request,
  ) {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    const documentToCreate = { ...document, userId: userId };

    return await this.documentService.createDocument(documentToCreate);
  }

  //ドキュメントを更新
  @UseGuards(JwtAuthenticationGuard)
  @Patch('/')
  async updateDocument(
    @Body() document: UpdateDocumentDto,
    @Req() req: Request,
  ) {
    if (!('id' in document)) {
      throw new UnauthorizedException();
    }
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    await this.documentService.assertOwnership(document.id, userId);

    const documentToUpdate = { ...document };
    return await this.documentService.updateDocument(documentToUpdate);
  }

  //userIdからドキュメントを階層構造で取得
  @UseGuards(JwtAuthenticationGuard)
  @Get('/')
  async getDocumentsByUserId(@Req() req: Request): Promise<DocumentDataDTO[]> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.documentService.getDocumentsByUserId(userId);
  }

  //parentIdから子ドキュメントを取得
  @UseGuards(JwtAuthenticationGuard)
  @Get('getChildren/:parentDocumentId?')
  async getChildByParentId(
    @Param('parentDocumentId') parentDocumentId: number,
    @Req() req: Request,
  ): Promise<Document[]> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    return this.documentService.getDocumentsByParentId(
      parentDocumentId,
      userId,
    );
  }

  //アーカイブのドキュメントを取得
  @UseGuards(JwtAuthenticationGuard)
  @Get('archive')
  async getArchive(@Req() req: Request): Promise<Document[]> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    return this.documentService.getArchive(userId);
  }

  //ドキュメントとその子を全てアーカイブする
  @UseGuards(JwtAuthenticationGuard)
  @Put('archive/:documentId')
  async moveToArchive(
    @Param('documentId') documentId: number,
    @Req() req: Request,
  ): Promise<DocumentDataDTO> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    await this.documentService.assertOwnership(documentId, userId);
    await this.documentService.moveToArchiveRecursive(documentId, userId);
    return await this.documentService.getDocumentByDocumentId(documentId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete('archive/:documentId')
  async deleteArchive(
    @Param('documentId') documentId: number,
    @Req() req: Request,
  ) {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    await this.documentService.assertOwnership(documentId, userId);
    return await this.documentService.deleteArchive(documentId);
  }

  //ドキュメントとその子を全てリストアする
  @UseGuards(JwtAuthenticationGuard)
  @Patch('restore/:documentId')
  async moveToRecover(
    @Param('documentId') documentId: number,
    @Req() req: Request,
  ): Promise<DocumentDataDTO[]> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    await this.documentService.assertOwnership(documentId, userId);
    await this.documentService.moveToRestoreRecursive(documentId, userId);
    return await this.documentService.getDocumentsByUserId(userId);
  }

  //ドキュメントIdからドキュメントを取得
  @UseGuards(JwtAuthenticationGuard)
  @Get(':documentId')
  async getDocumentById(
    @Param('documentId', ParseIntPipe) documentId: number,
    @Req() req: Request,
  ): Promise<Document> {
    const userId = await this.authService.getUserIdFromAuthHeader(req);
    await this.documentService.assertOwnership(documentId, userId);
    return this.documentService.getDocumentByDocumentId(documentId);
  }
}
