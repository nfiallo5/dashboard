import { useState, useMemo, type SyntheticEvent } from "react";
import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { BarChart, LineChart, axisClasses } from "@mui/x-charts";
import type { OpenMeteoResponse } from "../types/DashboardTypes";

interface ChartUIProps {
  data: OpenMeteoResponse | null;
  loading: boolean;
}

const metricsConfig = [
  {
    id: "airTemp",
    label: "Temperatura Aire",
    optimal: [24, 29],
    getValue: (data: OpenMeteoResponse, i: number) =>
      data.hourly.temperature_2m[i],
  },
  {
    id: "humidity",
    label: "Humedad Relativa",
    optimal: [80, 90],
    getValue: (data: OpenMeteoResponse, i: number) =>
      data.hourly.relative_humidity_2m[i],
  },
  {
    id: "precipitation",
    label: "Precipitación",
    optimal: [5, 6.7],
    getValue: (data: OpenMeteoResponse, i: number) =>
      data.daily.precipitation_sum[Math.floor(i / 24)],
  },
  {
    id: "windSpeed",
    label: "Velocidad Viento",
    optimal: [5, 15],
    getValue: (data: OpenMeteoResponse, i: number) =>
      data.hourly.wind_speed_10m[i],
  },
  {
    id: "uvIndex",
    label: "Índice UV",
    optimal: [0, 6],
    getValue: (data: OpenMeteoResponse, i: number) => data.hourly.uv_index[i],
  },
  {
    id: "soilTemp",
    label: "Temperatura Suelo",
    optimal: [25, 27],
    getValue: (data: OpenMeteoResponse, i: number) =>
      data.hourly.soil_temperature_6cm[i],
  },
  {
    id: "cloudCover",
    label: "Cobertura Nubosa",
    optimal: [60, 75],
    getValue: (data: OpenMeteoResponse, i: number) =>
      data.hourly.cloud_cover[i],
  },
  {
    id: "sunshine",
    label: "Horas Sol Filtrado",
    optimal: [4, 6],
    getValue: (data: OpenMeteoResponse, i: number) =>
      data.daily.sunshine_duration[Math.floor(i / 24)] / 3600,
  },
];

const calculateScore = (value: number, [min, max]: number[]): number => {
  if (value >= min && value <= max) return 100;
  const rangeWidth = max - min;
  if (rangeWidth === 0) return value === min ? 100 : 0;
  const distance = value < min ? min - value : value - max;
  const score = 100 - (distance / rangeWidth) * 50;
  return Math.max(0, Math.round(score));
};

