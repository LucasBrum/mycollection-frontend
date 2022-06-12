import { catchError } from 'rxjs/operators';
import { ArtistService } from './../services/artist.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Artist } from '../model/artist';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {

  artists$: Observable<Artist[]>;

  constructor(
    private artistService: ArtistService
  ) { }

  ngOnInit(): void {
    this.list();
  }

  list() {
    this.artists$ = this.artistService.list();
  }

}
