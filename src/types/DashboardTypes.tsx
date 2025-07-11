export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentUnits;
  current: Current;
  hourly_units: HourlyUnits;
  hourly: Hourly;
}

export interface Hourly {
  time: string[];
  temperature_2m: number[];
  wind_speed_10m: number[];
}

export interface HourlyUnits {
  time: string;
  temperature_2m: string;
  wind_speed_10m: string;
}

export interface Current {
  time: string;
  interval: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  temperature_2m: number;
  wind_speed_10m: number;
}

export interface CurrentUnits {
  time: string;
  interval: string;
  apparent_temperature: string;
  relative_humidity_2m: string;
  temperature_2m: string;
  wind_speed_10m: string;
}