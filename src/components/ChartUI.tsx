import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import type { Hourly, HourlyUnits } from '../types/DashboardTypes';

const arrValues1 = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const arrValues2 = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const arrLabels = ['A','B','C','D','E','F','G'];

interface ChartUIProps {
   hourly?: Hourly;
   hourly_units?: HourlyUnits;
}

export default function ChartUI(props: ChartUIProps) {
   return (
      <>
         <Typography variant="h5" component="div">
            {props.hourly ? 
               `Gráfico Temperatura (2m) y Velocidad del Viento (10m) (Últimas 24 horas)` : 
               'Chart arrLabels vs arrValues1 & arrValues2'
            }
         </Typography>
         <LineChart
            height={300}
            series={[
               { data: props.hourly?.temperature_2m.slice(-24) || arrValues1, label: props.hourly ? `Temperatura (${props.hourly_units?.temperature_2m || '°C'})` : 'value1'},
               { data: props.hourly?.wind_speed_10m.slice(-24) || arrValues2, label: props.hourly ? `Velocidad del Viento (${props.hourly_units?.wind_speed_10m || 'km/h'})` : 'value2'},
            ]}
            xAxis={[{ scaleType: 'point', data: props.hourly?.time.slice(-24).map(t => t.split('T')[1]) || arrLabels }]}
         />
      </>
   );
}