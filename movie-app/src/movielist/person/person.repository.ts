import { Inject } from "@nestjs/common";
import { Persons } from "./entity/person.entity";
import { Attributes, CreationAttributes, Transaction, WhereOptions } from "sequelize";
import { UpdatePersonDto } from "./dto/create-person.dto";
import { FindOrCreatePersonDto } from "./dto/find-one-person";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";



export class PersonRepository {
    constructor(
        @Inject('PERSON-REPO')
        private readonly personRepo: typeof Persons,

    ) { }

    // Person Reository
    //Find All Person
    async findAll(): Promise<Persons[]> {
        const person = await this.personRepo.findAll(
            { limit: 100 }
        );
        return person;
    }

    //Find One Person
    async findOne(whereParameters: WhereOptions): Promise<Persons | null> {
        return await this.personRepo.findOne({ where: whereParameters });
    }

    //Create One Person
    async createOne(payload: CreationAttributes<Persons>): Promise<Persons> {
        const person = await this.personRepo.create(payload);
        return person;
    }

    //Update One Person
    async updateOne(existingPersons: Persons, payload: Partial<Attributes<Persons>>): Promise<Persons> {
        await existingPersons.update({
            description: payload.description
        })
        return await existingPersons.save();
    }

    // Delete One Person
    async deleteOne(whereParameters: WhereOptions) {
        return await this.personRepo.destroy({ where: whereParameters });
    }

    //Fine One or Create
    async findOneOrCreate(person: FindOrCreatePersonDto, manager?: Transaction) {
        return await this.personRepo.findOrCreate({
            where: { name: person.name?.toLowerCase() },
            transaction: manager,
            defaults: {
                description: person.description || '',
                dob: person.dob
            },
        });
    }
}