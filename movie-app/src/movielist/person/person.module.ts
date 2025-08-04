import { Logger, Module } from "@nestjs/common";
import { PersonService } from "./person.service";
import { PersonController } from "./person.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Persons } from "./entity/person.entity";
import { DatabaseModule } from "src/database/database.module";
import { personProviders } from "./constants/person.constants";
import { PersonRepository } from "./person.repository";



@Module({
    imports:[DatabaseModule],
    controllers:[PersonController],
    providers:[...personProviders,PersonService, Logger, PersonRepository],
    exports:[PersonModule,PersonRepository],
})
export class PersonModule{}