import { Module } from '@nestjs/common';
import { ArticleSearchController } from './article-search.controller';
import { ArticleSearchService } from './services/article-search.service';
import { GotModule } from '@t00nday/nestjs-got';
import { FetchGeoProvider } from './providers/fetch.geo.provider';
import { SearchProvider } from './providers/search.provider';

@Module({
  imports: [GotModule],
  providers: [FetchGeoProvider, ArticleSearchService, SearchProvider],
  controllers: [ArticleSearchController],
})
export class ArticleSearchModule {}
