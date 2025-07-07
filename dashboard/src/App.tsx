import { Grid } from '@mui/material';

function App() {
   return (
       <Grid container spacing={5} justifyContent="center" alignItems="center">

         {/* Encabezado */}
         <Grid size={{ xs: 12, md: 12 }}>Elemento: Encabezado</Grid>

         {/* Alertas */}
         <Grid size={{ xs: 12, md: 12 }}>Elemento: Alertas</Grid>

         {/* Selector */}
         <Grid size={{ xs: 12, md: 12 }}>Elemento: Selector</Grid>

         {/* Indicadores */}
         <Grid size={{ xs: 12, md: 12 }}>Elemento: Indicadores</Grid>

         {/* Gráfico */}
         <Grid size={{ xs: 12, md: 12 }} sx={{ display: { xs: "none", md: "block"} }} >Elemento: Gráfico</Grid>

         {/* Tabla */}
         <Grid size={{ xs: 12, md: 12 }} sx={{ display: { xs: "none", md: "block"} }} >Elemento: Tabla</Grid>

         {/* Información adicional */}
         <Grid size={{ xs: 12, md: 12 }}>Elemento: Información adicional</Grid>

      </Grid>
   );
}

export default App;
