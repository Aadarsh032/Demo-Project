import { Logger, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { GenreController } from "./genre.controller";
import { GenreService } from "./genre.service";
import { GenreRepository } from "./genre.repository";
import { DatabaseModule } from "src/database/database.module";
import { genreProviders } from "./constants/genre.constants";



@Module({
    imports:[
    DatabaseModule
],
    controllers:[ GenreController],
    providers:[ ...genreProviders,GenreService,Logger, GenreRepository],
    exports:[GenreModule, GenreRepository]
})
export class GenreModule {}


