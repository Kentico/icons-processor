import {readFile, writeFile, PathLike} from 'fs';

const zipDir = require('zip-dir');

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

export function readFilePromise(fileName: PathLike, options: { encoding?: string; flag?: string; } = {encoding: 'utf8'}): Promise<any> {
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

export function zipDirectoryPromise(inputFolderPath: PathLike, zipFilePath: PathLike): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        zipDir(inputFolderPath, {saveTo: zipFilePath}, (err, buffer: Buffer) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(buffer);
            }
        });
    });
}
