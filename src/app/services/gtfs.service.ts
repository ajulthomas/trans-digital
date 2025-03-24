import { Injectable } from '@angular/core';
import { BusScheduleData, RouteSchedule } from '../types/route-data.interface';
import {
  AgencyDetails,
  CalendarDetails,
  GTFSData,
  GTFSFiles,
  RouteDetails,
  StopDetails,
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
  };

  gtfsFiles: GTFSFiles = {
    agency: '',
    calendar: '',
    routes: '',
    stops: '',
    trips: '',
  };

  routeDirectionCodes: Map<String, Map<string, number>> = new Map();

  // serviceRoutes: RouteDetails[] = [];
  stops: StopDetails[] = [];

  extractGTFSInfo() {
    this.extractRoutes();
    this.extractStops();
    this.extractTrips(this.excelUtilsService.busSchedule);
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
        }
      }
    }
    console.log(trips.size);
    console.log(this.gtfsData.trips.length);
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
