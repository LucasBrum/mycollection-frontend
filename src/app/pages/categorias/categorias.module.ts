import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {ToolbarModule} from 'primeng/toolbar';
import { TableModule } from 'primeng/table';

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
    CategoriasRoutingModule
  ]
})
export class CategoriasModule { }
