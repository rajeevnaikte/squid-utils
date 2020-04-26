import {
  createDirsOfPathIfNotExists,
  isDirectory,
  readFile,
  readJson,
  walkDirTree,
  writeFile,
  writeJson
} from '../utils/syncFileUtils';
import { InvalidJsonFormat, PathNotFound } from '../errors';

describe('syncFileUtils', () => {
  test('read', () => {
    expect(readFile(`${__dirname}/data/empty`)).toEqual('')
  });

  test('read invalid file', () => {
    expect(() => readFile(`${__dirname}/data/not-exists`))
      .toThrow(new PathNotFound(`${__dirname}/data/not-exists`));
  });

  test('readFile json', () => {
    expect(readJson(`${__dirname}/data/json`)).toEqual([{ test: 1 }])
  });

  test('readFile invalid json', () => {
    expect(() => readJson(`${__dirname}/data/invalid-json`))
      .toThrow(new InvalidJsonFormat('test'));
  });

  test('createDirsOfPathIfNotExists', () => {
    createDirsOfPathIfNotExists(`${__dirname}/data/dir1/dri1/`);
    expect(isDirectory(`${__dirname}/data/dir1/dri1/`)).toEqual(true);
  });

  test('writeFile json', () => {
    const expected = {
      test: 1,
      test2: 'test2',
      test3: {
        test4: 'test4',
        test5: [5]
      }
    };
    const filePath = `${__dirname}/data/actual/json.json`
    writeJson(filePath, expected)

    const actual = JSON.parse(readFile(filePath))
    expect(actual).toEqual(expected)
  });

  test('walkDirTree', () => {
    const dirPath = `${__dirname}/data/walk`;
    expect(walkDirTree(dirPath, { recursive: true }))
      .toEqual([
        `${dirPath}/empty`,
        `${dirPath}/subdir/empty`
      ]);
  });

  test('walkDirTree with filename filter', () => {
    const dirPath = `${__dirname}/data/walk`;
    expect(walkDirTree(dirPath, {
      fileNameMatcher: /ty$/g,
      recursive: true
    }))
      .toEqual([
        `${dirPath}/empty`,
        `${dirPath}/subdir/empty`
      ]);
  });

  test('writeFile', () => {
    const filePath = `${__dirname}/data/actual/write-test`;
    writeFile(filePath, 'write-test');
    expect(readFile(filePath)).toEqual('write-test');
  });
})
