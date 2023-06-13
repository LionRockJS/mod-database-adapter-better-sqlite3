import url from "node:url";
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

import DatabaseDriver from '../classes/databaseDriver/BetterSQLite3';

describe('database driver ', () => {
  test('create db', async () => {
    const db = await DatabaseDriver.create(`${__dirname}/db/empty.sqlite`);
    expect(db.database.open).toBe(true);
  });

  test('create table', async () => {
    const db = await DatabaseDriver.create(':memory:');
    await db.exec('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT);');
    await db.prepare('INSERT INTO test (id, name) VALUES (?, ?);').run(1, 'Foo');
    const result = await db.prepare('SELECT * FROM test WHERE id = 1;').get();
    expect(result.name).toBe('Foo');

    await db.close();
    try{
      await db.prepare('SELECT * FROM test;').get();
      expect('this should not be reached').toBe('');
    }catch(e){
      expect(e.message).toBe('The database connection is not open');
    }
  });

  test('transaction', async () => {
    const db = await DatabaseDriver.create(':memory:');
    await db.exec('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT);');
    await db.transactionStart();
    await db.prepare('INSERT INTO test (id, name) VALUES (?, ?);').run(1, 'Foo');
    await db.prepare('INSERT INTO test (id, name) VALUES (?, ?);').run(2, 'Bar');
    await db.transactionRollback();

    const result = await db.prepare('SELECT * FROM test WHERE id = 1;').get();
    expect(result).toBe(undefined);

    await db.transactionStart();
    await db.prepare('INSERT INTO test (id, name) VALUES (?, ?);').run(1, 'Foo');
    await db.prepare('INSERT INTO test (id, name) VALUES (?, ?);').run(2, 'Bar');
    await db.transactionCommit();

    const result2 = await db.prepare('SELECT * FROM test WHERE id = 1;').get();
    expect(result2.name).toBe('Foo');
  });

  test('checkpoint', async () => {
    const db = await DatabaseDriver.create(':memory:');
    await db.exec('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT);');
    const result = await db.checkpoint();
    expect(result).toBe(undefined);
  });
});
