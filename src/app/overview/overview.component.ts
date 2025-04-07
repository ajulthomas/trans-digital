import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DataTableComponent } from '../data-table/data-table.component';
import { BusScheduleData } from '../types/route-data.interface';
import { ExcelUtilsService } from '../services/excel-utils.service';
import { MatTableModule } from '@angular/material/table';
import { GtfsUtilsService } from '../services/gtfs-utils.service';

@Component({
  selector: 'app-overview',
  imports: [MatExpansionModule, DataTableComponent, MatTableModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  data: BusScheduleData = {};
  busNames: string[] = [];

  depoDetailsDisplayedColumns: string[] = [
    'depo',
    'latitude',
    'longitude',
    'coordinate',
    'arrival',
    'departure',
  ];
  depoDetailsColumnNames: { [fieldName: string]: string } = {
    depo: 'Depot',
    latitude: 'Latitude',
    longitude: 'Longitude',
    coordinate: 'Coordinate',
    arrival: 'Arrival',
    departure: 'Departure',
  };
  displayedColumns: string[] = [
    'round',
    'num',
    'direction',
    'busStop',
    'latitude',
    'longitude',
    'coordinate',
    'arrival',
    'departure',
  ];
  columnNames: { [fieldName: string]: string } = {
    round: 'Round',
    num: 'Number',
    direction: 'Direction',
    busStop: 'Bus Stop',
    latitude: 'Latitude',
    longitude: 'Longitude',
    coordinate: 'Coordinate',
    arrival: 'Arrival',
    departure: 'Departure',
  };

  constructor(
    private excelService: ExcelUtilsService,
    private gtfsUtilsService: GtfsUtilsService
  ) {
    this.data = this.excelService.busSchedule;
    this.busNames = Object.keys(this.data);
  }

  getTime(date: string | Date): string {
    if (!date) return '--:--';
    return this.gtfsUtilsService.parseTime(date);
  }
}
