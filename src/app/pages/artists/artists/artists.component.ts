import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';

import { Artist } from '../model/artist';
import { ArtistService } from './../services/artist.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ArtistsComponent implements OnInit {

  private readonly ENDPOINT_GET_COVER_IMAGE = 'http://localhost:4200/mycollection/api/artists/album/cover/';
  display: boolean = false;

    showDialog() {
        this.display = true;
    }


  selectedAlbum: Artist;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;

  @ViewChild('tabela', {static: true}) grid: Table;
  @Output() editar: EventEmitter<number> = new EventEmitter();

  artists$: Observable<Artist[]>;

  artist: Artist;
  items: MenuItem[];

  @Input() collapsed = false;
  @Input() screeWidth = 0;


  constructor(
    private artistService: ArtistService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit(): void {
    this.items = [
      {
          label: 'Cadastrar',
          icon: 'pi pi-refresh',
          routerLink: ['/artist/new'],
      }
  ];
    this.artistService.refreshNeeded$.subscribe(() => {
      this.list();
    })
    this.list();

  }

  list() {
    this.artists$ = this.artistService.list();
  }

  getCoverFromAlbum(event) {
    const coverImageId = event.data.id;
    this.retrievedImage = this.artistService.getCoverFromAlbum(event.data.id)
      .subscribe(response => {
        this.display = true;
        this.retrievedImage = this.ENDPOINT_GET_COVER_IMAGE + coverImageId;
      })
  }

  delete(artist: Artist): void {
    const artistId = artist['id'];
    console.log(artist['id'])
    this.confirmationService.confirm({
      message: 'Deseja realmente remover o Álbum ' + artist['title'] + ' do ' + artist['name'] + ' ?',
      accept: () => {
        this.artistService.delete(artistId).subscribe(
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

  selectAlbum(artist: Artist) {
    this.messageService.add({severity:'info', summary:'Album selecionado', detail: artist.name});
  }

  onRowSelect(event) {
      this.messageService.add({severity:'info', summary:'Album selecionado', detail: event.data.name + ' - ' + event.data.country});
  }

  onRowUnselect(event) {
      this.messageService.add({severity:'info', summary:'Album selecionado',  detail: event.data.name + ' - ' + event.data.country});
  }

}
