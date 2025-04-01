/**
 * @reference https://gtfs.org/documentation/schedule/reference/#routestxt
 */
export interface RouteDetails {
  route_id: string;
  agency_id: string;
  route_short_name: string;
  route_long_name: string;
  route_desc?: string;
  route_type: number; // will always be 3 for bus routes
  route_url?: string;
  route_color?: string;
  route_text_color?: string;
  route_sort_order?: string;
}

/**
 * @reference https://gtfs.org/documentation/schedule/reference/#stopstxt
 */
export interface StopDetails {
  stop_id: string;
  stop_code: string;
  stop_name: string;
  tts_stop_name?: string;
  stop_desc?: string;
  stop_lat: number | string;
  stop_lon: number | string;
  zone_id?: string;
  stop_url?: string;
  location_type?: number;
  parent_station?: string;
  stop_timezone?: string;
  wheelchair_boarding?: number; // always 0 for bus stops
  level_id?: string;
  platform_code?: string;
}

/**
 * @reference https://gtfs.org/documentation/schedule/reference/#stop_timestxt
 */

/**
 * @reference https://gtfs.org/documentation/schedule/reference/#tripstxt
 */
export interface TripDetails {
  route_id: string;
  service_id: string;
  trip_id: string;
  trip_headsign?: string;
  trip_short_name?: string;
  direction_id?: number;
  block_id?: string;
  shape_id?: string;
  wheelchair_accessible?: number;
  bikes_allowed?: number;
}

export interface AgencyDetails {
  agency_id: string;
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
  agency_lang?: string;
  agency_phone?: string;
  agency_fare_url?: string;
  agency_email?: string;
}

export interface CalendarDetails {
  service_id: string;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  start_date: string;
  end_date: string;
}

/**
 * @reference https://gtfs.org/documentation/schedule/reference/#calendar_dates_txt
 */
export interface CalendarDatesDetails {
  service_id: string;
  date: string; // YYYYMMDD
  exception_type: number; // 1 for added, 2 for removed
}

/**
 * @reference https://gtfs.org/documentation/schedule/reference/#shapestxt
 */
export interface ShapeDetails {
  shape_id: string;
  shape_pt_lat: number;
  shape_pt_lon: number;
  shape_pt_sequence: number;
  shape_dist_traveled: number;
}

/**
 * @reference https://gtfs.org/documentation/schedule/reference/#stop_timestxt
 */
export interface StopTimeDetails {
  trip_id: string;
  arrival_time: string; // HH:MM:SS
  departure_time: string; // HH:MM:SS
  stop_id: string;
  stop_sequence: number;
  stop_headsign?: string;
  // pickup_type?: number; // 0 = regular scheduled pickup
  // drop_off_type?: number; // 0 = regularly scheduled drop off
  // continous_pickup?: number; // 1 = no continuous pickup
  // continous_drop_off?: number; // 1 = no continuous drop off
  // shape_dist_traveled?: number; // optional, in meters
  timepoint?: number; // 1 - exact time, 0 - approximate time
}

export interface GTFSData {
  agency: AgencyDetails[];
  calendar: CalendarDetails[];
  calendar_dates: CalendarDatesDetails[];
  routes: RouteDetails[];
  stops: StopDetails[];
  trips: TripDetails[];
  stop_times: StopTimeDetails[];
  shapes: ShapeDetails[];
}

export interface GTFSFiles {
  agency: string;
  calendar: string;
  routes: string;
  stops: string;
  trips: string;
}
