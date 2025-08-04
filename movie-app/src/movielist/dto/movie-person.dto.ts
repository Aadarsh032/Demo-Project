import { IsEnum, IsNumber } from "class-validator";
import { Cast } from "../constants/movielist.enums";



export class MoviePersonDto {
    @IsNumber()
    id: number;

    @IsEnum(Cast)
    cast: Cast;
}