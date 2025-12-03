export interface DiscogsSearchResult {
  id: number;
  masterId: number;
  title: string;
  year: string;
  coverImage: string;
  thumb: string;
  genre: string[];
  style: string[];
  label: string[];
  country: string;
  format: string[];
  resourceUrl: string;
}

export interface DiscogsPagination {
  page: number;
  pages: number;
  perPage: number;
  items: number;
}

export interface DiscogsSearchResponse {
  pagination: DiscogsPagination;
  results: DiscogsSearchResult[];
}

export interface DiscogsArtist {
  id: number;
  name: string;
  resourceUrl: string;
}

export interface DiscogsLabel {
  id: number;
  name: string;
  catno: string;
}

export interface DiscogsTrack {
  position: string;
  title: string;
  duration: string;
}

export interface DiscogsImage {
  type: string;
  uri: string;
  uri150: string;
  width: number;
  height: number;
}

export interface DiscogsExtraArtist {
  id: number;
  name: string;
  role: string;
}

export interface DiscogsFormat {
  name: string;
  qty: string;
  text?: string;
  descriptions: string[];
}

export interface DiscogsRelease {
  id: number;
  masterId: number;
  title: string;
  year: number;
  artists: DiscogsArtist[];
  labels: DiscogsLabel[];
  genres: string[];
  styles: string[];
  tracklist: DiscogsTrack[];
  images: DiscogsImage[];
  extraartists: DiscogsExtraArtist[];
  country: string;
  formats: DiscogsFormat[];  // Tipo de mídia: CD, Vinyl, DVD, Blu-ray, etc.
}

export interface DiscogsMasterRelease {
  id: number;
  title: string;
  year: number;  // Ano original do lançamento
  artists: DiscogsArtist[];
  genres: string[];
  styles: string[];
  tracklist: DiscogsTrack[];
  images: DiscogsImage[];
}
