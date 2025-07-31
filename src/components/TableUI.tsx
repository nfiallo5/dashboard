// import Box from '@mui/material/Box';
// import { DataGrid, type GridColDef } from '@mui/x-data-grid';
// import type { Hourly, HourlyUnits } from '../types/DashboardTypes';

// interface TableUIProps {
//    hourly?: Hourly;
//    hourly_units?: HourlyUnits;
// }

// function combineArrays(arrLabels: Array<string>, arrValues1: Array<number>, arrValues2: Array<number>) {
//    return arrLabels.map((label, index) => ({
//       id: index,
//       label: label,
//       value1: arrValues1[index],
//       value2: arrValues2[index]
//    }));
// }

// const arrValues1 = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
// const arrValues2 = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
// const arrLabels = ['A','B','C','D','E','F','G'];

// export default function TableUI(props: TableUIProps) {
//    // Variables de fallback para unidades
//    const tempUnit = props.hourly_units?.temperature_2m || '°C';
//    const windUnit = props.hourly_units?.wind_speed_10m || 'km/h';

//    // Usar la función existente pero con datos condicionales
//    const labels = props.hourly?.time.slice(-24).map(t => t.split('T')[1]) || arrLabels;
//    const values1 = props.hourly?.temperature_2m.slice(-24) || arrValues1;
//    const values2 = props.hourly?.wind_speed_10m.slice(-24) || arrValues2;

//    // Columnas dinámicas (modificar la constante existente)
//    const columns: GridColDef[] = [
//       { field: 'id', headerName: 'ID', width: 90 },
//       {
//          field: 'label',
//          headerName: props.hourly ? 'Hora' : 'Label',
//          width: 150,
//       },
//       {
//          field: 'value1',
//          headerName: props.hourly ? `Temperatura (${tempUnit})` : 'Value 1',
//          width: 150,
//       },
//       {
//          field: 'value2',
//          headerName: props.hourly ? `Viento (${windUnit})` : 'Value 2',
//          width: 150,
//       },
//       {
//          field: 'resumen',
//          headerName: 'Resumen',
//          description: 'No es posible ordenar u ocultar esta columna.',
//          sortable: false,
//          hideable: false,
//          width: 160,
//          valueGetter: (_, row) => `${row.label || ''} ${row.value1 || ''} ${row.value2 || ''}`,
//       },
//    ];

//    const rows = combineArrays(labels, values1, values2);

//    return (
//       <Box sx={{ height: 350, width: '100%' }}>
//          <DataGrid
//             rows={rows}
//             columns={columns}
//             initialState={{
//                pagination: {
//                   paginationModel: {
//                      pageSize: 5,
//                   },
//                },
//             }}
//             pageSizeOptions={[5]}
//             disableRowSelectionOnClick
//          />
//       </Box>
//    );
// }
