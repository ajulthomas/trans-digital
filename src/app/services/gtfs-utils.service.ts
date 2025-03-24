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
    return `${busName}_${routeID}_R${round.at(-1)}_${directionCode}`;
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
