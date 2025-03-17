import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { read, utils, WorkSheet } from 'xlsx';
import { MessageService } from './message.service';
import {
  DepotDetails,
  RouteData,
  RouteSchedule,
  ScheduleData,
} from '../types/route-data.interface';

@Injectable({
  providedIn: 'root',
})
export class ExcelUtilsService {
  constructor(private messageService: MessageService) {}

  routeData: RouteData = {};
  routes: Set<string> = new Set();
  stops: Set<string> = new Set();

  readFile(file: File, progress: WritableSignal<number> = signal<number>(0)) {
    const reader = new FileReader();
    reader.onload = () => {
      progress.set(100);
      this.messageService.showMessage('File read successfully 🚀');
      const data: ArrayBuffer = new Uint8Array(reader.result as ArrayBuffer);
      this.processFile(data);
    };
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        progress.set(percent);
      }
    };
    reader.onerror = (error) => {
      console.error(error);
      this.messageService.showMessage(
        'Some error occured, please try again',
        'error'
      );
    };
    reader.readAsArrayBuffer(file);
  }

  processFile(data: ArrayBuffer) {
    try {
      const workbook = read(data, { type: 'array', cellDates: true });
      const wsnames = workbook.SheetNames;
      // console.log(wsnames);
      // const ws = workbook.Sheets[wsnames[0]];

      for (const wsname of wsnames) {
        const ws = workbook.Sheets[wsname];
        this.processSheet(ws, wsname);

        // remove all dots and spaces from the sheet name
        const scheduleName = wsname.replace(/(\.\s*)/g, '_');
        // console.log(`scheduleName = ${scheduleName}`);

        this.routeData[scheduleName] = this.processSheet(ws, wsname);
      }
      console.log(this.routeData);
      console.log(this.routes);
    } catch (error) {
      console.error(error);
      this.messageService.showMessage(
        'An error occured while processing the file. Please check the file and try again',
        'error'
      );
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
        ? (currentRound = wsData.round)
        : (wsData.round = currentRound as string);

      wsData.direction !== ''
        ? (currentDirection = wsData.direction)
        : (wsData.direction = currentDirection as string);

      wsData.latitude = (wsData.latitude as string).trim();
      wsData.longitude = (wsData.longitude as string).trim();
      wsData.coordinate = (wsData.coordinate as string).trim();

      this.addRoute(wsData.direction);
      routeData.push(wsData);
    }

    return routeData;
  }

  addRoute(direction: string) {
    const [pointA, pointB] = direction.split('-').map((point) => point.trim());
    const normalisedRoute = [pointA, pointB].sort().join(' - ');
    this.routes.add(normalisedRoute);
  }

  // end of class
}
