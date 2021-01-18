import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaService } from '../../persona.service';
import { Persona } from 'src/app/shared/models/persona';
import { SintomaService } from 'src/app/home/mantenimientos/sintoma/sintoma.service';
import { Triaje } from 'src/app/shared/models/triaje';
import { GrupoRiesgo } from 'src/app/shared/models/grupoRiesgo';
import { TriajePersona } from 'src/app/shared/models/triajePersona.interface';
import { TriajeService } from '../triaje.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TipoSintomaService } from 'src/app/home/mantenimientos/tipo-sintoma/tipo-sintoma.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-triaje-persona',
  templateUrl: './triaje-persona.page.html',
  styleUrls: ['./triaje-persona.page.scss'],
})
export class TriajePersonaPage implements OnInit {
  @ViewChild('myTable') table: any;
  pdfObject: any;
  idOpcion: string;
  idPersona: string;
  idFamilia: string;
  idTriaje: string;
  showDatos: boolean = false;
  showSintomas: boolean = false;
  triajePersona: TriajePersona;
  entrevistador: string = '';
  idEntrevistador: string = '';
  persona: Persona = new Persona();
  gr: GrupoRiesgo[] = new Array<GrupoRiesgo>();


  //para calcular el IMC
  peso: number = 0;
  estatura: number = 0;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private authSvc: AuthService,
    private personaSvc: PersonaService,
    private sintomasSvc: SintomaService,
    private tipoSintomasSvc: TipoSintomaService,
    private triajePersonaSvc: TriajeService,
    private loadingSvc: LoadingService) {
    this.idFamilia = this.route.snapshot.params.idFamilia;
    this.idPersona = this.route.snapshot.params.idPersona;
    this.idTriaje = this.route.snapshot.params.idTriaje;
    this.idOpcion = this.route.snapshot.params.idOpcion;
  }

  async ngOnInit() {
    try {

      this.triajePersona = {
        idPersona: this.idPersona,
        Fecha: new Date().toISOString(),
        Items: new Array<Triaje>(),
        PuntajeParcial: 0,
        Entrevistador: this.entrevistador,
        idEntrevistador: this.idEntrevistador,
        Estado: true,
      }
      await this.authSvc.datosUsuario().subscribe(res => {
        this.entrevistador = res.displayName;
        this.idEntrevistador = res.uid;
        this.triajePersona.Entrevistador = this.entrevistador;
        this.triajePersona.idEntrevistador = this.idEntrevistador;
      })
      await this.personaSvc.getPersona(this.idPersona).subscribe(res => this.persona = res);

      if (this.idOpcion == "add") {
        await this.sintomasSvc.getSintomas().subscribe(res => {
          res.forEach((i) => {
            let item: Triaje = {
              Item: i.NombreSintoma,
              Estado: false,
              Valor: '',
              Medida: i.Medida ? i.Medida : '',
              TipoSintoma: i.TipoSintoma.toUpperCase(),
              Puntos: i.Puntos
            };
            this.triajePersona.Items.push(item);
          });
        })
      } else {
        // quiere ver o modificar modificar el triaje
        await this.triajePersonaSvc.getTriaje(this.idTriaje).subscribe(res => {
          this.triajePersona = res;
        })
      }
    } catch (error) {
      console.log('error', error);
    }
  }
  volverTriajes() {
    this.router.navigate(["home/familia/" + this.idFamilia + "/triajes/" + this.idPersona])
  }

  updateSintoma(row) {
    if (!(row.Medida.toLowerCase() === 'spo2' || row.Medida.toLowerCase() === '% spo2' || row.Medida.toLowerCase() === '%spo2')) {
      if (!row.Estado) {
        this.triajePersona.PuntajeParcial -= row.Puntos
      } else {
        this.triajePersona.PuntajeParcial += row.Puntos
      }
    } else if (!row.Estado) { row.Valor = '' }
  }

  expandir(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }

  calcularIMC(row) {
    if (row.Item.toLowerCase() === "estatura" || row.Medida.toLowerCase() === "m") {
      this.estatura = row.Valor;
    }
    if (row.Item.toLowerCase() === "peso en balanza" || row.Medida.toLowerCase() === 'kg') {
      this.peso = row.Valor;
    }
    if (this.peso !== 0 && this.estatura !== 0) {
      this.triajePersona.Items.forEach((i) => {
        if (i.Item.toLowerCase() === "imc") {
          i.Valor = (this.peso / Math.pow(this.estatura, 2)).toFixed(2).toString();
        }
      })
    }
    if (row.Medida.toLowerCase() === 'spo2' || row.Medida.toLowerCase() === '% spo2' || row.Medida.toLowerCase() === '%spo2') {
      if (row.Valor < 95 && row.Valor !== "") {
        this.triajePersona.PuntajeParcial += row.Puntos;
      }
    }
  }

  limpiar(row) {
    if (row.Medida.toLowerCase() === 'spo2' || row.Medida.toLowerCase() === '% spo2' || row.Medida.toLowerCase() === '%spo2') {
      if (row.Valor < 95 && row.Valor !== "") { this.triajePersona.PuntajeParcial -= row.Puntos; }

      row.Valor = '';
    }
  }

  save() {
    try {
      Swal.fire({
        icon: 'question',
        title: 'Mensaje de confirmación',
        text: '¿Esta seguro de guardar los datos?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Guardar',
        cancelButtonText: 'No'
      }).then(res => {
        if (res.value) {
          if (this.idTriaje == "add") {
            this.triajePersona.Estado = true;
            this.triajePersonaSvc.addTriaje(this.triajePersona).then(res => {
              Swal.fire(
                'Bien!',
                'Se han guardado los datos.',
                'success'
              )
            });
          } else {
            this.triajePersona.Fecha = new Date().toISOString();
            this.triajePersona.Entrevistador = this.entrevistador
            this.triajePersona.idEntrevistador = this.idEntrevistador;
            this.triajePersona.Estado = true;
            this.triajePersonaSvc.updateTriaje(this.triajePersona, this.idTriaje).then(res => {
              Swal.fire(
                'Bien!',
                'Se han modificado los datos.',
                'success'
              )
            });
          }
          this.volverTriajes();
        }
      });

    } catch (error) {
      console.log('error', error);
    }
  }

  async download() {
    await this.loadingSvc.abrir();
    let docDefinition = {
      info: {
        title: 'TRIAJE_PERSONA_DNI_' + this.persona.DNI,
        author: 'CENSO SANITARIO PITUMARCA',
        subject: this.persona.NombreEntrevistador,
        keywords: 'Triaje generado por ' + this.persona.NombreEntrevistador + ' para ' + this.persona.DNI,
        creationDate: new Date(),
      },
      fontsize: 8,
      pageSize: 'A4',
      pageOrientation: 'portrait',   //portrait
      watermark: { text: 'Censo Sanitario Pitumarca', fontSize: 60, color: 'blue', opacity: 0.15, bold: true, italics: false, angle: -65 },
      footer: function (currentPage, pageCount) { return { text: 'Página ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center', fontsize: 8 } },
      content: this.construirSintomas(),
      styles: {
        header: {
          fontSize: 12,
          bold: true
        },
        subheader: {
          fontSize: 9,
          bold: true
        },      
        small: {
          fontSize: 8,
          margin: [0, 5, 0, 10]
        },
        table: {
          fontSize: 8,
          margin: [0, 5, 0, 10],
          alignment: 'right'
        }
      }
    };

    this.pdfObject = pdfMake.createPdf(docDefinition);
    this.pdfObject.download('TRIAJE_' + this.persona.DNI);

    this.loadingSvc.cerrar();
  }
  async construirSintomas() {
    console.log(this.triajePersona);
    let items : Triaje[] = this.triajePersona.Items;
    let body: any = [
      {
        text: 'CARTILLA DE INFORMACIÓN DIAGNÓSTICA DE PACIENTES',
        style: 'header',
        alignment: 'center'
      },
      {
        text: 'TRIAJE',
        style: 'subheader',
        alignment: 'center'
      },
      {
        text: 'DATOS DE LA PERSONA',
        style: 'subheader',
      },
      {
        style: 'table',
        table: {
          heights: 10,
          widths: [100, 140, 100, 140],
          body: [
            [{ text: 'NOMBRES', alignment: 'left' }, { text: this.persona.ApellidoPaterno + ' ' + this.persona.ApellidoMaterno + ' ' + this.persona.Nombres }, { text: 'FECHA ENTREVISTA', alignment: 'left' }, this.formatearFecha(this.triajePersona.Fecha)],
            [{ text: 'DNI', alignment: 'left' }, this.persona.DNI, { text: 'DIRECCIÓN', alignment: 'left' }, this.persona.Direccion + ', ' + this.persona.CentroPoblado + '-' + this.persona.Distrito],
            [{ text: 'VÍNCULO FAMILIAR', alignment: 'left' }, this.persona.VinculoFamiliar, { text: 'TELÉFONO', alignment: 'left' }, this.persona.Telefono ? this.persona.Telefono : 'No registró teléfono'],
            [{ text: 'GÉNERO', alignment: 'left' }, this.persona.Genero, { text: 'FECHA NACIMIENTO', alignment: 'left' }, this.formatearFecha(this.persona.FechaNacimiento).slice(0, 10)],
            [{ text: 'PROGRAMAS SOCIALES', alignment: 'left' }, this.persona.ProgramaSocial, { text: 'SERVICIOS MÉDICOS', alignment: 'left' }, this.persona.ServiciosMedicos],
            [{ text: 'FRECUENCIA DE ATENCIÓN', alignment: 'left' }, this.persona.FrecuenciaAtencion, { text: 'ENTREVISTADOR', alignment: 'left' }, this.triajePersona.Entrevistador]
          ],
        },
      },
    ]
    await this.tipoSintomasSvc.getTipoSintomas().subscribe( arrayTipoSintomas => {
      // console.log(arrayTipoSintomas);
      let columnas = Math.round(arrayTipoSintomas.length / 2);
      // console.log(columnas);
      let subbody = [];

      arrayTipoSintomas.forEach( i => {
        let arraySintomasFiltrado = items.filter( l => {
          return l.TipoSintoma === i.NombreTipoSintoma
        });
        // console.log(arraySintomasFiltrado);       

        let tablaAux: any[] = [[{ text : i.NombreTipoSintoma.toUpperCase(), colSpan: 3, bold:true, alignment:'center'}, '','']];

        arraySintomasFiltrado.forEach( i => {
          tablaAux.push([{ text: i.Item.toUpperCase(), alignment: 'left'}, { text: i.Estado ? 'X': '-', alignment: 'center'}, { text: i.Medida }])
        });

        // console.log(tablaAux);
        subbody.push(tablaAux);
        console.log(subbody);        
      });
     
      body.push(subbody);
    });
    console.log(body);
    
    return body;
  }
  formatearFecha(fecha) {
    let array = fecha.split('T');
    let f = array[0];
    let h = array[1].slice(0, 8);
    let aux = f.split('-');
    f = aux[2] + '/' + aux[1] + '/' + aux[0];
    return f + ' ' + h + ' hs';
  }
}
