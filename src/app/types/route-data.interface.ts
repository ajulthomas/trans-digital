// create interface for the route schedule
export interface RouteSchedule {
  round: string;
  num: number;
  direction: string;
  busStop: string;
  latitude: number | string;
  longitude: number | string;
  coordinate: string | number;
  arrival: string | Date;
  departure: string | Date;
}

export interface DepotDetails {
  depo: string;
  latitude: number | string;
  longitude: number | string;
  coordinate: string | number;
  arrival: string | Date;
  departure: string | Date;
}

export interface ScheduleData {
  depotDepartureDetails: DepotDetails;
  depotArrivalDetails: DepotDetails;
  routeSchedule: RouteSchedule[];
}

export interface RouteData {
  [scheduleName: string]: ScheduleData;
}
