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

@Injectable({
  providedIn: 'root',
})
export class GtfsService {
  constructor() {}

  gtfsData: GTFSData = {
    agency: AGENCY_DATA,
    calendar: CALENDAR_DATA,
  };

  gtfsFiles: GTFSFiles = {
    agency: '',
    calendar: '',
  };

  serviceRoutes: RouteDetails[] = [];
  stops: StopDetails[] = [];

  processGTFSInfo(routeData: RouteData) {
    this.extractRoutes(routeData);
    this.extractStops(routeData);
  }

  extractRoutes(routeData: RouteData) {}

  extractStops(routeData: RouteData) {}

  downloadGTFS() {
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
    const keys = Object.keys(data[0]);
    fileContent += keys.join(',') + '\n';
    for (const item of data) {
      const values = Object.values(item);
      fileContent += values.join(',') + '\n';
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
    // agency_phone: '',
    // agency_fare_url: 'https://pariwisatasolo.surakarta.go.id/',
    // agency_email: '',
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
