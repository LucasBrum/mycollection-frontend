import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsRoutingModule } from './items-routing.module';
import { ItemCreateComponent } from './item-create/item-create.component';
import { ItemListComponent } from './item-list/item-list.component';
import { DiscogsSearchDialogComponent } from './discogs-search-dialog/discogs-search-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { AppPrimengModule } from '../shared/app-primeng/app-primeng.module';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
  declarations: [
    ItemCreateComponent,
    ItemListComponent,
    DiscogsSearchDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    AppPrimengModule,
    DialogModule,
    ItemsRoutingModule,
    CardModule,
    ConfirmDialogModule,
    ToolbarModule,
    SplitButtonModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    FileUploadModule,
    PaginatorModule,
    TooltipModule,
    SharedModule,
    SelectButtonModule,
    ProgressSpinnerModule
  ]
})
export class ItemsModule { }
