import { Component, input } from '@angular/core';
import {
  RouteDetails,
  StopDetails,
  TripDetails,
} from '../types/gtfs.interface';
import { GtfsService } from '../services/gtfs.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'data-table',
  imports: [MatCardModule, MatTableModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent {
  constructor(private gtfsService: GtfsService) {}

  datatype = input.required<string>();

  displayedColumns: string[] = [];
  columnNames: { [fieldName: string]: string } = {};
  dataSource: any[] = [];

  ngOnInit() {
    this.displayedColumns = DISPLAYED_COLS[this.datatype()];
    this.columnNames = COLUMN_NAMES[this.datatype()];
    this.dataSource = this.getGTFSData();
    console.log(this.dataSource);
  }

  getGTFSData(): any[] {
    switch (this.datatype()) {
      case 'routes':
        return this.gtfsService.gtfsData.routes;
      case 'stops':
        return this.gtfsService.gtfsData.stops;
      case 'trips':
        return this.gtfsService.gtfsData.trips;
      default:
        return [];
    }
  }
}

const DISPLAYED_COLS: { [key: string]: string[] } = {
  routes: [
    'route_id',
    'agency_id',
    'route_short_name',
    'route_long_name',
    // 'route_desc',
    'route_type',
    // 'route_url',
    // 'route_color',
    // 'route_text_color',
  ],
  stops: [
    'stop_id',
    'stop_code',
    'stop_name',
    // 'stop_desc',
    'stop_lat',
    'stop_lon',
    'zone_id',
    // 'stop_url',
    'location_type',
    // 'parent_station',
    'stop_timezone',
    'wheelchair_boarding',
  ],
  trips: [
    'route_id',
    'service_id',
    'trip_id',
    'trip_headsign',
    // 'trip_short_name',
    'direction_id',
    'block_id',
    // 'shape_id',
    'wheelchair_accessible',
    'bikes_allowed',
  ],
};

const COLUMN_NAMES: { [key: string]: { [fieldName: string]: string } } = {
  routes: {
    route_id: 'ID',
    agency_id: 'Agency ID',
    route_short_name: 'Short Name',
    route_long_name: 'Long Name',
    route_desc: 'Description',
    route_type: 'Type',
    route_url: 'URL',
    route_color: 'Color',
    route_text_color: 'Text Color',
  },
  stops: {
    stop_id: 'ID',
    stop_code: 'Code',
    stop_name: 'Name',
    stop_desc: 'Description',
    stop_lat: 'Latitude',
    stop_lon: 'Longitude',
    zone_id: 'Zone ID',
    stop_url: 'URL',
    location_type: 'Location Type',
    parent_station: 'Parent Station',
    stop_timezone: 'Timezone',
    wheelchair_boarding: 'Wheelchair Boarding',
  },
  trips: {
    route_id: 'Route ID',
    service_id: 'Service ID',
    trip_id: 'ID',
    trip_headsign: 'Headsign',
    trip_short_name: 'Short Name',
    direction_id: 'Direction ID',
    block_id: 'Block ID',
    shape_id: 'Shape ID',
    wheelchair_accessible: 'Wheelchair Accessible',
    bikes_allowed: 'Bikes Allowed',
  },
};
