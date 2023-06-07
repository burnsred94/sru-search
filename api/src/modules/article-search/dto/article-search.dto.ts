import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SearchArticleDto {
  @IsNotEmpty()
  @IsString()
  article: string;
  @IsNotEmpty()
  @IsArray()
  pvz: { name: string };
  @IsNotEmpty()
  @IsString()
  key: string;
}

