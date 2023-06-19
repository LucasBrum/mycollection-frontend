import { Category } from './../../categorias/model/category';
export class Artist {
  _id: number;
  name: string;
  title: string;
  releaseYear: number;
  country: string;
  genre: string;
  category: Category;
}
