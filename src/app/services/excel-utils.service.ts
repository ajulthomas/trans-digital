import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { read, utils, WorkSheet } from 'xlsx';
import { MessageService } from './message.service';
import {
  DepotDetails,
  BusScheduleData,
  RouteSchedule,
  ScheduleData,
} from '../types/route-data.interface';
import { GtfsUtilsService } from './gtfs-utils.service';

@Injectable({
  providedIn: 'root',
})
export class ExcelUtilsService {
  constructor(
    private messageService: MessageService,
    private gtfsUtils: GtfsUtilsService
  ) {}

  busSchedule: BusScheduleData = {};
  routes: Set<string> = new Set();
  stops: Map<string, BusStopData> = new Map();
  currentFileValid: WritableSignal<boolean> = signal<boolean>(false);

  updateFileValidity() {
    if (this.routes.size > 0 && this.stops.size > 0) {
      this.currentFileValid.set(true);
    } else {
      this.currentFileValid.set(false);
    }
  }

  processFile(data: ArrayBuffer) {
    const start = performance.now();
    try {
      const workbook = read(data, { type: 'array', cellDates: true });
      const wsnames = workbook.SheetNames;
      // console.log(wsnames);
      // const ws = workbook.Sheets[wsnames[0]];

      for (const wsname of wsnames) {
        const ws = workbook.Sheets[wsname];
        this.processSheet(ws, wsname);

        // remove all dots and spaces from the sheet name
        const busName = wsname.replace(/(\.\s*)/g, '_');
        // console.log(`busName = ${busName}`);

        this.busSchedule[busName] = this.processSheet(ws, wsname);
      }
      console.log(this.busSchedule);
      console.log(this.routes);
      console.log(this.stops);
      this.updateFileValidity();
    } catch (error) {
      console.error(error);
      this.messageService.showMessage(
        'An error occured while processing the file. Please check the file and try again',
        'error'
      );
      this.currentFileValid.set(false);
    } finally {
      const end = performance.now();
      console.log(`Time taken to process file: ${end - start}ms`);
    }
  }

  processSheet(ws: WorkSheet, wsname: string): ScheduleData {
    const sheet_range = ws['!ref'];
    const lastRow = parseInt(
      (sheet_range as string).split(':')[1].split('').slice(1).join('')
    );
    // console.log(`lastRow = ${lastRow}`);

    return {
      ...this.extractDepotDetails(ws, wsname, lastRow),
      routeSchedule: this.extractRouteDetails(ws, wsname, lastRow - 2),
    } as ScheduleData;
  }

  extractDepotDetails(
    ws: WorkSheet,
    wsname: string,
    lastRow: number
  ): {
    depotDepartureDetails: DepotDetails;
    depotArrivalDetails: DepotDetails;
  } {
    let ranges = [`B5:J6`, `B${lastRow - 1}:J${lastRow}`];
    let cleanedData = [];

    for (let range of ranges) {
      let data = utils.sheet_to_json<any>(ws, {
        range: range,
        defval: '',
      })[0];

      let depoSchedule: { [x: string]: any } = {};

      for (let key in data) {
        const value = data[key];
        if (value === '' && key.startsWith('__EMPTY')) {
          continue;
        }
        const cleanedKey = key.trim().toLowerCase().replace(/\s/g, '_');
        depoSchedule[cleanedKey] = value;
      }
      cleanedData.push(depoSchedule as DepotDetails);
    }

    const [depotDepartureDetails, depotArrivalDetails] = cleanedData;

    return {
      depotDepartureDetails,
      depotArrivalDetails,
    };
  }

  extractRouteDetails(
    ws: WorkSheet,
    wsname: string,
    lastRow: number
  ): RouteSchedule[] {
    const routeData: RouteSchedule[] = [];

    // get the keys from the interface
    const route_schedule_header = [
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

    let currentRound: unknown;
    let currentDirection: unknown;

    for (let i = 8; i <= lastRow; i++) {
      const wsData: RouteSchedule = utils.sheet_to_json<RouteSchedule>(ws, {
        range: `B${i}:J${i}`,
        header: route_schedule_header,
        defval: '',
      })[0];

      if (wsData.round === 'BREAK TIME') {
        // console.log(`Excluding BREAK_TIME at index ${i}`);
        continue;
      }

      wsData.round !== ''
        ? (currentRound = wsData.round.trim())
        : (wsData.round = currentRound as string);

      wsData.direction !== ''
        ? (currentDirection = wsData.direction.trim())
        : (wsData.direction = currentDirection as string);

      wsData.latitude = (wsData.latitude as string).trim();
      wsData.longitude = (wsData.longitude as string).trim();
      wsData.coordinate = (wsData.coordinate as string).trim();

      if (typeof wsData.arrival === 'string') {
        wsData.arrival = wsData.arrival.trim();
        // console.error('Invalid arrival time string provided:', wsData);
      }

      if (typeof wsData.departure === 'string') {
        wsData.departure = wsData.departure.trim();
        // console.error('Invalid departure time string provided:', wsData);
      }

      this.routes.add(this.gtfsUtils.normaliseRouteName(wsData.direction));
      this.addStops(wsData);
      routeData.push(wsData);
    }

    return routeData;
  }

  addStops(wsData: RouteSchedule) {
    const { busStop, coordinate } = wsData;
    const [latitude, longitude] = (coordinate as string).trim().split(',');
    const key = this.gtfsUtils.generateStopCode(busStop);
    if (this.stops.has(key)) {
      return;
    }
    this.stops.set(key, { name: busStop, latitude, longitude });
  }

  // end of class
}

export interface BusStopData {
  name: string;
  latitude: string;
  longitude: string;
}
