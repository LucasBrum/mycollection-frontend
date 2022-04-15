import { NgModule } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { ProgressSpinnerModule } from 'primeng/progressspinner';



@NgModule({
  exports: [
    ProgressSpinnerModule,
    FieldsetModule

  ],
})
export class AppPrimengModule { }
