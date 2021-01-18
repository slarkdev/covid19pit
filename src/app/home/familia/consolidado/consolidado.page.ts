import { Component, OnInit, ViewChild } from '@angular/core';
import { Persona } from 'src/app/shared/models/persona';
import { Familia } from 'src/app/shared/models/familia';
import { PersonaService } from '../persona/persona.service';
import { FamiliaService } from '../familia.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TriajeService } from '../persona/triaje/triaje.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-consolidado',
  templateUrl: './consolidado.page.html',
  styleUrls: ['./consolidado.page.scss'],
})
export class ConsolidadoPage implements OnInit {
  pdfObject: any;

  @ViewChild('myTable') table: any;
  idFamilia: string;
  personas: any[] = new Array<any>();
  personaAux: any[];
  familia: any;
  familiaAux: Familia[];

  showMiembros: boolean = false;
  showFactores: boolean = false;

  sumaMiembros = 0;
  sumaTotal = 0;
  colorDiagnostico = "";
  diagnostico = "";
  constructor(
    private triajeSvc: TriajeService,
    private personaSvc: PersonaService,
    private familiaSvc: FamiliaService,
    private router: Router, private route: ActivatedRoute,
    private loadingSvc: LoadingService,
  ) {
    this.idFamilia = this.route.snapshot.params.idFamilia;

  }

  async ngOnInit() {
    try {
      await this.familiaSvc.getFamilia(this.idFamilia).subscribe(res => {
        this.familia = res;
      });

      await this.personaSvc.getPersonasFamilia(this.idFamilia).subscribe(res => {
        res.forEach(e => { this.obtenerUltimotriaje(e) });
        this.personas = res;
      });
    } catch (error) {
      console.log('error');
    }
  }
  obtenerUltimotriaje(p: Persona) {
    return this.triajeSvc.getUltimoTriajePersona(p.id).subscribe(f => {
      if (f[0]) {
        this.sumaMiembros += f[0].PuntajeParcial;
      }

      this.calcularDiagnostico();
      this.familia.PuntajeTotal = this.sumaTotal;
      this.familia.Diagnostico = this.diagnostico;

      this.familiaSvc.updateFamilia(this.familia, this.idFamilia);
      let obj = Object.assign(p, f[0]);
    })
  }
  calcularDiagnostico() {

    this.sumaTotal = this.sumaMiembros + this.familia.PuntajeParcialFA;
    if (this.sumaTotal > 10) {
      this.diagnostico = 'RIESGO ALTO';
      this.colorDiagnostico = 'danger';
    } else if (this.sumaTotal > 7) {
      this.diagnostico = 'RIESGO MODERADO';
      this.colorDiagnostico = 'warning';
    } else {
      this.diagnostico = 'RIESGO BAJO';
      this.colorDiagnostico = 'success'
    }
  }

