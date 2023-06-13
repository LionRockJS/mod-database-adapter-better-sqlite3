import {DatabaseDriver} from 'lionrockjs';
import path from 'node:path';
import Database from 'better-sqlite3';

export default class DatabaseBetterSqlite3 extends DatabaseDriver {
  constructor(datasource) {
    super(datasource);
    this.datasource = path.normalize(datasource);
    this.database = new Database(datasource);
  }

  prepare(sql) {
    return this.database.prepare(sql);
  }

  async exec(sql) {
    this.database.exec(sql);
  }

  // eslint-disable-next-line class-methods-use-this
  async close() {
    this.database.close();
  }

  async transactionStart(){
    this.database.exec('BEGIN');
  }

  async transactionRollback(){
    this.database.exec('ROLLBACK');
  }

  async transactionCommit(){
    this.database.exec('COMMIT');
  }

  async checkpoint(){
    this.database.exec('PRAGMA wal_checkpoint(RESTART);');
  }

  static create(datasource) {
    return new this(datasource);
  }
}