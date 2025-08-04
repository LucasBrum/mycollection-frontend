import { Artist } from "../../artists/model/artist";
import { Category } from "../../categorias/model/category";

export class Item {
  id: number; // ID principal
  _id?: number; // Mantendo por compatibilidade
  title: string;
  releaseYear: number;
  genre: string;
  category: Category;
  artist: Artist;
  coverImagePath?: string;
}
