import {
  Box,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import OpacityIcon from "@mui/icons-material/Opacity";
import AirIcon from "@mui/icons-material/Air";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import type { OpenMeteoResponse } from "../types/DashboardTypes";
import { useMemo } from "react";

interface IndicatorsTableUIProps {
  data: OpenMeteoResponse | null;
  loading: boolean;
}

const calculateScore = (
  value: number,
  [min, max]: [number, number]
): number => {
  if (value >= min && value <= max) return 100;
  const rangeWidth = max - min;
  const distance = value < min ? min - value : value - max;
  const score = 100 - (distance / rangeWidth) * 50;
  return Math.max(0, Math.round(score));
};

const metricsConfig = [
  {
    id: "airTemp",
    label: "Temperatura Aire",
    unit: "°C",
    optimal: [24, 29] as [number, number],
    getValue: (d: OpenMeteoResponse) => d.current.temperature_2m,
    tagline: "Desarrollo aromático óptimo",
    icon: <DeviceThermostatIcon sx={{ fontSize: 26 }} />,
  },
  {
    id: "humidity",
    label: "Humedad Relativa",
    unit: "%",
    optimal: [80, 90] as [number, number],
    getValue: (d: OpenMeteoResponse) => d.current.relative_humidity_2m,
    tagline: "Fermentación ideal",
    icon: <WaterDropIcon sx={{ fontSize: 26 }} />,
  },
  {
    id: "precipitation",
    label: "Precipitación",
    unit: "mm/día",
    optimal: [5, 6.7] as [number, number],
    getValue: (d: OpenMeteoResponse) =>
      d.daily.precipitation_sum[d.daily.precipitation_sum.length - 1],
    tagline: "Distribución uniforme",
    icon: <OpacityIcon sx={{ fontSize: 26 }} />,
  },
  {
    id: "windSpeed",
    label: "Velocidad Viento",
    unit: "km/h",
    optimal: [5, 15] as [number, number],
    getValue: (d: OpenMeteoResponse) => d.current.wind_speed_10m,
    tagline: "Ventilación controlada",
    icon: <AirIcon sx={{ fontSize: 26 }} />,
  },
  {
    id: "uvIndex",
    label: "Índice UV",
    unit: "",
    optimal: [0, 6] as [number, number],
    getValue: (d: OpenMeteoResponse) =>
      d.hourly.uv_index[d.hourly.uv_index.length - 1],
    tagline: "Con sombra adecuada",
    icon: <WbSunnyIcon sx={{ fontSize: 26 }} />,
  },
  {
    id: "sunshine",
    label: "Sol Filtrado",
    unit: "h/día",
    optimal: [4, 6] as [number, number],
    getValue: (d: OpenMeteoResponse) =>
      d.daily.sunshine_duration[d.daily.sunshine_duration.length - 1] / 3600,
    tagline: "Sombra especializada",
    icon: <VisibilityIcon sx={{ fontSize: 26 }} />,
  },
  {
    id: "soilTemp",
    label: "Temperatura Suelo",
    unit: "°C",
    optimal: [25, 27] as [number, number],
    getValue: (d: OpenMeteoResponse) =>
      d.hourly.soil_temperature_6cm[d.hourly.soil_temperature_6cm.length - 1],
    tagline: "Raíces sensibles",
    icon: <AgricultureIcon sx={{ fontSize: 26 }} />,
  },
  {
    id: "cloudCover",
    label: "Cobertura Nubosa",
    unit: "%",
    optimal: [60, 75] as [number, number],
    getValue: (d: OpenMeteoResponse) =>
      d.hourly.cloud_cover[d.hourly.cloud_cover.length - 1],
    tagline: "Protección natural",
    icon: <FilterDramaIcon sx={{ fontSize: 26 }} />,
  },
];

export default function IndicatorsTableUI({
  data,
  loading,
}: IndicatorsTableUIProps) {
  const theme = useTheme();

  const processed = useMemo(() => {
    if (!data) return [];
    return metricsConfig.map((m) => {
      const value = m.getValue(data);
      const score = calculateScore(value, m.optimal);
      return { ...m, value, score };
    });
  }, [data]);

  const getScoreColor = (score: number) => {
    if (score < 50) return theme.palette.error.main;
    if (score < 80) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  if (loading) return <Typography>Cargando métricas…</Typography>;
  if (!data)
    return <Typography>Seleccione una zona para ver métricas.</Typography>;

  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: "#FFFEFA",
        borderRadius: 2,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h6" component="h2" sx={{ color: "#5D4037", mb: 2 }}>
        Indicadores Fino de Aroma (8 métricas críticas)
      </Typography>

      <Grid container spacing={2}>
        {processed.map((metric) => (
          <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                height: "100%",
                borderRadius: 2,
                borderColor: "#FFE0B2",
              }}
            >
              {/* Encabezado Icono + Puntaje */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {metric.icon}
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ color: getScoreColor(metric.score) }}
                >
                  {metric.score}%
                </Typography>
              </Box>

              {/* Nombre */}
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
                {metric.label}
              </Typography>

              {/* Valor actual */}
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#263238" }}
              >
                {metric.value.toFixed(1)} {metric.unit}
              </Typography>

              {/* Barra de progreso */}
              <LinearProgress
                variant="determinate"
                value={metric.score}
                sx={{ mt: 1, height: 8, borderRadius: 2, bgcolor: "#ECEFF1" }}
              />

              {/* Rango óptimo + tagline */}
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                Óptimo: {metric.optimal[0]}–{metric.optimal[1]}
                {metric.unit}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {metric.tagline}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
