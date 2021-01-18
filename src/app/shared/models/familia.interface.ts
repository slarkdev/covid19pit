export interface Familia{
    id?: string,
    ApellidoMaterno: string,
    ApellidoPaterno: string,
    Nombres: string,
    CentroPoblado: string,
    CondicionVivienda: string,
    DNI: string,
    Direccion: string,
    DistanciaCentroMedico: string,
    Distrito: string,
    FechaEntrevista: string,
    NivelNacimiento: string,
    NombreEntrevistador: string,  
    NumeroFamilias: string,
    NumeroIntegrantes: string,
    HCL: string,
    AcondicionamientoVivienda: string,
    ServiciosVivienda: string,
    idEntrevistador: string,
    PuntajeParcialFA: number;
    PuntajeTotal: number;
    Diagnostico: string;
    Estado: boolean;
}