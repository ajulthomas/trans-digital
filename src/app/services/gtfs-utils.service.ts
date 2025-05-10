import { Injectable } from '@angular/core';
import { GTFSData } from '../types/gtfs.interface';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class GtfsUtilsService {
  constructor() {}

  normaliseRouteName(direction: string): string {
    const [pointA, pointB] = direction.split('-').map((point) => point.trim());
    const normalisedRoute = [pointA, pointB].sort().join(' - ');
    return normalisedRoute;
  }

  createRouteShortName(route: string): string {
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

  createTripID(
    busName: string,
    routeID: string,
    round: string,
    directionCode: number
  ): string {
    // future notes:
    // add padding to the round number, if the no. of rounds per day is more than 9
    return `${busName}_${routeID}_R${round.at(-1)}_${directionCode}`;
  }

  generateStopCode(stopName: string): string {
    return stopName.trim().toLocaleLowerCase().split(' ').join('_');
  }

  parseTime(dateTime: Date | string): string {
    // if the dateTime is a string, convert it to Date object
    if (typeof dateTime === 'string' && dateTime.length > 2) {
      // create a new date object with time as dateTime, it could be in just HH or HH:MM format or HH:MM:SS format
      const [hours, minutes, seconds] = dateTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes || 0, seconds || 0); // set seconds to 0 if not provided

      dateTime = date;
    }

    const hours = (dateTime as Date).getHours().toString().padStart(2, '0');
    const minutes = (dateTime as Date).getMinutes().toString().padStart(2, '0');
    const seconds = (dateTime as Date).getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
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

  saveAsZip(gtfsData: GTFSData) {
    const zip = new JSZip();
    // covert the objects to GTFS files
    for (const [filename, data] of Object.entries(gtfsData)) {
      console.log(`Creating ${filename}.txt with ${data.length} records`);
      const fileContent = this.createFiles(data);
      zip.file(`${filename}.txt`, fileContent);
    }
    // zip and download the files
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // saveAs from FileSaver will download the zip
      saveAs(content, 'gtfs_schedule.zip');
    });
  }
}
