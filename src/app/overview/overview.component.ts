import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BusScheduleData } from '../types/route-data.interface';
import { ExcelUtilsService } from '../services/excel-utils.service';
import { MatTableModule } from '@angular/material/table';
import { GtfsUtilsService } from '../services/gtfs-utils.service';
import { GtfsService } from '../services/gtfs.service';

@Component({
  selector: 'app-overview',
  imports: [MatExpansionModule, MatTableModule],
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

  stats: { [key: string]: number } = {
    buses: 0,
    busStops: 0,
    routes: 0,
    // shapes: 0,
    trips: 0,
  };

  statDisplayLabels: { [key: string]: string } = {
    buses: 'Buses',
    busStops: 'Bus Stops',
    routes: 'Routes',
    // shapes: 'Shapes',
    trips: 'Trips',
  };

  constructor(
    private excelService: ExcelUtilsService,
    private gtfsUtilsService: GtfsUtilsService,
    private gtfsService: GtfsService
  ) {
    this.data = this.excelService.busSchedule;
    this.busNames = Object.keys(this.data);
    this.stats = {
      buses: this.busNames.length,
      routes: this.gtfsService.gtfsData.routes.length,
      trips: this.gtfsService.gtfsData.trips.length,
      busStops: this.gtfsService.gtfsData.stops.length,
      // shapes: this.gtfsService.gtfsData.shapes.length,
    };
  }

  getTime(date: string | Date): string {
    if (!date) return '--:--';
    return this.gtfsUtilsService.parseTime(date);
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj).filter((key) => obj[key] !== '');
  }
}
