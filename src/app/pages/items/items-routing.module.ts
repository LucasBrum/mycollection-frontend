import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemCreateComponent } from './item-create/item-create.component';
import { ItemListComponent } from './item-list/item-list.component';

const routes: Routes = [
  { path: 'items', component: ItemListComponent},
  { path: 'items/create', component: ItemCreateComponent},
  { path: 'items/create/:id', component: ItemCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule { }
