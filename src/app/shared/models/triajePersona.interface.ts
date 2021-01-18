import { Triaje } from './triaje';

export interface TriajePersona{
    id?: string;
    idPersona: string;
    Fecha: string;
    Items: Array<Triaje>;
    PuntajeParcial: number;
    Entrevistador: string;
    idEntrevistador: string;
    Estado: boolean;
}