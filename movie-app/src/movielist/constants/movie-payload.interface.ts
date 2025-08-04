import { MoviePersonDto } from "../dto/movie-person.dto";
import { FindOrCreateGenreDto } from "../genre/dto/find-one-genre.dto";
import { Genres } from "../genre/entity/genre.entity";
import { FindOrCreatePersonDto } from "../person/dto/find-one-person";

export interface CreateMoviePayload {
  title: string;
  description: string;
  release_date: Date;
  genres: Genres[];
  persons: FindOrCreatePersonDto[]; 
}
