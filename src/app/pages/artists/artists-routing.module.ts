import { ArtistFormComponent } from './artist-form/artist-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistsComponent } from './artists/artists.component';


const routes: Routes = [
  { path: 'artists', component: ArtistsComponent },
  { path: 'artists/create', component: ArtistFormComponent},
  { path: 'artists/form/:id', component: ArtistFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ArtistsRoutingModule { }
