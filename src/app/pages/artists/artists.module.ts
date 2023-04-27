import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import {DialogModule} from 'primeng/dialog';
import {FileUploadModule} from 'primeng/fileupload';

import { AppPrimengModule } from '../shared/app-primeng/app-primeng.module';
import { SharedModule } from '../shared/shared.module';
import { ArtistFormComponent } from './artist-form/artist-form.component';
import { ArtistsRoutingModule } from './artists-routing.module';
import { ArtistsComponent } from './artists/artists.component';



@NgModule({
  declarations: [
    ArtistsComponent,
    ArtistFormComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    AppPrimengModule,
    DialogModule,
    ArtistsRoutingModule,
    CardModule,
    ConfirmDialogModule,
    ToolbarModule,
    SplitButtonModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    FileUploadModule,

    SharedModule
  ]
})
export class ArtistsModule { }
