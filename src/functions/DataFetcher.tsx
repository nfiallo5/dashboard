import { useEffect, useState } from "react";
import type { OpenMeteoResponse } from "../types/DashboardTypes";

interface CacheEntry {
  timestamp: number;
  data: OpenMeteoResponse;
}

interface DataFetcherOutput {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string | null;
}

interface Coords {
  name: string;
  lat: number;
  lng: number;
}

const control_minutos = 30;
const control_ms = control_minutos * 60 * 1000;

export default function DataFetcher(coords: Coords | null): DataFetcherOutput {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coords) {
      setLoading(false);
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    localStorage.setItem("key", "value");

    const fetchData = async () => {
      const localKey = `cache-${coords.name}`;
      try {
        const item = localStorage.getItem(localKey);
        if (item) {
          const cacheEntry: CacheEntry = JSON.parse(item);
          const tiempo = Date.now() - cacheEntry.timestamp;

          if (tiempo < control_ms) {
            setData(cacheEntry.data);
            setLoading(false);
            return;
          }
        }

        // const geocodeResponse = await fetch(`./services/api?city=${location.name}`);
        // if (!geocodeResponse.ok) {
        //   throw new Error(
        //     `Error al obtener reespuesta del servidor: ${geocodeResponse.status} - ${geocodeResponse.statusText}`
        //   );
        // }

        // const { lat, lng } = await geocodeResponse.json();

        const hourlyParams =
          "temperature_2m,relative_humidity_2m,uv_index,wind_speed_10m,cloud_cover,soil_temperature_6cm";
        const dailyParam = "precipitation_sum,sunshine_duration";
        const currentParams =
          "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m";

        const openmeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&hourly=${hourlyParams}&daily=${dailyParam}&current=${currentParams}&timezone=America%2FChicago&past_days=1`;
        const weatherResponse = await fetch(openmeteoUrl);

        if (!weatherResponse.ok) {
          throw new Error(
            `Error con el servidor: ${weatherResponse.status} - ${weatherResponse.statusText}`
          );
        }

        const weatherResult = await weatherResponse.json();
        setData(weatherResult);

        const newEntry: CacheEntry = {
          timestamp: Date.now(),
          data: weatherResult,
        };
        localStorage.setItem(localKey, JSON.stringify(newEntry));
      } catch (err: any) {
        const errItem = localStorage.getItem(localKey);
        if (errItem) {
          const errData: CacheEntry = JSON.parse(errItem);
          setData(errData.data);
          setError(`Mostrando datos de ${coords.name}. Error ${err.message}`);
        } else {
          setError("Ocurrió un error desconocido al obtener los datos.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [coords]);
  return { data, loading, error };
}
