import { Module } from '@nestjs/common';
import { ArticleSearchModule } from './modules/article-search/article-search.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ArticleSearchModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
