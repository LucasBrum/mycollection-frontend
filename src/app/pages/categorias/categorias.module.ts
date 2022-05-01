import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';

import { SharedModule } from '../shared/shared.module';
import { AppPrimengModule } from './../shared/app-primeng/app-primeng.module';
import { CategoriasRoutingModule } from './categorias-routing.module';
import { CategoriasComponent } from './categorias/categorias.component';

@NgModule({
  declarations: [
    CategoriasComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    CategoriasRoutingModule,
    AppPrimengModule,
    SharedModule
  ]
})
export class CategoriasModule { }
