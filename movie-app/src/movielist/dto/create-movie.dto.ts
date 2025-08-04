import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString, IsArray, ValidateNested, IsOptional, IsEnum } from "class-validator";
import { MoviePersonDto } from "./movie-person.dto";
import { MovieGenresType } from "../constants/movielist.enums";
import { FindOrCreateGenreDto } from "../genre/dto/find-one-genre.dto";
import { FindOrCreatePersonDto } from "../person/dto/find-one-person";

export class CreateMovieDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsDate()
    @Type(() => Date)
    releaseDate: Date;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FindOrCreateGenreDto)
    genres: FindOrCreateGenreDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FindOrCreatePersonDto)
    persons: FindOrCreatePersonDto[];
}




