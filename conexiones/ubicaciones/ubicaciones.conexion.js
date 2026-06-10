export async function getDistance(lat, lon) {
  const info = {
    lat: lat,
    lon: lon,
  };
  const URL = process.env.URL_SERVICE_MODEL;
  try {
    const response = await fetch(`${URL}api/location/map`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
      method: "POST",
    });
    const { message } = await response.json();
    return message;
  } catch (e) {
    console.log(e.message);
    return null;
  }
}
