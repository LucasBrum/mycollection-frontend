import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriasComponent } from './pages/categorias/categorias/categorias.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'categorias' },
  {
    path: 'categorias',
    loadChildren: () => import('./pages/categorias/categorias.module').then(m => m.CategoriasModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
