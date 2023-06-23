import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { ArtistItemDetailsResponse } from '../../artists/model/ArtistItemDetailsResponse';
import { ArtistService } from '../../artists/services/artist.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Item } from '../model/item';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ItemListComponent implements OnInit {

  private readonly ENDPOINT_GET_COVER_IMAGE = 'http://localhost:4200/mycollection/api/artists/album/cover/';

  display: boolean = false;

  showDialog() {
      this.display = true;
  }

  selectedArtistItemDetails: ArtistItemDetailsResponse;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;

  @ViewChild('tabela', {static: true}) grid: Table;
  @Output() editar: EventEmitter<number> = new EventEmitter();

  artistsItemDetailsResponse$: Observable<ArtistItemDetailsResponse[]>;

  item: Item;
  items: MenuItem[];

  constructor(
    private artistService: ArtistService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.items = [
      {
          label: 'Cadastrar',
          icon: 'pi pi-refresh',
          routerLink: ['/items/create'],
      }
    ];
    this.artistService.refreshNeeded$.subscribe(() => {
      this.list();
    })
    this.list();
  }

  list() {
    this.artistsItemDetailsResponse$ = this.artistService.listArtistsItemsDetails();
  }

  getCoverFromAlbum(event) {
    const coverImageId = event.data.id;
    this.retrievedImage = this.artistService.getCoverFromAlbum(event.data.id)
      .subscribe(response => {
        this.display = true;
        this.retrievedImage = this.ENDPOINT_GET_COVER_IMAGE + coverImageId;
      })
  }

  delete(item: Item): void {
    const itemId = item['id'];
    console.log(item['id'])
    this.confirmationService.confirm({
      message: 'Deseja realmente remover o Álbum ' + item['title'] + ' do ' + item['name'] + ' ?',
      accept: () => {
        this.artistService.delete(itemId).subscribe(
          response => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Álbum deletado com sucesso.'
            })
            this.artistService.refreshNeeded$;
          }
        )
      }
    })
  }

  onRowSelect(event) {
    this.messageService.add({severity:'info', summary:'Album selecionado', detail: event.data.name + ' - ' + event.data.country});
  }

  onRowUnselect(event) {
      this.messageService.add({severity:'info', summary:'Album selecionado',  detail: event.data.name + ' - ' + event.data.country});
  }

}
