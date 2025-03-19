import { Injectable } from '@angular/core';
import { RouteData } from '../types/route-data.interface';
import {
  AgencyDetails,
  CalendarDetails,
  GTFSData,
  GTFSFiles,
  RouteDetails,
  StopDetails,
} from '../types/gtfs.interface';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ExcelUtilsService } from './excel-utils.service';

@Injectable({
  providedIn: 'root',
})
export class GtfsService {
  constructor(private excelUtilsService: ExcelUtilsService) {}

  gtfsData: GTFSData = {
    agency: AGENCY_DATA,
    calendar: CALENDAR_DATA,
    routes: [],
    stops: [],
  };

  gtfsFiles: GTFSFiles = {
    agency: '',
    calendar: '',
    routes: '',
    stops: '',
  };

  // serviceRoutes: RouteDetails[] = [];
  stops: StopDetails[] = [];

  extractGTFSInfo() {
    this.extractRoutes();
    this.extractStops();
  }

  extractRoutes() {
    const routes = this.excelUtilsService.routes;
    let i = 0;
    for (const route of routes) {
      i += 1;
      const routeID: string = `BST${i.toString().padStart(2, '0')}`;
      const routeShortName: string = this.getRouteShortName(route);
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

  getRouteShortName(route: string): string {
    const [start, end] = route.split('-');

    // the first character of the space separated words
    const startShort = start
      .split(' ')
      .map((word) => word[0])
      .join('');
    const endShort = end
      .split(' ')
      .map((word) => word[0])
      .join('');

    return `${startShort}-${endShort}`;
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

  downloadGTFS() {
    this.extractGTFSInfo();
    const zip = new JSZip();
    // covert the objects to GTFS files
    for (const [filename, data] of Object.entries(this.gtfsData)) {
      const fileContent = this.createFiles(data);
      zip.file(`${filename}.txt`, fileContent);
    }
    // zip and download the files
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // saveAs from FileSaver will download the zip
      saveAs(content, 'gtfs_schedule.zip');
    });
  }

  createFiles(data: any[]): string {
    let fileContent = '';
    if (data.length > 0) {
      const keys = Object.keys(data[0]);
      fileContent += keys.join(',') + '\n';
      for (const item of data) {
        const values = Object.values(item);
        fileContent += values.join(',') + '\n';
      }
    }
    return fileContent;
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
    sunday: 1,
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
