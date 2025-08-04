import { Movies } from "../entity/movie.entity";
import { MoviesGenres } from "../entity/movie-genre-join.entity";
import { Personas } from "../entity/persona.entity";

export const movieProviders=[
    {
        provide:'MOVIE-REPO',
        useValue:Movies
    }
]


export const personaProvider =[
    {
        provide:'PERSONA-REPO',
        useValue:Personas
    }
]

export const moviesGenreProvider =[
    {
        provide:'MOVIEGENRE-REPO',
        useValue:MoviesGenres
    }
]