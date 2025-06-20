import { Person } from "./person.model";

export interface User {
    iduser: number;
    username: string;
    password: string;
    persona_id: Person;
}