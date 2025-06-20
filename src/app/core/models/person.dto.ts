import { TipoIdentificacion } from "./tipo-identificacion.model";
import { TypePerson } from "./type-person.model";

export interface CreatePersonDto {
    idperson: number;
    nombre: string;
    apellido: string;
    numero_identificacion: string;
    email: string;
    movil: string;
    tipo_id: number;
    tipo_personaid: number;
}