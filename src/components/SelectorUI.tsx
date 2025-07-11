import { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function SelectorUI({ onCityChange} : { onCityChange: (city: string) => void }) {
   const [cityInput, setCityInput] = useState('');

   const handleChange = (event: SelectChangeEvent<string>) => {
      setCityInput(event.target.value);
      onCityChange(event.target.value);
   };

   return (
      <FormControl fullWidth>
         <InputLabel id="city-select-label">Ciudad</InputLabel>
         <Select
            value={cityInput}
            onChange={handleChange}
            labelId="city-select-label"
            id="city-simple-select"
            label="Ciudad">
            <MenuItem disabled><em>Seleccione una ciudad</em></MenuItem>
            <MenuItem value={"guayaquil"}>Guayaquil</MenuItem>
            <MenuItem value={"quito"}>Quito</MenuItem>
            <MenuItem value={"manta"}>Manta</MenuItem>
            <MenuItem value={"cuenca"}>Cuenca</MenuItem>
         </Select>
         {cityInput && (
            <p>
               Información del clima en <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{cityInput}</span>
            </p>
         )}
      </FormControl>
   )
}