const HistoricalQualityChart = ({ data }: { data: OpenMeteoResponse }) => {
  const chartData = useMemo(() => {
    const now = new Date();
    let endIndex = -1;
    for (let i = data.hourly.time.length - 1; i >= 0; i--) {
      if (new Date(data.hourly.time[i]) <= now) {
        endIndex = i;
        break;
      }
    }

    if (endIndex === -1) {
      endIndex = 0;
    }

    const indStart = Math.max(0, endIndex - 23);
    const timeSlice = data.hourly.time.slice(indStart, endIndex + 1);

    const scores = timeSlice.map((_, i) => {
      const indexActual = indStart + i;
      const hourlyScores = metricsConfig.map((metric) => {
        const value = metric.getValue(data, indexActual);
        return { score: calculateScore(value, metric.optimal), weight: 0.125 };
      });
      return hourlyScores.reduce(
        (acc, curr) => acc + curr.score * curr.weight,
        0
      );
    });

    const labels = timeSlice.map((i) =>
      new Date(i).toLocaleString("es-EC", {
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    );

    return { scores, labels };
  }, [data]);

  return (
    <Box>
      <LineChart
        height={300}
        series={[
          {
            data: chartData.scores,
            label: "Índice Aromático",
            area: true,
            color: "#ff9800",
          },
        ]}
        xAxis={[
          {
            scaleType: "point",
            data: chartData.labels,
            tickLabelStyle: { angle: 45, textAnchor: "start", fontSize: 10 },
          },
        ]}
        yAxis={[{ min: 0, max: 100 }]}
        sx={{
          [`.${axisClasses.directionY} .${axisClasses.label}`]: {
            transform: "translateX(-10px)",
          },
        }}
      />
      <Typography variant="caption" color="text.secondary">
        <b>Índice Aromático:</b> Evaluación integral del potencial organoléptico
        basado en temperatura, humedad, precipitación y condiciones de viento.
      </Typography>
    </Box>
  );
};

const QualityFactorsChart = ({ data }: { data: OpenMeteoResponse }) => {
  const currentScores = useMemo(() => {
    const now = new Date();
    const currentHourIndex =
      data.hourly.time.findIndex((t) => new Date(t) >= now) ??
      data.hourly.time.length - 1;

    return metricsConfig.map((metric) => ({
      label: metric.label,
      score: calculateScore(
        metric.getValue(data, currentHourIndex),
        metric.optimal
      ),
    }));
  }, [data]);

  return (
    <Box>
      <BarChart
        dataset={currentScores}
        yAxis={[{ scaleType: "band", dataKey: "label" }]}
        series={[
          {
            dataKey: "score",
            label: "Puntaje de Calidad Actual (0-100)",
            color: "#4caf50",
          },
        ]}
        layout="horizontal"
        height={400}
        xAxis={[{ min: 0, max: 100 }]}
      />
      <Typography variant="caption" color="text.secondary">
        <b>Análisis de Factores:</b> Muestra el puntaje (0-100) de cada métrica
        individual en el momento actual. Un puntaje de 100 indica una condición
        óptima.
      </Typography>
    </Box>
  );
};

const QualityDistributionChart = ({ data }: { data: OpenMeteoResponse }) => {
  const distributionData = useMemo(() => {
    const relevantMetrics = metricsConfig.filter((m) =>
      ["airTemp", "humidity", "windSpeed", "cloudCover"].includes(m.id)
    );
    const hours = data.hourly.time.slice(0, 24); // Próximas 24 horas

    return relevantMetrics.map((metric) => {
      const ranges = { Óptimo: 0, Precaución: 0, Crítico: 0 };
      hours.forEach((_, i) => {
        const value = metric.getValue(data, i);
        const score = calculateScore(value, metric.optimal);
        if (score === 100) ranges.Óptimo++;
        else if (score > 50) ranges.Precaución++;
        else ranges.Crítico++;
      });
      return { ...ranges, metric: metric.label };
    });
  }, [data]);

  return (
    <Box>
      <BarChart
        dataset={distributionData}
        xAxis={[{ scaleType: "band", dataKey: "metric" }]}
        series={[
          { dataKey: "Óptimo", label: "Óptimo", color: "#4caf50" },
          { dataKey: "Precaución", label: "Precaución", color: "#ff9800" },
          { dataKey: "Crítico", label: "Crítico", color: "#f44336" },
        ]}
        height={300}
      />
      <Typography variant="caption" color="text.secondary">
        <b>Distribución Horaria:</b> Proporción de las próximas 24 horas que
        cada métrica pasará en un estado óptimo, de precaución o crítico.
      </Typography>
    </Box>
  );
};

export default function ChartUI({ data, loading }: ChartUIProps) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  if (loading) return <Typography>Cargando gráficos...</Typography>;
  if (!data)
    return (
      <Typography>No hay datos disponibles para mostrar gráficos.</Typography>
    );

  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: "#FDFDFD",
        borderRadius: 2,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h6" component="h2" sx={{ color: "#5D4037", mb: 1 }}>
        Análisis Gráfico Especializado
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#f5f5f5" }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Perfil Aromático" />
          <Tab label="Factores Actuales" />
          <Tab label="Distribución 24h" />
        </Tabs>
      </Box>
      <Box sx={{ pt: 2 }}>
        {tabIndex === 0 && <HistoricalQualityChart data={data} />}
        {tabIndex === 1 && <QualityFactorsChart data={data} />}
        {tabIndex === 2 && <QualityDistributionChart data={data} />}
      </Box>
    </Paper>
  );
}
