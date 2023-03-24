const Generator = require('yeoman-generator');
const fs = require('fs');
const path = require('path');
const { generateRandomLong } = require('../../function-yeo/random');
const { switchField } = require('../../function-yeo/fields');
const { determinedTypeToJavaType } = require('../../function-yeo/fields');
const { determinedTypeToTypescriptType } = require('../../function-yeo/fields');
const { determinedTypeToTypescriptTypeConf } = require('../../function-yeo/fields');

const inputData = null;
let compnameCapitalized = '';
let compnameLower = '';
let title = '';
let repoId = '';
let columnId = '';
let generatedValue = '';
var isUid = false;

//REGEX
const comment = "//CODE_YEOMAN\n";
const commentImp = "//IMP_YEOMAN\n";
const commentInject = "//INJECT_YEOMAN\n";
const regex = /\/\/CODE_YEOMAN/;
const regexImp = /\/\/IMP_YEOMAN/;
const regexInject = /\/\/INJECT_YEOMAN/;
const moduleName = 'app.module';
const moduleFileName = moduleName.replace(/-/g, '_');

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
        message: 'Inserisci il nome della tabella:'
      }
    ]).then((answers) => {
      const inputFile = answers.inputFile;
      const segment = answers.segment;
      const inputFileData = fs.readFileSync(inputFile, 'utf8');
      inputData = JSON.parse(inputFileData);
      title = answers.title;
      compnameLower  = segment.toLowerCase();
      compnameCapitalized = compnameLower.charAt(0).toUpperCase() + compnameLower.slice(1);
    });
  }

  writingFE() {

      const outputFile1 = `../backoffice/src/app/model/${compnameLower}.ts`;
      const outputFile2 = `../backoffice/src/app/custom-pages/${compnameLower}-page/${compnameLower}.conf.ts`;
      const outputFile3 = `../backoffice/src/app/custom-pages/${compnameLower}-page/${compnameLower}-details/${compnameLower}-details.component.ts`;
      const outputFile4 = `../backoffice/src/app/custom-pages/${compnameLower}-page/${compnameLower}-details/${compnameLower}-details.component.html`;
      const outputFile5 = `../backoffice/src/app/custom-pages/${compnameLower}-page/${compnameLower}-details/${compnameLower}-details.component.scss`;
      const outputFile6 = `../backoffice/src/app/custom-pages/${compnameLower}-page/${compnameLower}.component.ts`;

      const outputFields = Object.keys(inputData).filter((key) => key != 'createdts').filter((key) => key != 'modifiedts').map((key) => {
        return `  ${key}: ${determinedTypeToTypescriptType[switchField(inputData[key])]};`
      }).join('\n');

      const outputFields2 = Object.keys(inputData).filter((key) => key != 'createdts').filter((key) => key != 'modifiedts').map((key) => {
        var temp = determinedTypeToTypescriptTypeConf[switchField(inputData[key])];
        if(temp == 'boolean'){
          return `  ${key}: {
      title: '${key}',          
      filter: {
        type: 'custom',
        component: SelectFilterComponent,
        data:'boolean',
      },
      editor: {
        type: 'custom',
        component: CheckboxEditorComponent,
        data:'boolean',
      },    
    },`;
        }
        if(temp == 'date'){
          return `  ${key}: {
      title: '${key}', 
      class: 'date-column',
      valuePrepareFunction: formatDateString,
      filter: {
          type: 'custom',
          component: DateRangePickerFilterComponent,
      },
    },`;
        }
        if(key == 'uid'){
           isUid = true;
           generatedValue = '@Id \n @GeneratedValue(strategy = GenerationType.IDENTITY)';
           return `  ${key}: { \n    title: '${key}', \n    editable: false, \n   },`;
        }
        if(!isUid && key == 'code'){
          generatedValue = '@Id';
           return `  ${key}: { \n    title: '${key}', \n    editable: false, \n   },`;
        }
        return `  ${key}: { \n    title: '${key}', \n   },`
      }).join('\n ');

      const outputFields3 = Object.keys(inputData.map((key) => {
        var temp = determinedTypeToTypescriptTypeConf[switchField(inputData[key])]
        if(temp == 'boolean'){
          return `  { name: '${key}', type: '${determinedTypeToTypescriptTypeConf[switchField(inputData[key])]}', component: 'checkbox'},`;
        }else if(temp == 'date'){
          return `  { name: '${key}', type: '${determinedTypeToTypescriptTypeConf[switchField(inputData[key])]}', component: 'datepicker'},`;
        }else if(key == 'uid'){
          return `  { name: '${key}', type: '${determinedTypeToTypescriptTypeConf[switchField(inputData[key])]}', primarykey: true},`
        }else if(!isUid && key == 'code'){
          return `  { name: '${key}', type: '${determinedTypeToTypescriptTypeConf[switchField(inputData[key])]}', primarykey: true},`
        }
        return `  { name: '${key}', type: '${determinedTypeToTypescriptTypeConf[switchField(inputData[key])]}'},`
      }).join('\n  ');

      repoId    = isUid ? 'BigInteger' : 'String';
      columnId  = isUid ? 'uid' : 'code';


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
import {CheckboxEditorComponent} from "../../custom-ui/checkbox-editor.component";
import {DateRangePickerFilterComponent} from "../../custom-ui/date-range-picker/date-range-picker-filter.component";
import {formatDateString} from "../../service/env-configuration";

const ${compnameCapitalized}TableSettings = {
  columns: {
 ${outputFields2}
  },
};

export const config = {
  title: '${title}',
  collectionUrlSegment: '${compnameLower}',
  fields: [
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
    
    constructor(public backendIntegrationService: BackendIntegrationService, public dialogService: NbDialogService) {
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

    const componentFileName = compnameCapitalized.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const componentImport = `import { ${compnameCapitalized}Component } from './custom-pages/${compnameLower}-page/${componentFileName}.component';\n`;
    const componentImportRouting = `import { ${compnameCapitalized}Component } from './custom-pages/${compnameLower}-page/${componentFileName}.component';`;
    const componentDeclaration = `    ${compnameCapitalized}Component,\n`;
    const componentImportDetail = `import { ${compnameCapitalized}DetailsComponent } from './custom-pages/${compnameLower}-page/${compnameLower}-details/${componentFileName}-details.component';\n`;
    const componentDeclarationDetail = `    ${compnameCapitalized}DetailsComponent,\n`;
    const menu = comment + ` 
  {
    title: '${title}',
    link: '${compnameLower}',
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

  writingBE() {

  const outputFile7 = `../commondto/src/main/java/it/acea/selfcare/commondto/persistence/model/${compnameCapitalized}Model.java`;
  const outputFile8 = `../commondto/src/main/java/it/acea/selfcare/commondto/repository/${compnameCapitalized}Repository.java`;
  const outputFile9 = `../commondto/src/main/java/it/acea/selfcare/commondto/backoffice/repository/BO_${compnameCapitalized}Repository.java`;

  const randomString = generateRandomLong();

  const outputFieldsBE = Object.keys(inputData).filter((key) => key != 'createdts').filter((key) => key != 'modifiedts').map((key) => {
    return `  private ${determinedTypeToJavaType[switchField(inputData[key])]} ${key};`
  }).join('\n    ');


  this.fs.write(
    this.destinationPath(outputFile7),
    `
package it.acea.selfcare.commondto.persistence.model;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigInteger;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import lombok.EqualsAndHashCode;


@Entity
@Table(name = "${compnameLower}", schema = "public", catalog = "selfcare")
@Data
@EqualsAndHashCode(callSuper=true)
public class ${compnameCapitalized}Model extends CommonModel implements Serializable {

private static final Long serialVersionUID = ${randomString}L;
${generatedValue}
@Column(name = "${columnId}", nullable = false)
${outputFieldsBE}
}`
  );

  this.fs.write(
    this.destinationPath(outputFile8),
    `
package it.acea.selfcare.commondto.repository;

import it.acea.selfcare.commondto.persistence.model.${compnameCapitalized}Model;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.List;

@Transactional(readOnly = false)
public interface ${compnameCapitalized}Repository extends JpaRepository<${compnameCapitalized}Model, ${repoId}> {
}`
  );

  this.fs.write(
    this.destinationPath(outputFile9),
    `
package it.acea.selfcare.commondto.backoffice.repository;

import it.acea.selfcare.commondto.persistence.model.${compnameCapitalized}Model;
import it.acea.selfcare.commondto.repository.${compnameCapitalized}Repository;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.transaction.annotation.Transactional;

@RepositoryRestResource(collectionResourceRel = "${compnameLower}", path = "${compnameLower}")
@Transactional
@Primary
public interface BO_${compnameCapitalized}Repository extends ${compnameCapitalized}Repository, JpaSpecificationExecutor<${compnameCapitalized}Model> {
}`
  );

  const inject = commentInject + `
    private final BO_${compnameCapitalized}Repository bo${compnameCapitalized}Repository;`;

  const controller = comment + `
      @GetMapping(value = "/${compnameLower}/search")
      public ResponseEntity<?> search${compnameCapitalized}(@RequestParam String filter, Pageable page, PagedResourcesAssembler assembler, PersistentEntityResourceAssembler entityAssembler) {
          filter = URLDecoder.decode(filter, StandardCharsets.UTF_8);
          Specification<${compnameCapitalized}Model> spec = new FilterSpecification<${compnameCapitalized}Model>(filter);
          Pageable sortByCreatedts = PageRequest.of(page.getPageNumber(),page.getPageSize(), Sort.by("createdts").descending());
          return ResponseEntity.ok(assembler.toModel(bo${compnameCapitalized}Repository.findAll(Specification.where(spec), sortByCreatedts), entityAssembler));
          }`;

    const controllerFile = this.fs.read(this.destinationPath(`../commondto/src/main/java/it/acea/selfcare/commondto/backoffice/controller/BackofficeController.java`));
    let newControllerFilee = controllerFile.replace(regexInject, inject);
    newControllerFilee = newControllerFilee.replace(regex, controller);

    this.fs.write(this.destinationPath(`../commondto/src/main/java/it/acea/selfcare/commondto/backoffice/controller/BackofficeController.java`), newControllerFilee);



  }
  
}