  async download() {
    await this.loadingSvc.abrir();
    let calificacion = this.construirDatos(this.personas);
    let FA = this.construirFA();
    let colorCircle = this.colorDiagnostico === 'danger' ? '#ff0000' : (this.colorDiagnostico === 'success' ? '#2dd36f' : '#ff8c00');
    //contenido del archivo generado
    let docDefinition = {
      info: {
        title: 'CONSOLIDADO_FAMILIAR_DNI_' + this.familia.DNI,
        author: 'CENSO SANITARIO PITUMARCA',
        subject: this.familia.NombreEntrevistador,
        keywords: 'Consolidado Familiar generado por ' + this.familia.NombreEntrevistador + ' para la familia de ' + this.familia.DNI,
        creationDate: new Date(),
      },
      fontsize: 8,
      pageSize: 'A4',
      pageOrientation: 'landscape',   //portrait
      watermark: { text: 'Censo Sanitario Pitumarca', fontSize: 60, color: 'blue', opacity: 0.15, bold: true, italics: false, angle: -30 },
      footer: function (currentPage, pageCount) { return { text: 'Página ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center', fontsize: 8 } },
      content: [
        {
          text: 'CONSOLIDADO FAMILIAR',
          style: 'header',
          alignment: 'center'
        },
        {
          text: 'LLENADO POR EL SECTORISTA',
          style: 'subheader',
          alignment: 'center'
        },
        {
          text: 'CALIFICACIÓN DE LOS MIEMBROS DE LA FAMILIA',
          style: 'subheader',
        },
        {
          style: 'table',
          table: {
            heights: 10,
            widths: [15, 30, 50, 50, 40, 40, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
            body: calificacion,
          },
        },
        {
          text: 'FACTORES ANEXOS',
          style: 'subheader'
        },
        {
          style: 'small',
          table: {
            heights: 10,
            widths: [150, 100, 50],
            body: FA
          },
        },
        {
          text: 'DIAGNÓSTICO',
          style: 'subheader'
        },
        {
          style: 'small',
          table: {
            heights: 10,
            widths: [250, 50,100],
            body: [
              [{ text: 'CALIFICACIÓN', fillColor: '#cccccc', bold: true }, { text: 'PUNTAJE', alignment: 'right', fillColor: '#cccccc', bold: true },{ text: 'DIAGNÓSTICO', fillColor: '#cccccc', bold: true, alignment:'center' } ],
              ['CALIFICACIÓN DE LOS MIEMBROS DE LA FAMILIA', {text: this.sumaMiembros + ' PUNTOS', alignment:'right'}, { text: this.diagnostico, bold: true, fontSize:10, alignment:'center', border:[true,true,true, false]}],
              ['CALIFICACIÓN FACTORES ANEXOS', {text: this.familia.PuntajeParcialFA +' PUNTOS', alignment:'right'},{ canvas: [ { type: 'rect', x: 40, y: 0, w: 20, h: 20, color: colorCircle, r: 20} ], rowSpan: 2, border: [true,false,true,true]  }],
              [{ text: 'TOTAL', alignment:'center',bold: true }, { text: this.sumaTotal + ' PUNTOS', alignment: 'right', bold: true }],
            ]
          },
        },
        {
          text: 'PLAN BÁSICO DE ACCIÓN',
          style: 'subheader',
        },
        {
          text: ['AISLAMIENTO DEL MIEMBRO FAMILIAR EN RIESGO\n',
            'CAPACITACIÓN FAMILIAR \n',
            'RECONOCIMIENTOS GENERALES: MASCARILLA, LAVADO DE MANOS, NO TOSER LIBREMENTE \n',
            'CONTROL DE TEMPERATURA \n'],
          style: 'small'
        },

      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true
        },
        subheader: {
          fontSize: 9,
          bold: true
        },
        quote: {
          italics: true
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
    this.pdfObject.download('CONSOLIDADO_FAMILIAR_DNI_' + this.familia.DNI);
    this.loadingSvc.cerrar();
  }

  construirDatos(data) {
    var body = [];
    let columns = ["Nro", "VinculoFamiliar", "ApellidoPaterno", "ApellidoMaterno", "Nombres", "DNI", "Edad"];
    let filaTotal: any[] = [0, 0, 0, 0, 0, 0, 0];
    if (data.length > 0) {
      let aux = data[0].Items;
      aux.forEach(i => {
        if (parseFloat(i.Puntos) > 0) {
          columns.push(i.Item);
          filaTotal.push(0);
          return true
        }
        return false;
      })
      columns.push('PuntajeParcial');
      body.push(columns);
      let nro = 1;
      data.forEach(function (row) {
        var dataRow = [];
        dataRow.push(nro);

        nro++;
        columns.forEach(function (column) {
          if (row[column] && column !== "PuntajeParcial") {
            dataRow.push({ text: row[column].toString(), alignment: 'left' });
          }
        })

        if (row['Items']) {
          row['Items'].forEach((i) => {
            columns.forEach(function (col, index) {
              if (i.Item === col) {
                if (i.Estado) {
                  let medida = i.Medida.toLowerCase().replace(/\s/g, '');
                  if (!((medida === '%spo2' || medida === 'spo2') && parseFloat(i.Valor) >= 95)) {
                    dataRow.push(i.Puntos.toString());
                    filaTotal[index] += i.Puntos;
                  } else {
                    dataRow.push('0');
                    filaTotal[index] += 0;
                  }
                }
                else {
                  dataRow.push('0');
                  filaTotal[index] += 0;
                }
              }
            })
          })
        } else {
          columns.forEach(function (col, index) {
            if ((!row[col]) && col !== 'Nro' && col !== "PuntajeParcial") {
              dataRow.push('0');
              filaTotal[index] += 0;
            }
          })
        }
        dataRow.push(row['PuntajeParcial'] ? row['PuntajeParcial'] : '0');
        body.push(dataRow);
      });
    }
    let titulos = body[0].map(element => {
      return { text: element, alignment: 'left', bold: true, fillColor: '#CCCCCC' }
    });
    body[0] = titulos;
    filaTotal[0] = { colSpan: 7, text: 'TOTAL', alignment: 'center', bold: true };
    filaTotal.push({ text: (this.sumaMiembros), bold: true, alignment: 'right' });
    body.push(filaTotal)
    return body;
  }

  construirFA() {

    let split1NivelNacimiento = this.familia.NivelNacimiento.split('[');
    let split2DistanciaCentroMedico = this.familia.DistanciaCentroMedico.split('[');
    let body = [
      [{ text: 'FACTOR ANEXO', alignment: 'left', bold: true, fillColor: '#CCCCCC', }, { text: 'VALOR', alignment: 'left', bold: true, fillColor: '#CCCCCC', }, { text: 'PUNTAJE', alignment: 'right', bold: true, fillColor: '#CCCCCC', }],
      ['NIVEL DE NACIMIENTO', split1NivelNacimiento[0], { text: split1NivelNacimiento[1].replace(']-', ' '), alignment: 'right' }],
      ['DISTANCIA AL CENTRO MÉDICO', split2DistanciaCentroMedico[0], { text: split2DistanciaCentroMedico[1].replace(']-', ' '), alignment: 'right' }],
    ]
    this.familia.ServiciosVivienda.forEach(i => {
      let splitSB = i.split('[');
      body.push([{ text: 'SERVICIOS BÁSICOS' }, splitSB[0], { text: splitSB[1].replace(']-', ' '), alignment: 'right' }]);
    })
    body.push([{ text: 'TOTAL', colSpan: 2, alignment: 'center', bold: true }, '', { text: this.familia.PuntajeParcialFA + ' PUNTOS', bold: true, alignment: 'right' }]);

    return body;
  }
  antecedentes(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }
  volverFamilias() {
    this.router.navigate(["home/familia"]);
  }
}
