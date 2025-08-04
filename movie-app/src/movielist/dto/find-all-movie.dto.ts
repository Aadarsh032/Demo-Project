import { Transform, Type } from 'class-transformer';
import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { MovieGenresType } from '../constants/movielist.enums';

export class FindAllMovieDto {
    @Type(() => Number)
    @IsNumber()
    page: number;

    @Type(() => Number)
    @IsNumber()
    limit: number;

    @IsOptional()
    @IsEnum(MovieGenresType, { each: true })
    genre?: MovieGenresType;

    @IsOptional()
    @IsString()
    person?: string;

    @IsOptional()
    @IsString()
    title?: string;
}
