import { ORM } from 'lionrockjs';

export default class AliasModel extends ORM{
  static tableName = 'testmodels';
  static joinTablePrefix = 'testmodel';
}