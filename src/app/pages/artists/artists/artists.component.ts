import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { ArtistFormComponent } from '../artist-form/artist-form.component';

import { Artist } from '../model/artist';
import { ArtistService } from './../services/artist.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ArtistsComponent implements OnInit {

  selectedAlbum: Artist;

  @ViewChild('tabela', {static: true}) grid: Table;
  @Output() editar: EventEmitter<number> = new EventEmitter();

  displayModal: boolean;

  artists$: Observable<Artist[]>;

  artist: Artist;
  items: MenuItem[];

  @Input() collapsed = false;
  @Input() screeWidth = 0;


  constructor(
    private artistService: ArtistService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

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

  delete(artist: Artist): void {
    const artistId = artist['id'];
    console.log(artist['id'])
    this.confirmationService.confirm({
      message: 'Deseja realmente remover o Álbum ' + artist['title'] + ' do ' + artist['band'] + ' ?',
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

  selectProduct(artist: Artist) {
    this.messageService.add({severity:'info', summary:'Album selecionado', detail: artist.band});
  }

  onRowSelect(event) {
      this.messageService.add({severity:'info', summary:'Album selecionado', detail: event.data.band + ' - ' + event.data.title});
  }

  onRowUnselect(event) {
      this.messageService.add({severity:'info', summary:'Album selecionado',  detail: event.data.band + ' - ' + event.data.title});
  }

}
