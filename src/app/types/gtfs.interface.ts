/**
 * @reference https://gtfs.org/documentation/schedule/reference/#routestxt
 */
export interface ServiceRouteDetails {
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
  stop_lat: number;
  stop_lon: number;
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
  agencyId: string;
  agencyName: string;
  agencyUrl: string;
  agencyTimezone: string;
  agencyLang?: string;
  agencyPhone?: string;
  agencyFareUrl?: string;
  agencyEmail?: string;
}
