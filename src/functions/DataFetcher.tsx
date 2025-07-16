import { useEffect, useState } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface DataFetcherOutput {
    data: OpenMeteoResponse | null;
    loading: boolean;
    error: string | null;
}

const cityCoords: Record<string, { latitude: number; longitude: number }> = {
    guayaquil:  { latitude: -2.17, longitude: -79.92 },
    quito:      { latitude: -0.22, longitude: -78.52 },
    manta:      { latitude: -0.95, longitude: -80.67 },
    cuenca:     { latitude: -2.90, longitude: -78.99 },
};

const CACHE_DURATION_MINUTES = 15;

export default function DataFetcher(city: string) : DataFetcherOutput {
    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const coords = cityCoords[city] || cityCoords.guayaquil;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&hourly=temperature_2m,wind_speed_10m&current=apparent_temperature,wind_speed_10m,relative_humidity_2m,temperature_2m&timezone=America%2FChicago`;

        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                }
                const result: OpenMeteoResponse = await response.json();
                setData(result);
                const cachedData = {
                    data: result,
                    expirationTime: Date.now() + (CACHE_DURATION_MINUTES * 60 * 1000)
                };
                localStorage.setItem(city, JSON.stringify(cachedData));
            } catch (err: any) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Ocurrió un error desconocido al obtener los datos.");
                }
            } finally {
                setLoading(false);
            }
        };

        const getData = async () => {
            const cachedData = localStorage.getItem(city);
            
            if (!cachedData) {
                return await fetchData();
            }

            try {
                const { data: cachedResult, expirationTime } = await JSON.parse(cachedData);
                
                if (Date.now() >= expirationTime) {
                    localStorage.removeItem(city);
                    return await fetchData();
                }

                setData(cachedResult);
                setLoading(false);
                
            } catch {
                await fetchData();
            }
        };

        getData();

    }, [city]);
    return { data, loading, error };
}