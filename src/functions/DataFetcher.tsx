import { useEffect, useState } from "react";
import type { OpenMeteoResponse } from "../types/DashboardTypes";

interface CacheEntry {
  timestamp?: number;
  data: OpenMeteoResponse;
}

interface DataFetcherOutput {
  data: OpenMeteoResponse | null;
  loading: boolean;
  error: string | null;
}

const cityCoords: Record<string, { latitude: number; longitude: number }> = {
  guayaquil: { latitude: -2.17, longitude: -79.92 },
  quito: { latitude: -0.22, longitude: -78.52 },
  manta: { latitude: -0.95, longitude: -80.67 },
  cuenca: { latitude: -2.9, longitude: -78.99 },
};

const control_minutos = 30;
const control_ms = control_minutos * 60 * 1000;

export default function DataFetcher(city: string): DataFetcherOutput {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    localStorage.setItem("key", "value");

    const localKey = `cache-${city}`;

    try {
      const item = localStorage.getItem(localKey);
      if (item) {
        const cacheEntry: CacheEntry = JSON.parse(item);
        const tiempo = Date.now();

        if (tiempo < control_ms) {
          setData(cacheEntry.data);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error("Error al leer el localStorage: ", e);
    }

    const coords = cityCoords[city] || cityCoords.guayaquil;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&hourly=temperature_2m,wind_speed_10m&current=apparent_temperature,wind_speed_10m,relative_humidity_2m,temperature_2m&timezone=America%2FChicago`;

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `Error HTTP: ${response.status} - ${response.statusText}`
          );
        }
        const result: OpenMeteoResponse = await response.json();
        setData(result);

        const newEntry: CacheEntry = {
          timestamp: Date.now(),
          data: result,
        };
        localStorage.setItem(localKey, JSON.stringify(newEntry));
      } catch (err: any) {
        const errItem = localStorage.getItem(localKey);
        if (errItem) {
          const errData: CacheEntry = JSON.parse(errItem);
          setData(errData.data);
          setError(`Mostrando datos de ${city}. Error ${err.message}`);
        } else {
          setError("Ocurrió un error desconocido al obtener los datos.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [city]);
  return { data, loading, error };
}
