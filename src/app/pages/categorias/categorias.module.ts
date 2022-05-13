import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { SharedModule } from '../shared/shared.module';
import { AppPrimengModule } from './../shared/app-primeng/app-primeng.module';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';
import { CategoriasRoutingModule } from './categorias-routing.module';
import { CategoriasComponent } from './categorias/categorias.component';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';


@NgModule({
  declarations: [
    CategoriasComponent,
    CategoriaFormComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    CategoriasRoutingModule,
    AppPrimengModule,
    InputTextModule,
    ReactiveFormsModule,
    
    SharedModule
  ]
})
export class CategoriasModule { }
