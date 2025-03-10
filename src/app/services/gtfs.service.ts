import { Injectable } from '@angular/core';
import { RouteData } from '../types/route-data.interface';
import {
  AgencyDetails,
  ServiceRouteDetails,
  StopDetails,
} from '../types/gtfs.interface';

@Injectable({
  providedIn: 'root',
})
export class GtfsService {
  constructor() {}

  serviceRoutes: ServiceRouteDetails[] = [];
  stops: StopDetails[] = [];

  processGTFSInfo(routeData: RouteData) {
    this.extractRoutes(routeData);
    this.extractStops(routeData);
  }

  extractRoutes(routeData: RouteData) {}

  extractStops(routeData: RouteData) {}
}

export const AGENCY_DATA: AgencyDetails[] = [
  {
    agencyId: 'BST',
    agencyName: 'Batik Solo Trans',
    agencyUrl:
      'https://pariwisatasolo.surakarta.go.id/wp-content/uploads/2019/01/Transit-Map-Solo.pdf',
    agencyTimezone: 'Asia/Jakarta',
    agencyLang: 'en',
    agencyPhone: '',
    agencyFareUrl: 'https://pariwisatasolo.surakarta.go.id/',
    agencyEmail: '',
  },
];
