const Generator = require('yeoman-generator');
const fs = require('fs');
const path = require('path');


module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'inputFile',
        message: 'Inserisci il percorso del file JSON da utilizzare come input:'
      },
      {
        type: 'input',
        name: 'segment',
        message: 'Inserisci il collectionUrlSegment:'
      }
    ]).then((answers) => {
      const inputFile = answers.inputFile;
      const segment = answers.segment;
      const className = path.basename(inputFile, path.extname(inputFile));
      const inputFileData = fs.readFileSync(inputFile, 'utf8');
      const inputData = JSON.parse(inputFileData);
      const outputFile1 = `src/app/model/${className}.ts`;
      const outputFile2 = `src/app/custom-pages/test/conf.ts`;

      const outputFields = Object.keys(inputData).map((key) => {
        return `  ${key}: ${typeof inputData[key]};`
      }).join('\n');

      const outputFields2 = Object.keys(inputData).filter((key) => key != "id").map((key) => {
        return `  ${key}: { \n    title: '${key}' \n   },`
      }).join('\n ');

      const outputFields3 = Object.keys(inputData).map((key) => {
        return `  { name: '${key}', type: '${typeof inputData[key]}'},`
      }).join('\n  ');

      this.fs.write(
        this.destinationPath(outputFile1),
        `
import { UserGroup } from './usergroup';

export class ${className} extends test {\n${outputFields}\n}`
      );

      this.fs.write(
        this.destinationPath(outputFile2),
        `
import merge from 'lodash/merge';
import {tableCommonSettings} from "../entity-table/entity-table.conf";

const tableSettings = {
  columns: {
 ${outputFields2}
  },
};

export const config = {
  title: '${segment}',
  collectionUrlSegment: '${segment}',
  fields: [
    { name: 'createdts', type: 'date', component: 'datepicker' },
    { name: 'modifiedts', type: 'date', component: 'datepicker' },
  ${outputFields3}
  ],
  tableSettings: merge({}, tableCommonSettings, stateMatrixTableSettings),
};`
      );
    });
  }
}
