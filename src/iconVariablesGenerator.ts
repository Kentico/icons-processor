import * as path from 'path';
import {
  readFilePromise,
  zipDirectoryPromise,
} from './shared/fileSystem';
import {
  IconItem,
  SelectionJson,
} from './types/selectionJsonType';

const AppendStream = require('append-stream');
const inputFolderPath = path.join(__dirname, '..', 'input');
const outputFolderPath = path.join(__dirname, '..', 'output');
const assetsFolderPath = path.join(__dirname, '..', 'assets');
const iconPrefix = 'icon-';

async function loadSelectionJson(): Promise<SelectionJson> {
  const pathToSelectionJson = path.join(inputFolderPath, 'selection.json');
  const selectionJson = await readFilePromise(pathToSelectionJson);
  return JSON.parse(selectionJson);
}

async function loadIconsCoreCssClassModifierContent(): Promise<string> {
  const filePath = path.join(assetsFolderPath, 'icons-core-iconCssClassModifier.less');
  return await readFilePromise(filePath);
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

export async function generateIconVariablesFile(): Promise<void> {
  const selectionJson = await loadSelectionJson();
  // const iconsCoreCssClassModifier = await loadIconsCoreCssClassModifierContent();

  const iconVariables = selectionJson.icons.sort(compareIconNames).reduce((reduced, iconItem) => {
    const iconVariable = `@${iconPrefix}${iconItem.properties.name}: "\\${iconItem.properties.code.toString(16)}";\n`;
    return reduced.concat(iconVariable);
  }, '');

  // const iconClasses = selectionJson.icons.reduce((reduced, iconItem) => {
  //   const iconClass = `.${iconPrefix}${iconItem.properties.name}:before { content: @${iconPrefix}${iconItem.properties.name}; }\n`;
  //   return reduced.concat(iconClass);
  // }, `\n\n`);


  const iconVariablesLessFilePathName = path.join(outputFolderPath, 'icon-variables.less');
  composeFile(iconVariablesLessFilePathName, [iconVariables]);
}

function composeFile(filePathName: string, contentParts: Array<any>): void {
  const stream = new AppendStream(filePathName);
  try {
    contentParts.forEach(contentPart => stream.write(contentPart));
  }
  catch (e) {
    throw e;
  }
  finally {
    stream.end();
  }
}

async function zipFolder(): Promise<void> {
  const zipFilePath = path.join(outputFolderPath, 'export.zip');
  await zipDirectoryPromise(inputFolderPath, zipFilePath);
}
