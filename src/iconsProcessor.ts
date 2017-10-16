import * as path from 'path';
import * as fs from 'fs';
import * as archiver from 'archiver';
import {
  IconItem,
  SelectionJson,
} from './types/selectionJsonType';

const inputFolderPath = path.join(__dirname, '..', 'input');
const outputFolderPath = path.join(__dirname, '..', 'output');
const iconPrefix = 'icon-';

async function loadSelectionJson(): Promise<SelectionJson> {
  const pathToSelectionJson = path.join(inputFolderPath, 'selection.json');
  const selectionJson = await readFilePromise(pathToSelectionJson);
  return JSON.parse(selectionJson);
}

function compareIconNames(iconA: IconItem, iconB: IconItem): -1 | 0 | 1 {
  const nameA = iconA.properties.name;
  const nameB = iconB.properties.name;

  if (nameA > nameB) {
    return 1;
  }
  else if (nameA < nameB) {
    return -1;
  }
  else {
    return 0;
  }
}

function readFilePromise(fileName: fs.PathLike, options: { encoding?: string; flag?: string; } = { encoding: 'utf8' }): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, options, (err: NodeJS.ErrnoException, data: any) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  });
}

export async function processIcons(): Promise<void> {
  const selectionJson = await loadSelectionJson();

  const iconVariables = selectionJson.icons.sort(compareIconNames).reduce((reduced, iconItem) => {
    const iconVariable = `@${iconPrefix}${iconItem.properties.name}: "\\${iconItem.properties.code.toString(16)}";\n`;
    return reduced.concat(iconVariable);
  }, '');

  // const iconClasses = selectionJson.icons.reduce((reduced, iconItem) => {
  //   const iconClass = `.${iconPrefix}${iconItem.properties.name}:before { content: @${iconPrefix}${iconItem.properties.name}; }\n`;
  //   return reduced.concat(iconClass);
  // }, `\n\n`);

  const outputWriteStream = fs.createWriteStream(path.join(outputFolderPath, 'icons.zip'));
  const archive = archiver('zip');
  archive.pipe(outputWriteStream);
  archive.append(iconVariables, { name: 'icon-variables.less' });
  archive.file(path.join(inputFolderPath, 'Core-icons.eot'), { name: 'Core-icons.eot' });
  archive.file(path.join(inputFolderPath, 'Core-icons.svg'), { name: 'Core-icons.svg' });
  archive.file(path.join(inputFolderPath, 'Core-icons.ttf'), { name: 'Core-icons.ttf' });
  archive.file(path.join(inputFolderPath, 'Core-icons.woff'), { name: 'Core-icons.woff' });
  archive.finalize();
}
