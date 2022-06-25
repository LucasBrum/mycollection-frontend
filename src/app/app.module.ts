import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MegaMenuModule } from 'primeng/megamenu';

import { AppRoutingModule } from './app-rounting.module';
import { AppComponent } from './app.component';
import { ArtistsRoutingModule } from './pages/artists/artists-routing.module';
import { ArtistsModule } from './pages/artists/artists.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    MatToolbarModule,
    MatButtonModule,
    MegaMenuModule,
    ArtistsModule,
    ArtistsRoutingModule,
    AppRoutingModule,
    HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
