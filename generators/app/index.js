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
      },      {
        type: 'input',
        name: 'title',
        message: 'Inserisci il titolo'
      },
      {
        type: 'input',
        name: 'segment',
        message: 'Inserisci il collectionUrlSegment:'
      }
    ]).then((answers) => {
      const inputFile = answers.inputFile;
      const segment = answers.segment;
      const title = answers.title;
      const className = path.basename(inputFile, path.extname(inputFile));
      const inputFileData = fs.readFileSync(inputFile, 'utf8');
      const inputData = JSON.parse(inputFileData);

      const outputFile1 = `../backoffice/src/app/module/${className}.ts`;
      const outputFile2 = `../backoffice/src/app/custom-pages/${className}-page/${className}.conf.ts`;
      const outputFile3 = `../backoffice/src/app/custom-pages/${className}-page/${className}-details/${className}-details.component.ts`;
      const outputFile4 = `../backoffice/src/app/custom-pages/${className}-page/${className}-details/${className}-details.component.html`;
      const outputFile5 = `../backoffice/src/app/custom-pages/${className}-page/${className}-details/${className}-details.component.scss`;

      const outputFields = Object.keys(inputData).map((key) => {
        return `  ${key}: ${typeof inputData[key]};`
      }).join('\n');

      const outputFields2 = Object.keys(inputData).map((key) => {
        return `  ${key}: { \n    title: '${key}' \n   },`
      }).join('\n ');

      const outputFields3 = Object.keys(inputData).map((key) => {
        return `  { name: '${key}', type: '${typeof inputData[key]}'},`
      }).join('\n  ');

      this.fs.write(
        this.destinationPath(outputFile1),
        `
import { CommonEntity } from "./common-entity";

export class ${className} extends CommonEntity {\n${outputFields}\n}`
      );

      this.fs.write(
        this.destinationPath(outputFile2),
        `
import merge from 'lodash/merge';
import { AutocompleteEditorComponent } from '../../custom-ui/autocomplete-editor.component';
import { SelectFilterComponent } from '../../custom-ui/select-filter.component';
import {tableCommonSettings, tableDefaultButtons} from "../entity-table/entity-table.conf";

const tableSettings = {
  columns: {
 ${outputFields2}
  },
};

export const config = {
  title: '${title}',
  collectionUrlSegment: '${segment}',
  fields: [
    { name: 'createdts', type: 'date', component: 'datepicker' },
    { name: 'modifiedts', type: 'date', component: 'datepicker' },
  ${outputFields3}
  ],
  tableSettings: merge({}, tableCommonSettings, stateMatrixTableSettings),
};`
      );

      this.fs.write(
        this.destinationPath(outputFile3),
        `
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NbDialogService, NbWindowRef } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { ${className} } from '../../../model/${className}';
import { BackendIntegrationService } from '../../../service/backend-integration.service';
import { EnvConfigurationService } from '../../../service/env-configuration';
import { EntityDetailsComponent } from '../../entity-table/entity-details/entity-details.component';
import * as configSettings from '../${className}.conf';

@Component({
  selector: 'funneloperations',
  templateUrl: './${className}-details.component.html',
  styleUrls: ['./${className}-details.component.scss']
})
export class ${className}DetailsComponent extends EntityDetailsComponent<${className}> implements OnInit{
  @Input() entity: ${className};
  @Input() dataSource: LocalDataSource;
  entityConfiguration = configSettings.config;

  constructor(
    protected fb: FormBuilder,
    protected backendIntegrationService: BackendIntegrationService,
    protected windowRef: NbWindowRef,
    public envConfigurationService:EnvConfigurationService,
    protected dialogService: NbDialogService,
  ) {
    super(fb, backendIntegrationService, windowRef,envConfigurationService, dialogService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onClose() {
    this.windowRef.close();
  }
}`

      );

      this.fs.write(
        this.destinationPath(outputFile4),
        `
<entity-details [entityConfiguration]="entityConfiguration" [entity]="entity" [dataSource]="dataSource"></entity-details>`

      );

      this.fs.write(
        this.destinationPath(outputFile5),
        ``

      );
    });
  }
}
