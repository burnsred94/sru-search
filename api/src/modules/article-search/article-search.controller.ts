import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { ArticleSearchService } from './services/article-search.service';
import { Response } from 'express';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ArticleSearchDto } from './dto/article-search.dto';

@Controller('search/v1')
export class ArticleSearchController {
  protected readonly logger = new Logger(ArticleSearchController.name);

  constructor(private readonly articleSearchService: ArticleSearchService) {}

  @ApiCreatedResponse({ description: 'Article Search' })
  @Post('article')
  async search(@Body() data: ArticleSearchDto, @Res() response: Response) {
    try {
      const dataSearch = await this.articleSearchService.search(data);
      return response.status(HttpStatus.OK).send({
        status: HttpStatus.OK,
        data: dataSearch,
        errors: [],
      });
    } catch (error) {
      this.logger.error(error);
      return response.status(HttpStatus.OK).send({
        status: error.status,
        error: [
          {
            message: error.message,
          },
        ],
        data: [],
      });
    }
  }
}
