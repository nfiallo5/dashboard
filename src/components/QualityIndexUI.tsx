import {
  Box,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import type { OpenMeteoResponse } from "../types/DashboardTypes";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

interface indexProps {
  data: OpenMeteoResponse | null;
}

const metricsConfig = [
  {
    id: "airTemp",
    label: "Temperatura Aire",
    optimal: [24, 29],
    weight: 0.25,
    unit: "°C",
  },
  {
    id: "humidity",
    label: "Humedad Relativa",
    optimal: [80, 90],
    weight: 0.2,
    unit: "%",
  },
  {
    id: "precipitation",
    label: "Precipitación",
    optimal: [5, 6.7],
    weight: 0.15,
    unit: "mm/día",
  },
  {
    id: "windSpeed",
    label: "Velocidad Viento",
    optimal: [5, 15],
    weight: 0.1,
    unit: "km/h",
  },
  {
    id: "uvIndex",
    label: "Índice UV",
    optimal: [0, 6],
    weight: 0.08,
    unit: "",
  },
  {
    id: "soilTemp",
    label: "Temperatura Suelo",
    optimal: [25, 27],
    weight: 0.08,
    unit: "°C",
  },
  {
    id: "cloudCover",
    label: "Cobertura Nubosa",
    optimal: [60, 75],
    weight: 0.07,
    unit: "%",
  },
  {
    id: "sunshine",
    label: "Horas Sol Filtrado",
    optimal: [4, 6],
    weight: 0.07,
    unit: "h/día",
  },
];

const calculateScore = (
  value: number,
  [min, max]: number[] = [0, 0]
): number => {
  if (value >= min && value <= max) return 100;

  const rangeWidth = max - min;
  const distance = value < min ? min - value : value - max;

  const score = 100 - (distance / rangeWidth) * 50;

  return Math.max(0, Math.round(score));
};

const MetricProgressBar = ({
  label,
  value,
  score,
  weight,
  unit,
}: {
  label: string;
  value: number;
  score: number;
  weight: number;
  unit: string;
}) => (
  <Grid size={{ xs: 12, sm: 6 }}>
    <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "#FFFBE6" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="body2">
          {label}
          <Typography variant="caption">{Math.round(weight * 100)}%</Typography>
        </Typography>

        <Stack direction="row" spacing={1} alignItems="baseline">
          <Typography variant="body2" fontWeight="bold">
            {value.toFixed(1)}
            {unit}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {score}%
          </Typography>
        </Stack>
      </Box>
      <LinearProgress
        variant="determinate"
        value={score}
        sx={{ height: 8, borderRadius: 2 }}
      />
    </Paper>
  </Grid>
);

export default function QualityIndexUI({ data }: indexProps) {
  const qualityReport = useMemo(() => {
    if (!data) return null;

    const now = new Date();
    const currentHourIndex = data.hourly.time.findIndex(
      (t) => new Date(t).getHours() === now.getHours()
    );
    const todayIndex = data.daily.time.length - 1; // Asumimos el último día

    const metricValues = {
      airTemp: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.daily.precipitation_sum[todayIndex],
      windSpeed: data.current.wind_speed_10m,
      uvIndex: data.hourly.uv_index[currentHourIndex],
      soilTemp: data.hourly.soil_temperature_6cm[currentHourIndex],
      cloudCover: data.hourly.cloud_cover[currentHourIndex],
      sunshine: data.daily.sunshine_duration[todayIndex] / 3600, // de segundos a horas
    };

    const scoredMetrics = metricsConfig.map((m) => {
      const value = metricValues[m.id as keyof typeof metricValues];
      return {
        ...m,
        value,
        score: calculateScore(value, m.optimal),
      };
    });

    const overallScore = Math.round(
      scoredMetrics.reduce((acc, curr) => acc + curr.score * curr.weight, 0)
    );

    const getRating = (score: number) => {
      if (score < 50) return { label: "Deficiente", color: "error" as const };
      if (score < 80) return { label: "Precaución", color: "warning" as const };
      return { label: "Óptimo", color: "success" as const };
    };

    return {
      overallScore,
      rating: getRating(overallScore),
      metrics: scoredMetrics,
    };
  }, [data]);

  if (!qualityReport) {
    return (
      <Typography>
        Selecciona una zona para ver el índice de calidad.
      </Typography>
    );
  }

  const { overallScore, rating, metrics } = qualityReport;

  return (
    <Paper sx={{ p: 2, bgcolor: "#ffffffff", borderRadius: 2, boxShadow: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <TrackChangesIcon sx={{ color: "#5D4037" }} />
        <Typography variant="h6" component="h2" sx={{ color: "#5D4037" }}>
          Índice de Calidad Diario (Algoritmo Especializado)
        </Typography>
      </Stack>

      <Typography
        variant="h2"
        component="div"
        textAlign="center"
        fontWeight="bold"
        sx={{ color: "#BF360C" }}
      >
        {overallScore}
      </Typography>

      <Box textAlign="center" my={1}>
        <Chip label={rating.label} color={rating.color} />
      </Box>

      <LinearProgress
        variant="determinate"
        value={overallScore}
        sx={{ height: 10, borderRadius: 2, mb: 1 }}
      />
      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        color="text.secondary"
        mb={2}
      >
        Índice integral de calidad organoléptica para cacao fino de aroma
      </Typography>

      <Grid container spacing={2}>
        {metrics.map((metric) => (
          <MetricProgressBar key={metric.id} {...metric} />
        ))}
      </Grid>
    </Paper>
  );
}