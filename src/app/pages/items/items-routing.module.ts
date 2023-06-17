import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemCreateComponent } from './item-create/item-create.component';

const routes: Routes = [
  { path: 'items/create', component: ItemCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule { }
