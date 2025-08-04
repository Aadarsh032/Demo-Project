import { IsEnum, IsString } from "class-validator";
import { MovieGenresType } from "../../constants/movielist.enums";
import { PartialType } from "@nestjs/mapped-types";


export class CreateGenreDto {

    @IsEnum(MovieGenresType, {
        message: `Genre must be one of the following: ${Object.values(MovieGenresType).join(', ')}`,
    })
    genre: MovieGenresType;

    @IsString()
    description: string;
}

export class UpdateGenreDto extends PartialType(CreateGenreDto) { }