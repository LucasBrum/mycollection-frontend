import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';

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
    ArtistsRoutingModule,
    CardModule,
    ConfirmDialogModule,
    ToolbarModule,
    SplitButtonModule,
    
    SharedModule
  ]
})
export class ArtistsModule { }
