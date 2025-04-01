import { Injectable } from '@angular/core';
import { BusScheduleData, RouteSchedule } from '../types/route-data.interface';
import {
  AgencyDetails,
  CalendarDetails,
  GTFSData,
  GTFSFiles,
  RouteDetails,
  ShapeDetails,
  StopDetails,
  StopTimeDetails,
  TripDetails,
} from '../types/gtfs.interface';
import { ExcelUtilsService } from './excel-utils.service';
import { GtfsUtilsService } from './gtfs-utils.service';

@Injectable({
  providedIn: 'root',
})
export class GtfsService {
  constructor(
    private excelUtilsService: ExcelUtilsService,
    private gtfsUtils: GtfsUtilsService
  ) {}

  gtfsData: GTFSData = {
    agency: AGENCY_DATA,
    calendar: CALENDAR_DATA,
    routes: [],
    stops: [],
    trips: [],
    stop_times: [],
    calendar_dates: [],
    shapes: [],
  };

  gtfsFiles: GTFSFiles = {
    agency: '',
    calendar: '',
    routes: '',
    stops: '',
    trips: '',
  };

  routeDirectionCodes: Map<String, Map<string, number>> = new Map();

  stops: StopDetails[] = [];

  trip_shapes: Map<string, string[]> = new Map();
  shape_trip_map: Map<string, string[]> = new Map();
  shape_ID_trip_ID_map: Map<string, string[]> = new Map();

  extractGTFSInfo() {
    this.extractRoutes();
    this.extractStops();
    this.extractTrips(this.excelUtilsService.busSchedule);
    this.extractShapes();
  }

  extractRoutes() {
    const routes = this.excelUtilsService.routes;
    let i = 0;
    for (const route of routes) {
      i += 1;
      const routeID: string = `BST${i.toString().padStart(2, '0')}`;
      const routeShortName: string = this.gtfsUtils.createRouteShortName(route);
      const routeDetails: RouteDetails = {
        route_id: routeID,
        agency_id: 'BST',
        route_short_name: routeShortName,
        route_long_name: route,
        route_type: 3,
        route_color: ROUTE_COLOURS[i - 1],
        route_text_color: '#FFFFFF',
      };
      this.gtfsData.routes.push(routeDetails);
    }
  }

  extractStops() {
    const stops = this.excelUtilsService.stops;
    let i = 0;
    for (const [key, value] of stops) {
      i = i + 1;
      const stopDetails: StopDetails = {
        stop_id: `HLT${i.toString().padStart(2, '0')}`,
        stop_code: key,
        stop_name: value.name,
        stop_desc: '',
        stop_lat: value.latitude,
        stop_lon: value.longitude,
        zone_id: 'SOLO',
        stop_url: '',
        location_type: 0,
        parent_station: '',
        stop_timezone: 'Asia/Jakarta',
        wheelchair_boarding: 0,
      };
      this.gtfsData.stops.push(stopDetails);
    }
  }

  extractTrips(busSchedule: BusScheduleData) {
    let trips: Map<string, TripDetails> = new Map();

    for (const [busName, scheduleData] of Object.entries(busSchedule)) {
      const routeSchedule = scheduleData.routeSchedule;

      for (const item of routeSchedule) {
        const normalisedRoute = this.gtfsUtils.normaliseRouteName(
          item.direction
        );
        const routeID = this.gtfsData?.routes?.find(
          (route) => route?.route_long_name === normalisedRoute
        )?.route_id;
        if (routeID) {
          const directionCode =
            this.getDirectionCode(routeID, item.direction) ?? 0;
          const tripID = this.gtfsUtils.createTripID(
            busName,
            routeID,
            item.round,
            directionCode
          );
          if (!trips.has(tripID)) {
            const tripDetails: TripDetails = {
              route_id: routeID,
              service_id: 'daily',
              trip_id: tripID,
              trip_headsign: item.direction,
              trip_short_name: '',
              direction_id: directionCode,
              block_id: busName,
              shape_id: '',
              wheelchair_accessible: 0,
              bikes_allowed: 0,
            };
            trips.set(tripID, tripDetails);
            this.gtfsData.trips.push(tripDetails);
          }
          // code to extract stops times
          this.extractStopTime(tripID, item);

          // code to extract shapes
          this.createShapeString(tripID, item);
        }
      }
    }
    console.log(trips.size);
    console.log(this.gtfsData.trips.length);
  }

