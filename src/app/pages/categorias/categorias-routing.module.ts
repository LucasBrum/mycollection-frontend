import { CategoriaFormComponent } from './categoria-form/categoria-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriasComponent } from './categorias/categorias.component';

const routes: Routes = [
  { path: '', component: CategoriasComponent },
  { path: 'cadastrar', component: CategoriaFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriasRoutingModule { }
