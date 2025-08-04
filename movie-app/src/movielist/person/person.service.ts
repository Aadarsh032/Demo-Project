import { ConflictException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Persons } from "./entity/person.entity";
import { PersonRepository } from "./person.repository";
import { CreatePersonDto, UpdatePersonDto } from "./dto/create-person.dto";
import { Attributes, CreationAttributes, WhereOptions } from "sequelize";
import { FindOnePersonDto } from "./dto/find-one-person";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class PersonService {
  constructor(
    private readonly personRepository: PersonRepository,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) { }

  //Person Services
  //Create One Person
  async createOnePerson(createPersonDto: CreatePersonDto): Promise<Persons> {
    try {
      var whereParameters: WhereOptions = {
        ...(createPersonDto.name) && { name: createPersonDto.name.toLowerCase() },
      }
      const existingPerson = await this.personRepository.findOne(whereParameters);
      if (existingPerson) {
        throw new ConflictException(`Genre ${createPersonDto.name} already exists.`)
      }
      let payload: CreationAttributes<Persons> = {
        name: createPersonDto.name.toLowerCase(),
        description: createPersonDto.description,
        dob: createPersonDto.dob
      }
      return await this.personRepository.createOne(payload);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new Error('An unexpected Error occured while creating Person');
    }
  }

  //Get All Person
  async getAllPerson(): Promise<Persons[]> {
    try {
      const cacheKey = 'person:all';
      const cached = await this.cacheManager.get<string>(cacheKey);

      if (cached) {
        const { data, cachedAt } = JSON.parse(cached);
        console.log(`All Persons From Cache : ${cachedAt}`)
        return data;
      }
      const person = await this.personRepository.findAll();

      const payload = {
        data: person,
        cachedAt: new Date().toISOString(),
      }
      await this.cacheManager.set(cacheKey, JSON.stringify(payload), { ttl: 60 } as any);
      console.log(`Persons Not From Cache - Fetched and Cached`)
      return person;
    } catch (error) {
      throw new Error('An unexpected Error occured while getting all Person');
    }
  }

  //Get One Peron
  async getOnePerson(getOnePerson: FindOnePersonDto): Promise<Persons | null> {
    try {
      let whereParameters: WhereOptions = {
        ...(getOnePerson.id) && { id: getOnePerson.id },
        ...(getOnePerson.name) && { name: getOnePerson.name.toLowerCase() },
        ...(getOnePerson.dob) && { dob: getOnePerson.dob }
      }
      const person = await this.personRepository.findOne(whereParameters);
      if (!person) {
        throw new NotFoundException(`No Records Matching the Query `);
      }
      return person;
    } catch (error) {
      throw new Error('An unexpected Error occured while getting Person');
    }
  }


  // Update One Person
  async updateOnePerson(id: number, updatePersonDto: UpdatePersonDto): Promise<Persons> {
    try {
      var wherParameters: WhereOptions = {
        id: id
      }
      const existingPersonCheck = await this.personRepository.findOne(wherParameters);
      if (!existingPersonCheck) {
        throw new NotFoundException(`Person Id:${id} does not exists.`);
      }
      const payload: Partial<Attributes<Persons>> = {
        ...(updatePersonDto.description) && { description: updatePersonDto.description },
      }
      return await this.personRepository.updateOne(existingPersonCheck, payload);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) throw error;
      throw new Error('An unexpected Error occured while updating Person');
    }
  }

  // Delete One Person
  async deleteOnePerson(id: number): Promise<{ body: string }> {
    try {
      var whereParameters: WhereOptions = { id: id };
      const result = await this.personRepository.deleteOne(whereParameters);
      if (!result) {
        throw new NotFoundException(`Person by Id:${id} does not exists`);
      }
      return { body: `Succesfully deleted Person Id:${id}` }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new Error('An unexpected Error occured while deleting Person');
    }
  }

}