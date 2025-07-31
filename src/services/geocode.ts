export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return new Response(JSON.stringify({ error: "No se ingreso ciudad" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const API_KEY = import.meta.env.VITE_GOOGLE_API_TOKEN;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${API_KEY}`;

  try {
    const geocodeResponse = await fetch(url);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== "OK") {
      return new Response(
        JSON.stringify({ error: "No se encontro la ciudad" }),
        {
          status: 400,
          headers: { "Content-Type": " application/json" },
        }
      );
    }

    const location = geocodeData.results[0];
    const responseData = {
      name: location.formatted_address,
      lat: location.geometry.location.lat,
      lng: location.geometry.location.lng,
    };
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error en el servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
