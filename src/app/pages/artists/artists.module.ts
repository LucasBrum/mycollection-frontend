import { ArtistsRoutingModule } from './artists-routing.module';
import { ArtistsComponent } from './artists/artists.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


import { SharedModule } from '../shared/shared.module';
import { ArtistFormComponent } from './artist-form/artist-form.component';
import { AppPrimengModule } from '../shared/app-primeng/app-primeng.module';
import {CardModule} from 'primeng/card';


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
    SharedModule
  ]
})
export class ArtistsModule { }
