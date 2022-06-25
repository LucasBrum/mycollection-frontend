import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
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

  displayModal: boolean;

  artists$: Observable<Artist[]>;
  artist: Artist;
  items: MenuItem[];

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
    console.log("teste teste teste");
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

}
