import { NgModule } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import {ToastModule} from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';



@NgModule({
  exports: [
    ProgressSpinnerModule,
    FieldsetModule,
    ToastModule

  ],
})
export class AppPrimengModule { }
