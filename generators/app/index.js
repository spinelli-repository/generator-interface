const Generator = require('yeoman-generator');
const fs = require('fs');
const path = require('path');

let compnameCapitalized = '';
let compnameLower = '';
let titleBO = '';

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

      compnameLower  = segment.toLowerCase();
      compnameCapitalized = compnameLower.charAt(0).toUpperCase() + compnameLower.slice(1);
      titleBO = title;

      const outputFile1 = `../backoffice/src/app/model/${compnameLower}.ts`;
      const outputFile2 = `../backoffice/src/app/custom-pages/${compnameLower}-page/${compnameLower}.conf.ts`;
      const outputFile3 = `../backoffice/src/app/custom-pages/${compnameLower}-page/${compnameLower}-details/${compnameLower}-details.component.ts`;
      const outputFile4 = `../backoffice/src/app/custom-pages/${compnameLower}-page/${compnameLower}-details/${compnameLower}-details.component.html`;
      const outputFile5 = `../backoffice/src/app/custom-pages/${compnameLower}-page/${compnameLower}-details/${compnameLower}-details.component.scss`;
      const outputFile6 = `../backoffice/src/app/custom-pages/${compnameLower}-page/${compnameLower}.component.ts`;


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

export class ${compnameCapitalized} extends CommonEntity {\n${outputFields}\n}`
      );

      this.fs.write(
        this.destinationPath(outputFile2),
        `
import merge from 'lodash/merge';
import { AutocompleteEditorComponent } from '../../custom-ui/autocomplete-editor.component';
import { SelectFilterComponent } from '../../custom-ui/select-filter.component';
import {tableCommonSettings, tableDefaultButtons} from "../entity-table/entity-table.conf";

const ${compnameCapitalized}TableSettings = {
  columns: {
 ${outputFields2}
  },
};

export const config = {
  title: '${title}',
  collectionUrlSegment: '${compnameLower}',
  fields: [
    { name: 'createdts', type: 'date', component: 'datepicker' },
    { name: 'modifiedts', type: 'date', component: 'datepicker' },
  ${outputFieldsUid}
  ${outputFields3}
  ],
  tableSettings: merge({}, tableCommonSettings, ${compnameCapitalized}TableSettings),
};`
      );

      this.fs.write(
        this.destinationPath(outputFile3),
        `
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NbDialogService, NbWindowRef } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { ${compnameCapitalized} } from '../../../model/${compnameLower}';
import { BackendIntegrationService } from '../../../service/backend-integration.service';
import { EnvConfigurationService } from '../../../service/env-configuration';
import { EntityDetailsComponent } from '../../entity-table/entity-details/entity-details.component';
import * as configSettings from '../${compnameLower}.conf';

@Component({
  selector: '${compnameLower}',
  templateUrl: './${compnameLower}-details.component.html',
  styleUrls: ['./${compnameLower}-details.component.scss']
})
export class ${compnameCapitalized}DetailsComponent extends EntityDetailsComponent<${compnameCapitalized}> implements OnInit{
  @Input() entity: ${compnameCapitalized};
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
import { ${compnameCapitalized} } from '../../model/${compnameLower}';
import { BackendIntegrationService } from '../../service/backend-integration.service';
import { EntityTableComponent } from '../entity-table/entity-table/entity-table.component';
import { ${compnameCapitalized}DetailsComponent } from './${compnameLower}-details/${compnameLower}-details.component';
import * as configSettings from './${compnameLower}.conf';

@Component({
  selector: '${compnameLower}',
  templateUrl: '../entity-table/entity-table/entity-table.component.html',
  providers: [BackendIntegrationService],
})
export class ${compnameCapitalized}Component extends EntityTableComponent<${compnameCapitalized}> implements OnInit {
  @Input() isDialog;
  @Output() selectEntityFromDialog: EventEmitter<${compnameCapitalized}> = new EventEmitter();
  entityConfiguration = configSettings.config;

  constructor(public backendIntegrationService: BackendIntegrationService, dialogService: NbDialogService) {
    super(backendIntegrationService, dialogService);
  }

  onOpenDetail(event): void {
    if(this.entityConfiguration['entityDetails'] !== 'false') {
      const data: ${compnameCapitalized} = event.data;
      if (this.isDialog) {
        this.selectEntityFromDialog.emit(data);
      } else {
        this.backendIntegrationService.onRowSelect<${compnameCapitalized}>(data, ${compnameCapitalized}DetailsComponent);
      }
    }
  }


}`

      );
    });
  }

  writingcomp() {
    const comment = "//YEOMAN\n";
    const commentImp = "//IMPYEOMAN";
    const regex = /\/\/YEOMAN/;
    const regexImp = /\/\/IMPYEOMAN/;
    const moduleName = 'app.module';
    const moduleFileName = moduleName.replace(/-/g, '_');
    const componentFileName = compnameCapitalized.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const componentImport = `import { ${compnameCapitalized}Component } from './custom-pages/${compnameLower}-page/${componentFileName}.component';\n`;
    const componentImportRouting = `import { ${compnameCapitalized}Component } from './custom-pages/${compnameLower}-page/${componentFileName}.component';`;
    const componentDeclaration = `    ${compnameCapitalized}Component,\n`;
    const componentImportDetail = `import { ${compnameCapitalized}DetailsComponent } from './custom-pages/${compnameLower}-page/${compnameLower}-details/${componentFileName}-details.component';\n`;
    const componentDeclarationDetail= `    ${compnameCapitalized}DetailsComponent,\n`;
    const menu = comment + ` 
  {
    title: '${titleBO}',
    data: {
      permission: 'view',
      resource: '${compnameLower}',
    },
  },`;

    const routing = comment + `
      {
        path: '${compnameLower}',
        component: ${compnameCapitalized}Component,
      },`;
    
    const routingImp = commentImp + `
${componentImportRouting}`;

    const moduleFile = this.fs.read(this.destinationPath(`../backoffice/src/app/${moduleFileName.toLowerCase()}.ts`));
    let newModuleFile = moduleFile.replace(/(import.*;)\n/, `$1\n${componentImport}`);
    newModuleFile = newModuleFile.replace(/(declarations:\s*\[[\s\S]*?)(\s*])/m, `$1\n${componentDeclaration}  ]`);
    newModuleFile = newModuleFile.replace(/(import.*;)\n/, `$1\n${componentImportDetail}`);
    newModuleFile = newModuleFile.replace(/(declarations:\s*\[[\s\S]*?)(\s*])/m, `$1\n${componentDeclarationDetail}  ]`);

    const routingFile = this.fs.read(this.destinationPath(`../backoffice/src/app/app-routing.module.ts`));
    let newRoutingFile = routingFile.replace(regexImp, routingImp);
    newRoutingFile = newRoutingFile.replace(regex, routing);

    const menuFile = this.fs.read(this.destinationPath(`../backoffice/src/app/pages/bo-home-menu.ts`));
    let newMenuFile = menuFile.replace(regex, menu);
    
    this.fs.write(this.destinationPath(`../backoffice/src/app/${moduleFileName.toLowerCase()}.ts`), newModuleFile);
    this.fs.write(this.destinationPath(`../backoffice/src/app/app-routing.module.ts`), newRoutingFile);
    this.fs.write(this.destinationPath(`../backoffice/src/app/pages/bo-home-menu.ts`), newMenuFile);


  }
  
}
