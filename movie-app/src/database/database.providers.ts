import { Sequelize } from "sequelize-typescript"
import { Movies } from "src/movielist/entity/movie.entity";
import { MoviesGenres } from "src/movielist/entity/movie-genre-join.entity";
import { Personas } from "src/movielist/entity/persona.entity";
import { Genres } from "src/movielist/genre/entity/genre.entity"
import { Persons } from "src/movielist/person/entity/person.entity"
import { Permissions } from "src/user/entity/permissions.entity";
import { Roles } from "src/user/entity/roles.entity";
import { RolesPermissions } from "src/user/entity/roles_permissions_join.entity";
import { Users } from "src/user/entity/users.entity";


export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize({
                dialect: 'postgres',
                username: process.env.DB_USER || 'admin',
                password: process.env.DB_PASSWORD || 'admin',
                database: process.env.DB_NAME || 'moviebase',
                host: process.env.DB_HOST || 'localhost',
                port: 5432,
                logging:false,
                models: [
                    Genres,
                    Persons,
                    MoviesGenres,
                    Movies,
                    Personas,
                    Users,
                    Roles,
                    RolesPermissions,
                    Permissions
                ]
            });

            await sequelize.sync();
            return sequelize;
        },
    }
]

