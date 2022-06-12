import { Categoria } from './../../categorias/model/categoria';
export interface Artist {
  _id: number;
  band: string;
  title: string;
  releaseYear: string;
  country: string;
  genre: string;
  categoria: Categoria;
}
