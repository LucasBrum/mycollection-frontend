import { Component } from '@angular/core';
import { MegaMenuItem, MenuItem, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mycollection-front';
  visibleSidebar: any;

  items: MegaMenuItem[];

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
      this.items = [
          {
              label:'CDs',
              routerLink: ['/artists'],
              icon:'pi pi-circle-off'

          },
          {
            label: 'Categorias', icon: 'pi pi-fw pi-cog',
            routerLink: ['/categorias']

        },
      ];
  }
}
