import { IsNotEmpty, IsObject } from 'class-validator';

export class DataDtoSearchArticle {
  @IsNotEmpty()
  @IsObject()
  data: ArticleSearchDto;
}

export interface ArticleSearchDto {
  article: string;
  address: string;
  keys: string[];
}
