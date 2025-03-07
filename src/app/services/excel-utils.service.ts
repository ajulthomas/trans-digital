import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { read, utils, WorkSheet } from 'xlsx';
import { Inject } from '@angular/core';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class ExcelUtilsService {
  constructor(private messageService: MessageService) {}

  routeData: RouteData = {};

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
    const workbook = read(data, { type: 'array', cellDates: true });
    const wsnames = workbook.SheetNames;
    console.log(wsnames);
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
  }

  processSheet(ws: WorkSheet, wsname: string): ScheduleData {
    const sheet_range = ws['!ref'];
    const lastRow = parseInt(
      (sheet_range as string).split(':')[1].split('').slice(1).join('')
    );
    console.log(`lastRow = ${lastRow}`);

    this.extractDepotDetails(ws, wsname, lastRow);
    // this.extractRouteDetails(ws, wsname, lastRow);

    // return {
    //   ...this.extractDepotDetails(ws, wsname, lastRow),
    //   route_schedule: this.extractRouteDetails(ws, wsname, lastRow - 2),
    // } as ScheduleData;

    return {} as ScheduleData;
  }

  extractDepotDetails(ws: WorkSheet, wsname: string, lastRow: number): any {
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
        if (value === '') {
          continue;
        }
        const cleanedKey = key.trim().toLowerCase().replace(/\s/g, '_');
        depoSchedule[cleanedKey] = value;
      }
      cleanedData.push(depoSchedule);
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

    const route_schedule_header = [
      'round',
      'num',
      'direction',
      'bus_stop',
      'latitude',
      'longitude',
      'coordinate',
      'arrival_time',
      'departure_time',
    ];

    for (let i = 8; i <= lastRow; i++) {
      const ws_data: RouteSchedule = utils.sheet_to_json<RouteSchedule>(ws, {
        range: `B${i}:J${i}`,
        header: route_schedule_header,
        defval: '',
      })[0];

      if (ws_data.round === 'BREAK TIME') {
        console.log(`Excluding BREAK_TIME at index ${i}`);
        continue;
      }

      routeData.push(ws_data);
    }

    return routeData;
  }
}

// create interface for the route schedule
export interface RouteSchedule {
  round: string;
  num: number;
  direction: string;
  busStop: string;
  latitude: number | string;
  longitude: number | string;
  coordinate: string | number;
  arrivalTime: string | Date;
  departureTime: string | Date;
}

export interface DepotDetails {
  depotName: string;
  latitude: number | string;
  longitude: number | string;
  coordinate: string | number;
  arrivalTime: string | Date;
  departureTime: string | Date;
}

export interface ScheduleData {
  depotDepartureDetails: DepotDetails;
  depotArrivalDetails: DepotDetails;
  routeSchedule: RouteSchedule[];
}

export interface RouteData {
  [scheduleName: string]: ScheduleData;
}
