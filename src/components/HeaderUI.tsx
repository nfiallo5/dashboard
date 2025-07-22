import { Avatar, Box, Stack, Typography } from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Person } from "@mui/icons-material";

interface HeaderConfig {
  timestamp: number;
}

export default function HeaderUI() {
  const user = "Nicolas Fiallo";
  const time = Date.now();
  const date = "21 Junio de 2025";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "#c43d0cff",
        borderRadius: 3,
        margin: 2,
        padding: 3,
        boxSizing: "border-box",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ bgcolor: "#4E342E", width: 56, height: 56 }}>
          <WaterDropIcon />
        </Avatar>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            Dashboard Cacao Fino de Aroma
          </Typography>
          <Typography
            variant="body1"
            sx={{ opacity: 0.8, color: "#f8d36a", fontWeight: "bold" }}
          >
            Monitoreo especializado para calidad Premium y perfiles sensoriales
          </Typography>
        </Box>
      </Stack>

      <Stack direction={"row"} alignItems={"center"} spacing={2}>
        <Stack
          direction="row"
          alignItems={"center"}
          spacing={1}
          borderRadius={1.5}
          sx={{ bgcolor: "#4E342E", p: "6px 12px" }}
        >
          <PersonIcon fontSize="small" />
          <Typography variant="body2">Usuario: {user}</Typography>
        </Stack>

        <Stack direction="row" alignItems={"center"} spacing={1}>
          <AccessTimeIcon fontSize="small" />
          <Box>
            <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
              {time}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.8, lineHeight: 1.2 }}
            >
              {date}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
