import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { PersonService } from "./person.service";
import { CreatePersonDto, UpdatePersonDto } from "./dto/create-person.dto";
import { FindOnePersonDto } from "./dto/find-one-person";
import { Persons } from "./entity/person.entity";

@Controller('movielist/person')
export class PersonController {

    constructor(
        private readonly personService: PersonService
    ) { }

    //Person Controller
    //Get All Person
    @Get()
    async getAllPerson(): Promise<Persons[]>  {
        try {
            return await this.personService.getAllPerson();
        } catch (error) {
            throw new HttpException('Failed to retrieve all person data', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //GetOne Person
    @Get('find_one')
    async getOnePerson(@Query() findOnePersonDto: FindOnePersonDto): Promise<Persons| null> {
        try {
            return await this.personService.getOnePerson(findOnePersonDto);
        } catch (error) {
            throw new HttpException('Failed to retrieve one person data', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Create One Person
    @Post()
    async createOnePerson(@Body() createPersonDto: CreatePersonDto):Promise<Persons> {
        try {
            return await this.personService.createOnePerson(createPersonDto);
        } catch (error) {
            throw new HttpException('Error Occured at Create one Person :', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Update One Person
    @Patch(':id')
    async updateOnePerson(@Param('id') id: string , @Body() updatePersonDto: UpdatePersonDto): Promise<Persons> {
        try {
            return await this.personService.updateOnePerson(Number(id),updatePersonDto );
        } catch (error) {
            throw new HttpException('Error Occured', HttpStatus.BAD_REQUEST)
        }
    }

    //Delete One Person
    @Delete(':id')
    async deleteOnePerson(@Param('id') id: string): Promise<{body:string}> {
        try {
            return await this.personService.deleteOnePerson(Number(id));
        } catch (error) {
            throw new HttpException('Error Occured', HttpStatus.BAD_REQUEST)
        }
    }
}