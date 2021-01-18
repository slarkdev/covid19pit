import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';;
import { CentroPobladoService } from "../../../mantenimientos/comunidad/comunidad.service";
import { DistritoService } from 'src/app/home/mantenimientos/distrito/distrito.service';
import { VinculoFamiliarService } from 'src/app/home/mantenimientos/vinculo-familiar/vinculo-familiar.service';
import { ProgramaSocialService } from 'src/app/home/mantenimientos/programa-social/programaSocial.service';
import { PersonaService } from '../persona.service';
import { FamiliaService } from '../../familia.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CentroPoblado } from 'src/app/shared/models/comunidad';
import { Persona } from 'src/app/shared/models/persona.interface';
import { Familia } from 'src/app/shared/models/familia.interface';
import { Distrito } from 'src/app/shared/models/distrito';
import { VinculoFamiliar } from 'src/app/shared/models/vinculoFamiliar';
import { ProgramaSocial } from 'src/app/shared/models/programaSocial';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import data from "../../../../../assets/personas.json"
import { Storage } from '@ionic/storage';
//import { LoadingService } from 'src/app/shared/services/loading.service';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  persona: Persona;
  familia: Familia;
  idPersona: string;
  idFamilia: string;
  isTitular: boolean = false;
  loading: any;

  showA = false;
  showB = false;
  showC = false;
  showD = false;

  entrevistador: string = '';
  idEntrevistador: string = '';

  messageError: string = '';

  centrosPoblados: CentroPoblado[] = new Array<CentroPoblado>();
  distritos: Distrito[] = new Array<Distrito>();
  vfs: VinculoFamiliar[] = new Array<VinculoFamiliar>();
  pss: ProgramaSocial[] = new Array<ProgramaSocial>();

  personaForm: FormGroup;
  viviendaForm: FormGroup;
  socioeconomicasForm: FormGroup;
  saludForm: FormGroup;
  arreglo = JSON.parse(JSON.stringify(data));

  trampa = 0;
  constructor(
    private centroPobladoSvc: CentroPobladoService,
    private distritosSvc: DistritoService,
    private vinculoFamiliarSvc: VinculoFamiliarService,
    private programaSocialSvc: ProgramaSocialService,
    private personaSvc: PersonaService,
    private familiaSvc: FamiliaService,
    private authSvc: AuthService,
    private storage: Storage,
    private route: ActivatedRoute,
    private router: Router) {
  }

  async ngOnInit() {
    try {
      this.iniciar();
      this.iniciarVivienda();

      this.idPersona = this.route.snapshot.params.idPersona;
      this.idFamilia = this.route.snapshot.params.idFamilia;

      await this.authSvc.datosUsuario().subscribe(res => {
        this.entrevistador = res.displayName;
        this.idEntrevistador = res.uid;
      })

      if (this.idPersona && this.idPersona !== 'add') {
        await this.personaSvc.getPersona(this.idPersona).subscribe(res => {
          this.persona = res;
          this.isTitular = this.persona.EsTitular;
          this.iniciar();
        });
      }

      if (this.idFamilia) {
        if (this.idFamilia !== 'add') {
          await this.familiaSvc.getFamilia(this.idFamilia).subscribe(res => {
            this.familia = res;
            this.iniciarVivienda();
          })
        } else {
          this.isTitular = true;
        }
      }
      await this.centroPobladoSvc.getComunidades().subscribe(res => {
        if (res.length === 0) {
          this.storage.get('centrosPoblados').then((array) => { this.centrosPoblados = array })
        } else {
          this.centrosPoblados = res;
        }
      }
      );

      await this.distritosSvc.getDistritos().subscribe(res => {
        if (res.length === 0) {
          this.storage.get('distritos').then((array) => { this.distritos = array })
        } else {
          this.distritos = res;
        }
      }
      );

      await this.vinculoFamiliarSvc.getVinculosFamiliares().subscribe(res => {
        if (res.length === 0) {
          this.storage.get('vinculosFamiliares').then((array) => { this.vfs = array })
        } else {
          this.vfs = res;
        }
      }
      );

      await this.programaSocialSvc.getProgramasSociales().subscribe(res => {
        if (res.length === 0) {
          this.storage.get('programasSociales').then((array) => { this.pss = array })
        } else {
          this.pss = res;
        }
      }
      );
      // this.loadingService.cerrar();
    } catch (error) {
      console.log('error', error);
    }
  }

  iniciar() {
    this.personaForm = new FormGroup({
      FechaEntrevista: new FormControl(this.persona ? this.persona.FechaEntrevista : (new Date()).toISOString(), [Validators.required]),
      DNI: new FormControl(this.persona?.DNI, [Validators.maxLength(8), Validators.minLength(8), Validators.required]),
      Nombres: new FormControl(this.persona?.Nombres.toUpperCase(), [Validators.maxLength(100), Validators.required]),
      ApellidoPaterno: new FormControl(this.persona?.ApellidoPaterno.toUpperCase(), [Validators.maxLength(50), Validators.required]),
      ApellidoMaterno: new FormControl(this.persona?.ApellidoMaterno.toUpperCase(), [Validators.maxLength(50), Validators.required]),

      FechaNacimiento: new FormControl(this.persona?.FechaNacimiento, [Validators.required]),

      Edad: new FormControl(this.persona?.Edad, [Validators.maxLength(3), Validators.required]),
      Genero: new FormControl(this.persona?.Genero.toUpperCase(), [Validators.maxLength(10), Validators.required]),

      Direccion: new FormControl(this.persona?.Direccion.toUpperCase(), [Validators.maxLength(300), Validators.required]),
      Telefono: new FormControl(this.persona?.Telefono, [Validators.maxLength(20)]),

      CentroPoblado: new FormControl(this.persona?.CentroPoblado.toUpperCase(), [Validators.required]),
      Distrito: new FormControl(this.persona?.Distrito.toUpperCase(), [Validators.required]),
      VinculoFamiliar: new FormControl(this.persona?.VinculoFamiliar.toUpperCase(), [Validators.required]),
      ProgramaSocial: new FormControl(this.persona?.ProgramaSocial, [Validators.required]),
      CodigoHogar: new FormControl(this.persona?.CodigoHogar, [Validators.maxLength(20)]),
    })

    this.saludForm = new FormGroup({
      ServiciosMedicos: new FormControl(this.persona?.ServiciosMedicos.toUpperCase(), [Validators.required]),
      FrecuenciaAtencion: new FormControl(this.persona?.FrecuenciaAtencion.toUpperCase(), [Validators.required]),
    });

    this.socioeconomicasForm = new FormGroup({
      NivelInstruccion: new FormControl(this.persona?.NivelInstruccion, [Validators.required]),
      Ocupacion: new FormControl(this.persona?.Ocupacion, [Validators.required]),
      IngresosEconomicos: new FormControl(this.persona?.IngresosEconomicos, [Validators.required]),
      SituacionEconomica: new FormControl(this.persona?.SituacionEconomica, [Validators.required]),
    });

  }

  iniciarVivienda() {
    this.viviendaForm = new FormGroup({
      CondicionVivienda: new FormControl(this.familia?.CondicionVivienda, [Validators.required]),
      NumeroFamilias: new FormControl(this.familia?.NumeroFamilias, [Validators.required]),
      NumeroIntegrantes: new FormControl(this.familia?.NumeroIntegrantes, [Validators.required]),
      HCL: new FormControl(this.familia?.HCL, [Validators.required]),
      AcondicionamientoVivienda: new FormControl(this.familia?.AcondicionamientoVivienda, [Validators.required]),
      DistanciaCentroMedico: new FormControl(this.familia?.DistanciaCentroMedico, [Validators.required]),
      ServiciosVivienda: new FormControl(this.familia?.ServiciosVivienda, [Validators.required]),
      NivelNacimiento: new FormControl(this.familia?.NivelNacimiento, [Validators.required]),
    })
  }

  volver() {
    if (this.idFamilia == "add") {
      this.router.navigate(["home/familia"]);
    } else {
      this.router.navigate(["home/familia/" + this.idFamilia]);
    }
  }
  calcularEdad(): number {
    let fechanac = this.personaForm.value.FechaNacimiento;
    if (fechanac) {
      const convertAge = new Date(fechanac);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      let edad = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      return edad
    } else {
      return 0;
    }
  }

  // SECCION A
  obtenerPersona() {
    this.showA = false;
    if (this.isTitular) {
      this.showB = true;
    } else {
      this.showC = true;
    }
  }
  // SECCION B SI ES persona
  obtenerVivienda(e) {
    this.viviendaForm = e;
    this.showB = false;
    this.showC = true;
  }

  // SECCION C
  obtenerSocioeconomicas(e) {
    this.socioeconomicasForm = e;
    this.showC = false;
    this.showD = true;
  }
  obtenerPuntaje() {
    if (this.viviendaForm.valid) {
      let NNPuntos = this.viviendaForm.value.NivelNacimiento.split('[');
      NNPuntos = NNPuntos[1].split(']');
      NNPuntos = parseFloat(NNPuntos[0]);
      let DCMPuntos = this.viviendaForm.value.DistanciaCentroMedico.split('[');
      DCMPuntos = DCMPuntos[1].split(']');
      DCMPuntos = parseFloat(DCMPuntos[0]);

      let SSV = 0;
      //hacer un bucle para servicios de la vivienda
      this.viviendaForm.value.ServiciosVivienda.forEach(e => {
        let SVPuntos = e.split('[');
        SVPuntos = SVPuntos[1].split(']');
        SVPuntos = parseFloat(SVPuntos[0]);
        SSV += SVPuntos;
      });
      return NNPuntos + DCMPuntos + SSV;
    }
    else { return 0 }
  }

  buscarPersona($event) {
    if ($event.target.value.length === 8) {

      let aux = this.arreglo['personas'].filter(item => {
        return (item.DNI ? item.DNI.toString().toLowerCase().indexOf($event.target.value) !== -1 : false)
      });
      if (aux.length > 0) {

        if (aux[0].Nombres)
          this.personaForm.controls.Nombres.setValue(aux[0].Nombres);
        if (aux[0].ApellidoPaterno)
          this.personaForm.controls.ApellidoPaterno.setValue(aux[0].ApellidoPaterno);
        if (aux[0].ApellidoMaterno)
          this.personaForm.controls.ApellidoMaterno.setValue(aux[0].ApellidoMaterno);
        if (aux[0].Comunidad)
          this.personaForm.controls.CentroPoblado.setValue(aux[0].Comunidad);
        if (aux[0].ProgramaSocial)
          this.personaForm.controls.ProgramaSocial.setValue(aux[0].ProgramaSocial);
        if (aux[0].Distrito)
          this.personaForm.controls.Distrito.setValue(aux[0].Distrito);

        if (aux[0].VinculoFamiliar)
          this.personaForm.controls.VinculoFamiliar.setValue(aux[0].VinculoFamiliar);
        if (aux[0].FechaNacimiento) {
          let fechaux = this.textoFecha(aux[0].FechaNacimiento);
          this.personaForm.controls.FechaNacimiento.setValue(fechaux);
        }

        if (aux[0].CodigoHogar)
          this.personaForm.controls.CodigoHogar.setValue(aux[0].CodigoHogar);

        this.messageError = "";
      } else {
        this.messageError = "No se encontro resultados";
        this.personaForm.controls.Nombres.setValue('');
        this.personaForm.controls.ApellidoPaterno.setValue('');
        this.personaForm.controls.ApellidoMaterno.setValue('');
        this.personaForm.controls.CentroPoblado.setValue('');
        this.personaForm.controls.ProgramaSocial.setValue('');
        this.personaForm.controls.Distrito.setValue('');
        this.personaForm.controls.VinculoFamiliar.setValue('');
        this.personaForm.controls.FechaNacimiento.setValue('');
        this.personaForm.controls.CodigoHogar.setValue('');
      }
    }
  }
  // SECCION D
  obtenerSalud(e) {
    try {
      this.saludForm = e;
      if (this.personaForm.valid && this.socioeconomicasForm.valid && this.saludForm.valid) {
        //Preparamos el objeto persona
        let aux: Persona = {
          Nombres: this.personaForm.value.Nombres,
          ApellidoPaterno: this.personaForm.value.ApellidoPaterno,
          ApellidoMaterno: this.personaForm.value.ApellidoMaterno,
          DNI: this.personaForm.value.DNI,
          FechaNacimiento: this.personaForm.value.FechaNacimiento,
          Edad: this.personaForm.value.Edad,
          Genero: this.personaForm.value.Genero,
          Direccion: this.personaForm.value.Direccion,
          Telefono: this.personaForm.value.Telefono,
          CentroPoblado: this.personaForm.value.CentroPoblado,
          Distrito: this.personaForm.value.Distrito,
          VinculoFamiliar: this.personaForm.value.VinculoFamiliar,
          ProgramaSocial: this.personaForm.value.ProgramaSocial,
          CodigoHogar: this.personaForm.value.CodigoHogar,
          idFamilia: this.persona?.idFamilia,
          idEntrevistador: this.idEntrevistador,
          NombreEntrevistador: this.entrevistador,
          FechaEntrevista: this.personaForm.value.FechaEntrevista,
          EsTitular: this.persona?.EsTitular,
          IngresosEconomicos: this.socioeconomicasForm.value.IngresosEconomicos,
          NivelInstruccion: this.socioeconomicasForm.value.NivelInstruccion,
          Ocupacion: this.socioeconomicasForm.value.Ocupacion,
          SituacionEconomica: this.socioeconomicasForm.value.SituacionEconomica,
          FrecuenciaAtencion: this.saludForm.value.FrecuenciaAtencion,
          ServiciosMedicos: this.saludForm.value.ServiciosMedicos,
          Estado: true,
        };
        if (this.isTitular) {
          if (this.viviendaForm?.valid) {
            console.log('es titular de familia');
            aux.EsTitular = true;
            // construimos el objeto familia con los datos por ser el titular y representante
            let familia: Familia = {
              DNI: this.personaForm.value.DNI,
              ApellidoPaterno: this.personaForm.value.ApellidoPaterno,
              ApellidoMaterno: this.personaForm.value.ApellidoMaterno,
              Nombres: this.personaForm.value.Nombres,
              Direccion: this.personaForm.value.Direccion, CentroPoblado: this.personaForm.value.CentroPoblado,
              Distrito: this.personaForm.value.Distrito,
              idEntrevistador: this.idEntrevistador,
              NombreEntrevistador: this.entrevistador,
              FechaEntrevista: this.personaForm.value.FechaEntrevista,
              CondicionVivienda: this.viviendaForm.value.CondicionVivienda,
              NumeroFamilias: this.viviendaForm.value.NumeroFamilias,
              NumeroIntegrantes: this.viviendaForm.value.NumeroIntegrantes,
              HCL: this.viviendaForm.value.HCL,
              AcondicionamientoVivienda: this.viviendaForm.value.AcondicionamientoVivienda,
              DistanciaCentroMedico: this.viviendaForm.value.DistanciaCentroMedico,
              ServiciosVivienda: this.viviendaForm.value.ServiciosVivienda,
              NivelNacimiento: this.viviendaForm.value.NivelNacimiento,
              PuntajeParcialFA: this.obtenerPuntaje(),
              PuntajeTotal: 0,
              Diagnostico: '',
              Estado: true,
            };
            if (this.persona) {
              console.log('existe obj titular');

              //significa que desea actualizar los datos del titular
              //primero actualizamos datos de la familia, luego los datos de la persona

              this.familiaSvc.updateFamilia(familia, this.idFamilia)
              //actualizamos los datos de la persona
              this.personaSvc.updatePersona(aux, this.idPersona);
            } else {
              console.log('NO existe obj titular se agregara la persona');

              //significa que desea agregar una familia
              //primero creamos la familia y obtenemos el id
              //luego agregamos a la persona titular
              this.familiaSvc.addFamilia(familia);
              // .then(  i => { 
              //   console.log(i.id);
              //   aux.idFamilia = i.id;
              //   this.personaSvc.addPersona(aux);

              // });              
              // this.personaSvc.addPersona(aux);
              this.familiaSvc.getFamilias().subscribe(res => {
                this.trampa++;
                if (this.trampa === 1) {
                  let fam = res.filter((i) => { return i.DNI === familia.DNI && i.FechaEntrevista === familia.FechaEntrevista });
                  aux.idFamilia = fam[0].id;
                  this.personaSvc.addPersona(aux);
                }
              })
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Necesita completar todos los campos de SECCIÓN B: CONDICIONES DE Y SOBRE LA VIVIENDA para poder continuar.',
            });
          }
        }
        else {
          console.log('es familiar');
          // entrar a esta parte significa que la persona es solo un familiar no un titular y ademas que pasamos el Input() Idfamilia
          aux.idFamilia = this.idFamilia;
          aux.EsTitular = false;
          if (this.persona) {
            console.log('solo actualizara los datos del familiar');
            //el obj existe por tanto desea actualizar
            //actualizamos los datos de la persona
            console.log(aux, this.persona.id);
            
            this.personaSvc.updatePersona(aux, this.idPersona);
          } else {
            console.log('agregara un familiar');

            //agregamos a la persona solamente
            this.personaSvc.addPersona(aux);
          }
        }
        Swal.fire({
          icon: 'success',
          title: 'Bien!',
          text: 'Los datos son correctos y se estan procesando.',
        });
        this.volver();
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Necesita completar todos los campos para poder continuar',
        });
      }
      //  this.loadingService.cerrar();
    } catch (error) {
      console.log('error', error);

    }

  }

  textoFecha(fecha: string) {
    let res = new Date();
    let array = fecha.split('/');
    let aux = array[0] + '-' + array[1] + '-' + array[2];
    res.setFullYear(parseInt(array[2]), parseInt(array[1]) - 1, parseInt(array[0]));
    return res.toISOString();

  }
}
