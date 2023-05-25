export class ResultSearchEntity {
  key: string[];
  position: number | string;
  constructor(key: string[], position: number) {
    this.key = key;
    this.position =
      position === 0 ? 'Не обнаружено среди 2100 позиций' : position;
  }
}
