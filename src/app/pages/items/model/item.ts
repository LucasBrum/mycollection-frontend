import { Artist } from "../../artists/model/artist";
import { Category } from "../../categorias/model/category";

export class Item {

  _id: number;
  title: string;
  releaseYear: number;
  genre: string;
  category: Category;
  artist: Artist;
  coverImagePath?: string;
}
