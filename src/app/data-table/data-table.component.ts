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
      case 'stop_times':
        return this.gtfsService.gtfsData.stop_times;
      case 'shapes':
        return this.gtfsService.gtfsData.shapes;
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
    'shape_id',
    'wheelchair_accessible',
    'bikes_allowed',
  ],
  stop_times: [
    'trip_id',
    'stop_sequence',
    'stop_id',
    'arrival_time',
    'departure_time',
    // 'stop_headsign',
    // 'pickup_type',
    // 'drop_off_type',
    // 'shape_dist_traveled',
    // 'timepoint',
  ],
  shapes: [
    'shape_id',
    'shape_pt_sequence',
    'shape_pt_lat',
    'shape_pt_lon',
    // 'shape_dist_traveled',
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
  stop_times: {
    trip_id: 'Trip ID',
    stop_sequence: 'Sequence',
    stop_id: 'Stop ID',
    arrival_time: 'Arrival Time',
    departure_time: 'Departure Time',
    // stop_headsign: 'Headsign',
    // pickup_type: 'Pickup Type',
    // drop_off_type: 'Drop Off Type',
    // shape_dist_traveled: 'Distance Traveled',
    // timepoint: 'Time Point',
  },
  shapes: {
    shape_id: 'ID',
    shape_pt_sequence: 'Sequence',
    shape_pt_lat: 'Latitude',
    shape_pt_lon: 'Longitude',
    // shape_dist_traveled: 'Distance Traveled',
  },
};
