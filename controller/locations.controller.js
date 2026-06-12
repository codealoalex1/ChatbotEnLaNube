import { calculateDistance } from "../function/distance.function.js";

export async function getLocationsController(req, res) {
    const { lat, lon } = req.body;
    try {
        const response = await calculateDistance(lat, lon);
        res.status(200).json({
          message: response,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error en el servidor"
        });
    }
}