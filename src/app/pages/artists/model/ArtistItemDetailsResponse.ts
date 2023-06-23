import { Category } from "../../categorias/model/category";

export class ArtistItemDetailsResponse {
  _id: number;
  name: string;
  country: string;
  title: string;
  releaseYear: number;
  genre: string;
  category: Category;

}
