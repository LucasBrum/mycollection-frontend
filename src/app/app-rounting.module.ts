import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriasComponent } from './pages/categorias/categorias/categorias.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'categorias' },
  {
    path: 'categorias',
    loadChildren: () => import('./pages/categorias/categorias.module').then(m => m.CategoriasModule)
  },
  {
    path: 'artists',
    loadChildren: () => import('./pages/artists/artists.module').then(m => m.ArtistsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
