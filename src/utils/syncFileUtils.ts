import * as fs from 'fs';
import { JsonType } from '../types';
import { InvalidDirPath, InvalidFilePath, InvalidJsonFormat, PathNotFound } from '../errors';

/**
 * Check if file or directory pathExists.
 * @param filePath
 */
export const pathExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

/**
 * Throw error if path doesn't exists.
 * @param filePath
 */
export const requiresPathToExist = (filePath: string): void => {
  if (!pathExists(filePath)) {
    throw new PathNotFound(filePath);
  }
};

/**
 * Check if path is a directory.
 * @param filePath
 */
export const isDirectory = (filePath: string): boolean => {
  requiresPathToExist(filePath);
  return fs.statSync(filePath).isDirectory();
};

/**
 * Throw error if path is not a directory.
 * @param filePath
 */
export const requiresPathBeADir = (filePath: string): void => {
  if (!isDirectory(filePath)) {
    throw new InvalidDirPath(filePath);
  }
};

/**
 * Check if path is a file.
 * @param filePath
 */
export const isFile = (filePath: string): boolean => {
  requiresPathToExist(filePath);
  return fs.statSync(filePath).isFile();
};

/**
 * Throw error if path is not a file.
 * @param filePath
 */
export const requiresPathToBeAFile = (filePath: string): void => {
  if (!isFile(filePath)) {
    throw new InvalidFilePath(filePath);
  }
};

/**
 * Read file as string.
 * @param filePath
 * @param encoding
 */
export const readFile = (filePath: string, encoding = 'utf-8'): string => {
  requiresPathToBeAFile(filePath);
  return fs.readFileSync(filePath, encoding);
};

/**
 * Read file and parse as JSON.
 * @param filePath
 */
export const readJson = (filePath: string): JsonType => {
  requiresPathToBeAFile(filePath);
  const fileContent = readFile(filePath);
  try {
    return JSON.parse(fileContent);
  } catch (e) {
    throw new InvalidJsonFormat(fileContent);
  }
};

/**
 * Create parent directories if not pathExists.
 * @param filePath
 */
export const createDirsOfPathIfNotExists = (filePath: string): void => {
  const parentFilePath = filePath.substr(0, filePath.lastIndexOf('/'));
  if (!pathExists(parentFilePath)) {
    fs.mkdirSync(parentFilePath, { recursive: true });
  }
};

/**
 * Write to file by creating the parent directories if not pathExists.
 * @param filePath
 * @param data
 */
export const writeFile = (filePath: string, data: any): void => {
  createDirsOfPathIfNotExists(filePath);
  fs.writeFileSync(filePath, data);
  console.log(`Saved data into file ${filePath}.`);
};

/**
 * Write JSON into file with pretty formatting with 2 space indent.
 * @param filePath
 * @param json
 */
export const writeJson = (filePath: string, json: JsonType): void => {
  writeFile(filePath, JSON.stringify(json, null, 2));
};

/**
 * Delete given file path.
 * @param filePath
 */
export const deletePath = (filePath: string): void => {
  fs.unlinkSync(filePath);
};

/**
 * Private method which does {walkDirTree}.
 * This is to avoid duplicate {requiresPathBeADir} check in recursive calls.
 * @param rootDir
 * @param opts
 */
const walkPath = (rootDir: string,
                  opts?: {
                    fileNameMatcher?: RegExp | ((filePath: string) => boolean);
                    recursive?: boolean;
                  }): string[] => {
  let filePaths = fs.readdirSync(rootDir)
    .map(fileName => `${rootDir}/${fileName}`);

  if (opts?.recursive) {
    filePaths = filePaths.flatMap(filePath => {
      if (fs.statSync(filePath).isDirectory()) {
        return walkPath(filePath, opts);
      }
      return filePath;
    });
  }

  if (opts?.fileNameMatcher) {
    filePaths = filePaths.filter(filePath => {
      if (opts.fileNameMatcher instanceof RegExp) {
        return filePath.match(opts.fileNameMatcher) !== null;
      }
      else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        return opts.fileNameMatcher(filePath);
      }
    });
  }

  return filePaths;
};

/**
 * Traverse all subdirectories to get all files and filter based on file name matcher logic.
 * @param rootDir
 * @param opts -
 * - fileNameMatcher - If it's a string, then filePath will be checked if included this string.
 *   If it's a function, filePath (includes parent directories) will be passed and it must return true to consider this file.
 * - recursive whether to recursively check in sub directories.
 */
export const walkDirTree = (rootDir: string,
                            opts?: {
                              fileNameMatcher?: RegExp | ((filePath: string) => boolean);
                              recursive?: boolean;
                            }): string[] => {
  requiresPathBeADir(rootDir);
  return walkPath(rootDir, opts);
};
