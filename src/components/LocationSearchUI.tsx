import { useState, useEffect, useMemo } from "react";
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { debounce } from "@mui/material/utils";

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface LocationSearchUIProps {
  onLocationChange: (location: Location | null) => void;
}

export default function LocationSearchUI({
  onLocationChange,
}: LocationSearchUIProps) {
  const [value, setValue] = useState<Location | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly Location[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLocations = useMemo(
    () =>
      debounce(
        async (
          input: string,
          callback: (results: readonly Location[]) => void
        ) => {
          if (input.length < 3) {
            callback([]);
            return;
          }

          try {
            const response = await fetch(`./api/geocode?city=${input}`);
            const data = await response.json();
            const results =
              data.results?.map((item: any) => ({
                name: item.formatted_address,
                lat: item.geometry.location.lat,
                lng: item.geometry.location.lng,
              })) || (data.name ? [data] : []);

            callback(results);
          } catch (error) {
            console.error("Error obteniendo los datos. ", error);
            callback([]);
          }
        },
        400
      ),
    []
  );

  useEffect(() => {
    let active = true;

    if (inputValue == "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    setLoading(true);
    fetchLocations(inputValue, (results) => {
      if (active) {
        setOptions(results);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetchLocations]);

  return (
    <Box
      sx={{ p: 2, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <LocationOnIcon sx={{ color: "text.secondary", mr: 1 }} />
        <Typography variant="h6" component="h2">
          Zonas Fino de Aroma
        </Typography>
      </Box>

      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, val) => option.name === val.name}
        filterOptions={(x) => x}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        noOptionsText="No se encontraron lugares..."
        onChange={(_event, newValue) => {
          setValue(newValue);
          onLocationChange(newValue); // Llama a la función del padre
        }}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar una zona"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {value && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "#FFFBE6", borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Zona Actual
            </Typography>
          </Box>
          <Typography variant="body2">{value.name.split(",")[0]}</Typography>
          <Typography variant="body2" color="text.secondary">
            {value.name.split(",").slice(1).join(",").trim()}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            Lat: {value.lat.toFixed(4)}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            Lon: {value.lng.toFixed(4)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
