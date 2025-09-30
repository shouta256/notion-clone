import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateDocumentDto {
  @IsInt()
  id: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  // content is JSON structure stored by the editor
  content?: any;

  @IsInt()
  @IsOptional()
  parentDocumentId?: number | null;
}
