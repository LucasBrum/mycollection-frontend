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
import { SidenavComponent } from './sidenav/sidenav/sidenav.component';
import { ItemsModule } from './pages/items/items.module';
import { ItemsRoutingModule } from './pages/items/items-routing.module';
import { PaginatorModule } from 'primeng/paginator';


@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MegaMenuModule,
    ArtistsModule,
    ArtistsRoutingModule,
    ItemsModule,
    PaginatorModule,
    ItemsRoutingModule,
    AppRoutingModule,
    HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
