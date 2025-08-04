import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { MovieGenresType } from "../../constants/movielist.enums";
import { Type } from "class-transformer";

export class FindOneGenreDto {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id?: number;


    @IsOptional()
    @IsEnum(MovieGenresType, {
        message: `Genre must be one of the following: ${Object.values(MovieGenresType).join(', ')}`,
    })
    genre?: MovieGenresType;
}

export class FindOrCreateGenreDto extends FindOneGenreDto {

    @IsOptional()
    @IsString()
    description?: string;
}