import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

import { AppPrimengModule } from './app-primeng/app-primeng.module';
import { ToolbarComponent } from './components/toolbar/toolbar.component';


@NgModule({
  declarations: [
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    AppPrimengModule,
    ButtonModule,
    ToolbarModule
  ],
  exports: [ToolbarComponent]
})
export class SharedModule { }
