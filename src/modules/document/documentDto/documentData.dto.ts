export class DocumentDataDTO {
  id: number;
  title: string;
  children?: DocumentDataDTO[];
}
