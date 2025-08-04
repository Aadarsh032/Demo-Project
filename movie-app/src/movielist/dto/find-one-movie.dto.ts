import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MovieGenresType } from '../constants/movielist.enums';

export class FindOneMovieDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  release_date: Date;

  @IsOptional()
  @IsArray()
  @IsEnum(MovieGenresType, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  genre?: MovieGenresType[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  persons?: string[];
}

