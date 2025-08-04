import { Genres } from "../entity/genre.entity";


export const genreProviders = [
  {
    provide: 'GENRE-REPO',
    useValue: Genres,
  },
];
