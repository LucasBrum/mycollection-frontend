import { NgModule } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  exports: [
    ProgressSpinnerModule,
    FieldsetModule,
    ButtonModule,
    ToastModule

  ],
})
export class AppPrimengModule { }
