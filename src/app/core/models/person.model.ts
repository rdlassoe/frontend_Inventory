import { TipoIdentificacion } from "./tipo-identificacion.model";
import { TypePerson } from "./type-person.model";

export interface Person {
    idperson: number;
    nombre: string;
    apellido: string;
    numero_identificacion: string;
    email: string;
    movil: string;
    tipo_id: TipoIdentificacion;
    tipo_personaid: TypePerson;
}
