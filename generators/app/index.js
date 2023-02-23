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
      }
    ]).then((answers) => {
      const inputFile = answers.inputFile;
      const className = path.basename(inputFile, path.extname(inputFile));
      const inputFileData = fs.readFileSync(inputFile, 'utf8');
      const inputData = JSON.parse(inputFileData);
      const outputFile = `src/app/module/${className}.ts`;
      const outputFields = Object.keys(inputData).map((key) => {
        return `  ${key}: ${typeof inputData[key]};`
      }).join('\n');

      this.fs.write(
        this.destinationPath(outputFile),
        `
import { UserGroup } from './usergroup';

export class ${className} extends test {\n${outputFields}\n}`
      );
    });
  }
}
