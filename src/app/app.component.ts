import { Component } from '@angular/core';
import { MegaMenuItem, MenuItem, PrimeNGConfig } from 'primeng/api';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mycollection-front';
  visibleSidebar: any;
  isSideNavCollapsed = false;
  screenWidth = 0;

  items: MegaMenuItem[];

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
      this.items = [
          {
              label:'Artists',
              routerLink: ['/artists'],
              icon:'pi pi-circle-off'

          },
          {
            label:'Items',
            routerLink: ['/items'],
            icon:'pi pi-box'

        },
          {
            label: 'Categorias',
            icon: 'pi pi-fw pi-cog',
            routerLink: ['/categorias']

        },
      ];
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
