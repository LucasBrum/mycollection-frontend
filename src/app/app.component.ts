import { Component } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mycollection-front';
  visibleSidebar: any;

  items: MenuItem[] = [];

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
      this.items = [
          {
              label:'CDs',
              icon:'pi pi-circle-off'

          },
      ];
  }
}
