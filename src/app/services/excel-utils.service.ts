import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { read, utils, WorkSheet } from 'xlsx';
import { Inject } from '@angular/core';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class ExcelUtilsService {
  constructor(private messageService: MessageService) {}

  route_data: RouteData = {};

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
      const schedule_name = wsname.replace(/(\.\s*)/g, '_');
      // console.log(`schedule_name = ${schedule_name}`);

      this.route_data[schedule_name] = this.processSheet(ws, wsname);
    }

    console.log(this.route_data);
  }

  processSheet(ws: WorkSheet, wsname: string): ScheduleData {
    const sheet_range = ws['!ref'];
    const last_row = parseInt(
      (sheet_range as string).split(':')[1].split('').slice(1).join('')
    );
    console.log(`last_row = ${last_row}`);

    return {
      ...this.extractDepotDetails(ws, wsname, last_row),
      route_schedule: this.extractRouteDetails(ws, wsname, last_row - 2),
    } as ScheduleData;
  }

  extractDepotDetails(
    ws: WorkSheet,
    wsname: string,
    last_row: number
  ): {
    depot_departure_details: DepotDetails;
    depot_arrival_details: DepotDetails;
  } {
    const depot_details_header = [
      'depot_name',
      'latitude',
      'longitude',
      'coordinate',
      'arrival_time',
      'departure_time',
    ];

    const depot_departure_index = `B6:J6`;
    const depot_arrival_index = `B${last_row}:J${last_row}`;

    const depot_departure_details: DepotDetails =
      utils.sheet_to_json<DepotDetails>(ws, {
        range: depot_departure_index,
        header: depot_details_header,
      })[0];
    const depot_arrival_details: DepotDetails =
      utils.sheet_to_json<DepotDetails>(ws, {
        range: depot_arrival_index,
        header: depot_details_header,
      })[0];

    return {
      depot_departure_details,
      depot_arrival_details,
    };
  }

  extractRouteDetails(
    ws: WorkSheet,
    wsname: string,
    last_row: number
  ): RouteSchedule[] {
    const route_data: RouteSchedule[] = [];

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

    for (let i = 8; i <= last_row; i++) {
      const ws_data: RouteSchedule = utils.sheet_to_json<RouteSchedule>(ws, {
        range: `B${i}:J${i}`,
        header: route_schedule_header,
      })[0];

      if (ws_data.round === 'BREAK TIME') {
        console.log(`Excluding BREAK_TIME at index ${i}`);
        continue;
      }

      route_data.push(ws_data);
    }

    return route_data;
  }
}

// create interface for the route schedule
export interface RouteSchedule {
  round: string;
  num: number;
  direction: string;
  bus_stop: string;
  latitude: number | string;
  longitude: number | string;
  coordinate: string | number;
  arrival_time: string | Date;
  departure_time: string | Date;
}

export interface DepotDetails {
  depot_name: string;
  latitude: number | string;
  longitude: number | string;
  coordinate: string | number;
  arrival_time: string | Date;
  departure_time: string | Date;
}

export interface ScheduleData {
  depot_departure_details: DepotDetails;
  depot_arrival_details: DepotDetails;
  route_schedule: RouteSchedule[];
}

export interface RouteData {
  [schedule_name: string]: ScheduleData;
}