  extractStopTime(tripID: string, routeObj: RouteSchedule) {
    const stopCode = this.gtfsUtils.generateStopCode(routeObj.busStop);
    const stopID = this.gtfsData.stops.find(
      (stop) => stop.stop_code === stopCode
    )?.stop_id;

    if (!stopID) {
      console.error(`Stop ID not found for stop code: ${stopCode}`);
    }

    try {
      const arrivalTime = routeObj.arrival
        ? this.gtfsUtils.parseTime(routeObj.arrival)
        : this.gtfsUtils.parseTime(routeObj.departure);
      const departureTime = routeObj.departure
        ? this.gtfsUtils.parseTime(routeObj.departure as Date)
        : '';
      const stopTimeDetails: StopTimeDetails = {
        trip_id: tripID,
        arrival_time: arrivalTime,
        departure_time: departureTime,
        stop_id: stopID ?? '',
        stop_sequence: routeObj.num,
        stop_headsign: '',
        timepoint: 1,
      };
      this.gtfsData.stop_times.push(stopTimeDetails);
    } catch (error) {
      console.error('Error parsing time:', error, routeObj);
      console.log((routeObj.arrival as string).length, typeof routeObj.arrival);
      console.log(
        (routeObj.departure as string).length,
        typeof routeObj.departure
      );
      return;
    }
  }

  createShapeString(tripID: string, routeObj: RouteSchedule) {
    // create shape string with lat, lon, and stop sequence
    const coordinates = (routeObj.coordinate as string).trim().split(',');
    const lat = parseFloat(coordinates[0]);
    const lon = parseFloat(coordinates[1]);
    const shape_string = `${routeObj.num}_${lat}_${lon}`;

    if (!this.trip_shapes.has(tripID)) {
      this.trip_shapes.set(tripID, []);
    }

    const shapeArray = this.trip_shapes.get(tripID);
    shapeArray?.push(shape_string);
    this.trip_shapes.set(tripID, shapeArray ?? []);
  }

  extractShapes() {
    console.log(this.trip_shapes.size);
    console.log(this.trip_shapes);
    this.createShapeMap(this.trip_shapes);
    console.log(this.shape_trip_map.size);
    console.log(this.shape_trip_map);
    let ID = 0;
    for (const [shapeString, tripIDs] of this.shape_trip_map.entries()) {
      // create shape entry
      const shapeID = `SHP${ID.toString().padStart(2, '0')}`;
      ID += 1;
      this.shape_ID_trip_ID_map.set(shapeID, tripIDs);
      shapeString.split('|').map((point) => {
        const [stopSequence, lat, lon] = point.split('_');
        const shapeDetail: ShapeDetails = {
          shape_id: shapeID,
          shape_pt_lat: parseFloat(lat),
          shape_pt_lon: parseFloat(lon),
          shape_pt_sequence: parseInt(stopSequence, 10),
          shape_dist_traveled: 0,
        };
        this.gtfsData.shapes.push(shapeDetail);
      });
    }
  }

  createShapeMap(tripShape: Map<string, string[]>) {
    for (const [tripID, shapeArray] of tripShape.entries()) {
      const shape_string = shapeArray.join('|');
      if (!this.shape_trip_map.has(shape_string)) {
        this.shape_trip_map.set(shape_string, []);
      }
      const tripIDs = this.shape_trip_map.get(shape_string);
      tripIDs?.push(tripID);
      this.shape_trip_map.set(shape_string, tripIDs ?? []);
    }
  }

  getDirectionCode(routeID: string, direction: string): number | undefined {
    if (!this.routeDirectionCodes.has(routeID)) {
      this.routeDirectionCodes.set(routeID, new Map().set(direction, 0));
      return 0;
    }
    if (
      this.routeDirectionCodes.has(routeID) &&
      this.routeDirectionCodes.get(routeID)?.has(direction)
    ) {
      return this.routeDirectionCodes.get(routeID)?.get(direction);
    }
    const code = this.routeDirectionCodes.get(routeID)?.size ?? 0;
    this.routeDirectionCodes.get(routeID)?.set(direction, code);
    return code;
  }

  downloadGTFS() {
    this.gtfsUtils.saveAsZip(this.gtfsData);
  }
}

export const AGENCY_DATA: AgencyDetails[] = [
  {
    agency_id: 'BST',
    agency_name: 'Batik Solo Trans',
    agency_url: 'https://pariwisatasolo.surakarta.go.id',
    agency_timezone: 'Asia/Jakarta',
    agency_lang: 'en',
    agency_phone: '',
    agency_fare_url: 'https://pariwisatasolo.surakarta.go.id/',
    agency_email: '',
  },
];

export const CALENDAR_DATA: CalendarDetails[] = [
  {
    service_id: 'daily',
    monday: 1,
    tuesday: 1,
    wednesday: 1,
    thursday: 1,
    friday: 1,
    saturday: 1,
    sunday: 0,
    start_date: '20250101',
    end_date: '20301231',
  },
];

export const ROUTE_COLOURS: string[] = [
  '#FF0000',
  '#FFA500',
  '#FFFF00',
  '#008000',
  '#0000FF',
  '#4B0082',
];
