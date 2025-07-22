import { Grid } from "@mui/material";
import "./App.css";
import HeaderUI from "./components/HeaderUI";
import AlertUI from "./components/AlertUI";
import SelectorUI from "./components/SelectorUI";
import IndicatorUI from "./components/IndicatorUI";
import DataFetcher from "./functions/DataFetcher";
import TableUI from "./components/TableUI";
import ChartUI from "./components/ChartUI";
import ZoneSelectorUI from "./components/ZoneSelectorUI";
import { useState } from "react";

interface Coords {
  name: string;
  lat: number;
  lng: number;
  variety: string;
}

function App() {
  const [coords, setCoords] = useState<Coords | null>(null);

  const dataFetcherOutput = DataFetcher(coords);

  return (
    <div>
      <Grid container spacing={5} justifyContent="center" alignItems="center">
        {/* Encabezado */}
        <Grid size={{ xs: 12, md: 12 }}>
          <HeaderUI />
          Elemento: Encabezado
        </Grid>

        {/* Alertas */}
        {/* <Grid
          size={{ xs: 12, md: 12 }}
          container
          justifyContent="right"
          alignItems="center"
        >
          <AlertUI description="No se preveen lluvias" />
        </Grid> */}

        {/* Selector */}
        <Grid size={{ xs: 12, md: 3 }}>
          {/* <SelectorUI onCityChange={setCity} /> */}
          <ZoneSelectorUI onLocationChange={setCoords} />
        </Grid>

        {/* Indicadores */}
        <Grid container size={{ xs: 12, md: 9 }}>
          {/* Elemento: Indicadores */}
          {/* Renderizado condicional de los datos obtenidos */}

          {dataFetcherOutput.loading && <p>Cargando datos...</p>}
          {dataFetcherOutput.error && <p>Error: {dataFetcherOutput.error}</p>}
          {dataFetcherOutput.data && (
            <>
              {/* Indicadores con datos obtenidos */}

              <Grid size={{ xs: 12, md: 3 }}>
                <IndicatorUI
                  title="Temperatura (2m)"
                  description={
                    dataFetcherOutput.data.current.temperature_2m +
                    " " +
                    dataFetcherOutput.data.current_units.temperature_2m
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <IndicatorUI
                  title="Temperatura aparente"
                  description={
                    dataFetcherOutput.data.current.apparent_temperature +
                    " " +
                    dataFetcherOutput.data.current_units.apparent_temperature
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <IndicatorUI
                  title="Velocidad del viento"
                  description={
                    dataFetcherOutput.data.current.wind_speed_10m +
                    " " +
                    dataFetcherOutput.data.current_units.wind_speed_10m
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <IndicatorUI
                  title="Humedad relativa"
                  description={
                    dataFetcherOutput.data.current.relative_humidity_2m +
                    " " +
                    dataFetcherOutput.data.current_units.relative_humidity_2m
                  }
                />
              </Grid>
            </>
          )}
        </Grid>

        {/* Gráfico */}
        <Grid
          size={{ xs: 6, md: 6 }}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          {dataFetcherOutput.loading && <p>Cargando datos...</p>}
          {dataFetcherOutput.error && <p>Error: {dataFetcherOutput.error}</p>}
          {dataFetcherOutput.data && (
            <ChartUI
              hourly={dataFetcherOutput.data.hourly}
              hourly_units={dataFetcherOutput.data.hourly_units}
            />
          )}
        </Grid>

        {/* Tabla */}
        <Grid
          size={{ xs: 6, md: 6 }}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          {dataFetcherOutput.loading && <p>Cargando datos...</p>}
          {dataFetcherOutput.error && <p>Error: {dataFetcherOutput.error}</p>}
          {dataFetcherOutput.data && (
            <TableUI
              hourly={dataFetcherOutput.data.hourly}
              hourly_units={dataFetcherOutput.data.hourly_units}
            />
          )}
        </Grid>

        {/* Información adicional */}
        <Grid size={{ xs: 12, md: 12 }}>Elemento: Información adicional</Grid>
      </Grid>
    </div>
  );
}

export default App;
