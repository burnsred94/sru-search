import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class SearchArticleDto {
  @IsNotEmpty()
  @IsString()
  article: string;
  @IsNotEmpty()
  @IsArray()
  pvz: { name: string; addressId: Types.ObjectId; periodId: Types.ObjectId }[];
  @IsNotEmpty()
  @IsString()
  key: string;
  @IsNotEmpty()
  @IsString()
  key_id: string;
}
