import {
  readFile,
  writeFile,
  PathLike,
} from 'fs';

const fsExtra = require('fs.extra');

export function createFilePromise(fileName: PathLike, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile(fileName, data, (err: NodeJS.ErrnoException) => {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}

export function readFilePromise(fileName: PathLike, options: { encoding?: string; flag?: string; } = { encoding: 'utf8' }): Promise<any> {
  return new Promise((resolve, reject) => {
    readFile(fileName, options, (err: NodeJS.ErrnoException, data: any) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  });
}

export function moveFilePromise(sourceFileName: PathLike, destinationFileName: PathLike): Promise<void> {
  return new Promise((resolve, reject) => {
    fsExtra.move(sourceFileName, destinationFileName, (err) => {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}
