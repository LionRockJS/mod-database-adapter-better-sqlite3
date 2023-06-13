import { ORM } from 'lionrockjs';

export default class Tag extends ORM{
  name;

  static joinTablePrefix = 'tag';
  static tableName = 'tags';

  static fields = new Map([
    ['name', 'String']
  ]);
}