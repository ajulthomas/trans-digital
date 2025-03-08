import { Injectable } from '@angular/core';
import { RouteData } from '../types/route-data.interface';
import { ServiceRouteDetails, StopDetails } from '../types/gtfs.interface';

@Injectable({
  providedIn: 'root',
})
export class GtfsService {
  constructor() {}

  serviceRoutes: ServiceRouteDetails[] = [];
  stops: StopDetails[] = [];

  processGTFSInfo(routeData: RouteData) {}

  extractRoutes(routeData: RouteData) {}

  extractStops(routeData: RouteData) {}
}
