import { getLocations } from "../services/db.services.js";

export async function calculateDistance(lat, lon) {
  const R = 6371;
  const error = 400 / 1000;
  let results = [];
  let response = "";
  try {
    const locations = await getLocations();
    for (const location of locations) {
      const latDest = location.latitud * (Math.PI / 180);
      const lonDest = location.longitud * (Math.PI / 180);

      const latOrigen = lat * (Math.PI / 180);
      const lonOrigen = lon * (Math.PI / 180);

      const difLat = latDest - latOrigen;
      const difLon = lonDest - lonOrigen;

      const a =
        Math.sin(difLat / 2) ** 2 +
        Math.cos(latOrigen) * Math.cos(latDest) * Math.sin(difLon / 2) ** 2;

      const distance = 2 * Math.asin(Math.sqrt(a)) * R;

      const res = Math.round(distance * 100) / 100;
      if (res <= 2) {
        results.push(location);
      }
    }
    if (results.length>0) {
      response += "Las oficinas más cercanas son:";
      for (const result of results) {
        response += `\n<b>${result.direccion_textual}</b>\n<b>Días de atención: </b>${result.dias_aplicables} (${result.hora_apertura} - ${result.hora_cierre})\nTramites disponibles: <i>${result.tramites_disponibles}</i>\n`;
      }
    } else {
      response = "No se encontraron oficinas cercanas a su ubicacion";
    }
    return response;
  } catch (e) {
    throw e;
  }
}
