import { Persons } from "../entity/person.entity";

export const personProviders = [
  {
    provide: 'PERSON-REPO',
    useValue: Persons,
  },
];
