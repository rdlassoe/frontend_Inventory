import { Person } from "./persona.model";

export interface User {
    iduser: number;
    username: string;
    password: string;
    role: string;
    persona_id: Person;
}

export interface CreateUserDto {
    username: string;
    password: string;
    role: string;
    persona_id: number;
}