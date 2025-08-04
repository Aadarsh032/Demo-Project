import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";


export class CreatePersonDto{
    @IsString()
    name:string;

    @IsString()
    description:string;

    @IsDate()
    @Type(()=>Date)
    dob: Date;
}


export class UpdatePersonDto extends PartialType(CreatePersonDto){}