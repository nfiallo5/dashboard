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
  hourly_units: Hourlyunits;
  hourly: Hourly;
  daily_units: Dailyunits;
  daily: Daily;
}

export interface Daily {
  time: string[];
  precipitation_sum: number[];
  weather_code: number[];
  sunshine_duration: number[];
}

export interface Dailyunits {
  time: string;
  precipitation_sum: string;
  weather_code: string;
  sunshine_duration: string;
}

export interface Hourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  uv_index: number[];
  wind_speed_10m: number[];
  cloud_cover: number[];
  soil_temperature_6cm: number[];
}

export interface Hourlyunits {
  time: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  uv_index: string;
  wind_speed_10m: string;
  temperature_80m: string;
  sunshine_duration: string;
  precipitation: string;
  cloud_cover: string;
  soil_temperature_6cm: string;
}

export interface Current {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  wind_speed_10m: number;
}

export interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  wind_speed_10m: string;
}