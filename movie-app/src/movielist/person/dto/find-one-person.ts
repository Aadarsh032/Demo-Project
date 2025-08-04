import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Cast } from "src/movielist/constants/movielist.enums";


export class FindOnePersonDto {

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id?: number;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dob?: Date
}



export class FindOrCreatePersonDto extends FindOnePersonDto {

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(Cast)
    cast: Cast;
}

