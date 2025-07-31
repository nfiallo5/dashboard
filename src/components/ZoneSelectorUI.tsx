import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import PlaceIcon from "@mui/icons-material/Place";

const cities = [
  {
    value: "jipijapa,manabi",
    label: "Manabí - Jipijapa",
    variety: "Arriba Nacional",
  },
  {
    value: "ventanas,los-rios",
    label: "Los Ríos - Ventanas",
    variety: "Nacional Fino",
  },
  {
    value: "naranjal,guayas",
    label: "Guayas - Naranjal",
    variety: "Trinitario Premium",
  },
  {
    value: "arenillas,el-oro",
    label: "El Oro - Arenillas",
    variety: "CCN-51 mejorado",
  },
  {
    value: "shushufindi,sucumbios",
    label: "Sucumbíos - Shushufindi",
    variety: "Trinitario Nativo",
  },
  {
    value: "loreto,orellana",
    label: "Orellana - Loreto",
    variety: "Nacional Amazónico",
  },
  {
    value: "mera,pastaza",
    label: "Pastaza - Mera",
    variety: "Trinitario Silvestre",
  },
];

interface LocationDetails {
  name: string;
  variety: string;
  lat: number;
  lng: number;
}

interface ZoneSelectorUIProps {
  onLocationChange: (location: LocationDetails | null) => void;
}

const API_KEY = import.meta.env.VITE_GOOGLE_API_TOKEN;

export default function ZoneSelectorUI({
  onLocationChange,
}: ZoneSelectorUIProps) {
  const [selectedCity, setCity] = useState<string>(cities[0].value);
  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedCity) return;

    const fetchCoords = async () => {
      setLoading(true);

      const cityInfo = cities.find((i) => i.value == selectedCity);
      if (!cityInfo) {
        setLoading(false);
        return;
      }

      const localKey = `coords-${selectedCity}`;
      try {
        const cacheItem = localStorage.getItem(localKey);
        if (cacheItem) {
          const { lat, lng } = JSON.parse(cacheItem);
          const details: LocationDetails = {
            name: cityInfo.label,
            variety: cityInfo.variety,
            lat,
            lng,
          };

          setLocationDetails(details);
          onLocationChange(details);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${selectedCity}&key=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener datos");
        }

        const geocodeData = await response.json();
        if (geocodeData.status !== "OK") {
          throw new Error("No se obtuvieron las coordenadas");
        }

        const { lat, lng } = geocodeData.results[0].geometry.location;
        localStorage.setItem(localKey, JSON.stringify({ lat, lng }));

        const details: LocationDetails = {
          name: cityInfo.label,
          variety: cityInfo.variety,
          lat,
          lng,
        };
        setLocationDetails(details);
        onLocationChange(details);
      } catch (error) {
        console.error("Error obteniendo ubicacion:", error);
        setLocationDetails(null);
        onLocationChange(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCoords();
  }, [selectedCity, onLocationChange]);

  const handleChange = (event: SelectChangeEvent) => {
    setCity(event.target.value as string);
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#FDFDFD",
        color: "#f3dc82ff",
        border: 2,
        borderRadius: 3,
        boxShadow: "0px 4px 6px rgba(247, 219, 144, 0.92)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <PlaceIcon sx={{ color: "text.secondary", mr: 1 }} />
        <Typography variant="h6" component="h2" sx={{ color: "#5D4037" }}>
          Zonas Fino de Aroma
        </Typography>
      </Box>
      <FormControl fullWidth>
        {/* <InputLabel id="zone-select-label">Seleccione una zona</InputLabel> */}
        <Select
          labelId="zone-select-label"
          value={selectedCity}
          label="Seleccione una zona"
          onChange={handleChange}
          sx={{ color: "black", border: 3, borderRadius: 4 }}
        >
          {cities.map((zone) => (
            <MenuItem key={zone.value} value={zone.value} sx={{ margin: 1 }}>
              <Box>
                <Typography variant="h6">{zone.label}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {zone.variety}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        locationDetails && (
          <Box
            sx={{ mt: 2, p: 2, bgcolor: "#FFFBE6", borderRadius: 2, border: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              {/* <EcoIcon sx={{ color: "#66BB6A", mr: 1, fontSize: "1.2rem" }} /> */}
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#39681eff" }}
              >
                Zona Actual
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#BF360C" }}
            >
              {locationDetails.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {locationDetails.variety}
            </Typography>
            <Typography
              variant="body2"
              display="block"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Lat: {locationDetails.lat.toFixed(4)}
            </Typography>
            <Typography variant="body2" display="block" color="text.secondary">
              Lng: {locationDetails.lng.toFixed(4)}
            </Typography>
          </Box>
        )
      )}
    </Box>
  );
}