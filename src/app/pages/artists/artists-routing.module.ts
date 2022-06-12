import { ArtistFormComponent } from './artist-form/artist-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: ArtistFormComponent },
  { path: 'create', component: ArtistFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ArtistsRoutingModule { }
