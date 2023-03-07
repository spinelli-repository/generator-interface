const Generator = require('yeoman-generator');
const fs = require('fs');
const path = require('path');

let compname = '';
let compnamelow = '';

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
      const inputFileData = fs.readFileSync(inputFile, 'utf8');
      const inputData = JSON.parse(inputFileData);

      const segmentLow = segment.toLowerCase();
      const segmentUp = segmentLow.charAt(0).toUpperCase() + segmentLow.slice(1);
      compname = segmentUp;
      compnamelow = segmentLow;

      const outputFile1 = `../backoffice/src/app/model/${segmentLow}.ts`;
      const outputFile2 = `../backoffice/src/app/custom-pages/${segmentLow}-page/${segmentLow}.conf.ts`;
      const outputFile3 = `../backoffice/src/app/custom-pages/${segmentLow}-page/${segmentLow}-details/${segmentLow}-details.component.ts`;
      const outputFile4 = `../backoffice/src/app/custom-pages/${segmentLow}-page/${segmentLow}-details/${segmentLow}-details.component.html`;
      const outputFile5 = `../backoffice/src/app/custom-pages/${segmentLow}-page/${segmentLow}-details/${segmentLow}-details.component.scss`;
      const outputFile6 = `../backoffice/src/app/custom-pages/${segmentLow}-page/${segmentLow}.component.ts`;


      const outputFields = Object.keys(inputData).map((key) => {
        return `  ${key}: ${typeof inputData[key]};`
      }).join('\n');

      const outputFields2 = Object.keys(inputData).map((key) => {
        return `  ${key}: { \n    title: '${key}', \n   },`
      }).join('\n ');

      const outputFieldsUid = Object.keys(inputData).filter((key) => key == 'uid').map((key) => {
        return `  { name: '${key}', type: '${typeof inputData[key]}', primarykey: true},`
      }).join('\n ');

      const outputFields3 = Object.keys(inputData).filter((key) => key != 'uid').map((key) => {
        return `  { name: '${key}', type: '${typeof inputData[key]}'},`
      }).join('\n  ');

      this.fs.write(
        this.destinationPath(outputFile1),
        `
import { CommonEntity } from "./common-entity";

export class ${segmentUp} extends CommonEntity {\n${outputFields}\n}`
      );

      this.fs.write(
        this.destinationPath(outputFile2),
        `
import merge from 'lodash/merge';
import { AutocompleteEditorComponent } from '../../custom-ui/autocomplete-editor.component';
import { SelectFilterComponent } from '../../custom-ui/select-filter.component';
import {tableCommonSettings, tableDefaultButtons} from "../entity-table/entity-table.conf";

const ${segmentUp}TableSettings = {
  columns: {
 ${outputFields2}
  },
};

export const config = {
  title: '${title}',
  collectionUrlSegment: '${segmentLow}',
  fields: [
    { name: 'createdts', type: 'date', component: 'datepicker' },
    { name: 'modifiedts', type: 'date', component: 'datepicker' },
  ${outputFieldsUid}
  ${outputFields3}
  ],
  tableSettings: merge({}, tableCommonSettings, ${segmentUp}TableSettings),
};`
      );

      this.fs.write(
        this.destinationPath(outputFile3),
        `
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NbDialogService, NbWindowRef } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { ${segmentUp} } from '../../../model/${segmentLow}';
import { BackendIntegrationService } from '../../../service/backend-integration.service';
import { EnvConfigurationService } from '../../../service/env-configuration';
import { EntityDetailsComponent } from '../../entity-table/entity-details/entity-details.component';
import * as configSettings from '../${segmentLow}.conf';

@Component({
  selector: '${segmentLow}',
  templateUrl: './${segmentLow}-details.component.html',
  styleUrls: ['./${segmentLow}-details.component.scss']
})
export class ${segmentUp}DetailsComponent extends EntityDetailsComponent<${segmentUp}> implements OnInit{
  @Input() entity: ${segmentUp};
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
      
      this.fs.write(
        this.destinationPath(outputFile6),
        `
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { ${segmentUp} } from '../../model/${segmentLow}';
import { BackendIntegrationService } from '../../service/backend-integration.service';
import { EntityTableComponent } from '../entity-table/entity-table/entity-table.component';
import { ${segmentUp}DetailsComponent } from './${segmentLow}-details/${segmentLow}-details.component';
import * as configSettings from './${segmentLow}.conf';

@Component({
  selector: '${segmentLow}',
  templateUrl: '../entity-table/entity-table/entity-table.component.html',
  providers: [BackendIntegrationService],
})
export class ${segmentUp}Component extends EntityTableComponent<${segmentUp}> implements OnInit {
  @Input() isDialog;
  @Output() selectEntityFromDialog: EventEmitter<${segmentUp}> = new EventEmitter();
  entityConfiguration = configSettings.config;

  constructor(public backendIntegrationService: BackendIntegrationService, dialogService: NbDialogService) {
    super(backendIntegrationService, dialogService);
  }

  onOpenDetail(event): void {
    if(this.entityConfiguration['entityDetails'] !== 'false') {
      const data: ${segmentUp} = event.data;
      if (this.isDialog) {
        this.selectEntityFromDialog.emit(data);
      } else {
        this.backendIntegrationService.onRowSelect<${segmentUp}>(data, ${segmentUp}DetailsComponent);
      }
    }
  }


}`

      );
    });
  }

  writingcomp() {
    const moduleName = 'app.module';
    const moduleFileName = moduleName.replace(/-/g, '_');
    const componentClassName = compname;
    const componentFileName = componentClassName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const componentImport = `import { ${componentClassName}Component } from './custom-pages/${compnamelow}-page/${componentFileName}.component';\n`;
    const componentDeclaration = `    ${componentClassName}Component,\n`;
    const componentImportDetail = `import { ${componentClassName}DetailsComponent } from './custom-pages/${compnamelow}-page/${compnamelow}-details/${componentFileName}-details.component';\n`;
    const componentDeclarationDetail= `    ${componentClassName}DetailsComponent,\n`;
    
    const moduleFile = this.fs.read(this.destinationPath(`../backoffice/src/app/${moduleFileName.toLowerCase()}.ts`));
    let newModuleFile = moduleFile.replace(/(import.*;)\n/, `$1\n${componentImport}`);
    newModuleFile = newModuleFile.replace(/(declarations:\s*\[[\s\S]*?)(\s*])/m, `$1\n${componentDeclaration}  ]`);

    newModuleFile = newModuleFile.replace(/(import.*;)\n/, `$1\n${componentImportDetail}`);
    newModuleFile = newModuleFile.replace(/(declarations:\s*\[[\s\S]*?)(\s*])/m, `$1\n${componentDeclarationDetail}  ]`);

    this.fs.write(this.destinationPath(`../backoffice/src/app/${moduleFileName.toLowerCase()}.ts`), newModuleFile);
  }
  
}
