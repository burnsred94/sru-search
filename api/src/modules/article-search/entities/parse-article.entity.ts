export class EntityParseArticle {
  url: string[];
  article: string;
  keys: string[];

  constructor(data) {
    this.url = data.url;
    this.article = data.article;
    this.keys = data.keys;
  }
}
