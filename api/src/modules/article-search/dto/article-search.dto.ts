import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ArticleSearchDto {
  @IsNotEmpty()
  @IsString()
  article: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsArray()
  keys: string[];
}
