import { Grid } from "@mui/material";
import "./App.css";
import HeaderUI from "./components/HeaderUI";
import DataFetcher from "./functions/DataFetcher";
import ChartUI from "./components/ChartUI";
import ZoneSelectorUI from "./components/ZoneSelectorUI";
import QualityIndexUI from "./components/QualityIndexUI";
import { useState } from "react";

interface Coords {
  name: string;
  lat: number;
  lng: number;
  variety: string;
}

function App() {
  const [coords, setCoords] = useState<Coords | null>({
    name: "Manabí - Jipijapa",
    variety: "Arriba Nacional",
    lat: -1.3486,
    lng: -80.5786,
  });

  const dataFetcherOutput = DataFetcher(coords);

  return (
    <div>
      <Grid container spacing={5} justifyContent="center" alignItems="center">
        {/* Encabezado */}
        <Grid size={{ xs: 12, md: 12 }}>
          <HeaderUI data={dataFetcherOutput.data?.current.time || ""} />
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

        {/* Indice de Calidad */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <QualityIndexUI data={dataFetcherOutput.data} />
            </Grid>
          </Grid>
        </Grid>

        {/* Gráfico */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          {dataFetcherOutput.loading && <p>Cargando datos...</p>}
          {dataFetcherOutput.error && <p>Error: {dataFetcherOutput.error}</p>}
          {dataFetcherOutput.data && (
            <>
              <Grid size={{ xs: 12 }}>
                <ChartUI
                  data={dataFetcherOutput.data}
                  loading={dataFetcherOutput.loading}
                />
              </Grid>
            </>
          )}
        </Grid>

        {/* Tabla */}
        {/* <Grid
          size={{ xs: 12, md: 6 }}
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
        </Grid> */}

        {/* Información adicional */}
      </Grid>
    </div>
  );
}

export default App;
