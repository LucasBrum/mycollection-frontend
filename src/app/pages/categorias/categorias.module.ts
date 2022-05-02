import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';

import { SharedModule } from '../shared/shared.module';
import { AppPrimengModule } from './../shared/app-primeng/app-primeng.module';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';
import { CategoriasRoutingModule } from './categorias-routing.module';
import { CategoriasComponent } from './categorias/categorias.component';


@NgModule({
  declarations: [
    CategoriasComponent,
    CategoriaFormComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    CategoriasRoutingModule,
    AppPrimengModule,
    DialogModule,
    InputTextModule,
    SharedModule
  ]
})
export class CategoriasModule { }
