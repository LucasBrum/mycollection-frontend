import { Artist } from "../../artists/model/artist";
import { Category } from "../../categorias/model/category";

export interface Track {
  id?: number;
  position: string;
  title: string;
  duration: string;
  trackOrder: number;
}

export interface Credit {
  id?: number;
  name: string;
  role: string;
  discogsArtistId?: number;
}

export interface Label {
  id?: number;
  name: string;
  discogsId?: number;
}

export class Item {
  id: number;
  _id?: number; // Mantendo por compatibilidade
  title: string;
  releaseYear: number;
  genre: string;
  category: Category;
  artist: Artist;
  coverImagePath?: string;
  // Novos campos para integração com Discogs
  label?: Label;
  discogsReleaseId?: number;
  discogsMasterId?: number;
  discogsImageUrl?: string;
  tracks?: Track[];
  credits?: Credit[];
}
