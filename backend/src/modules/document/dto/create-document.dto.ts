import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsOptional()
  parentDocumentId?: number | null;
}
