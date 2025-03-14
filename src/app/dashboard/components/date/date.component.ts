import { Component } from '@angular/core';

@Component({
  selector: 'app-date',
  imports: [],
  templateUrl: './date.component.html',
  styleUrl: './date.component.scss'
})
export class DateComponent {
  dateString:string = '';
  date:Date = new Date();
  constructor() { }

  ngOnInit(): void {
    //generar la fecha escrita
    var weekday = new Array(7);
    weekday[0] = "Domingo";
    weekday[1] = "Lunes";
    weekday[2] = "Martes";
    weekday[3] = "Miércoles";
    weekday[4] = "Jueves";
    weekday[5] = "Viernes";
    weekday[6] = "Sábado";
    
    var month = new Array(12);
    month[0] = "Enero";
    month[1] = "Febrero";
    month[2] = "Marzo";
    month[3] = "Abril";
    month[4] = "Mayo";
    month[5] = "Junio";
    month[6] = "Julio";
    month[7] = "Agosto";
    month[8] = "Septiembre";
    month[9] = "Octubre";
    month[10] = "Noviembre";
    month[11] = "Diciembre";

    var day = weekday[this.date.getDay()];
    var dayNumber = this.date.getDate();
    var monthName = month[this.date.getMonth()];
    var year = this.date.getFullYear();

    var date = day + ", " + dayNumber + " de " + monthName + " de " + year;
    this.dateString = date;
  }

}
