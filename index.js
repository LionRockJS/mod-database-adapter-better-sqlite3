import url from "node:url";
const dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');
export default {dirname}

import DatabaseDriverBetterSQLite3 from './classes/databaseDriver/BetterSQLite3';
import ORMAdapterSQLite from './classes/ORMAdapter/SQLite';

export {
  DatabaseDriverBetterSQLite3,
  ORMAdapterSQLite,
}