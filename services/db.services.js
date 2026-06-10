import { pool } from "../config/conection.db.js";
import { queries } from "../queries/queries.js";

export async function getLocations (){
    try {
        const query = queries[2].query;
        const response = await pool.query(query);
        return response.rows;
    } catch (e) {
        throw new Error(e.message);
    }
}

export async function saveFormForeign(datos) {
    try {
        const query = `INSERT INTO formulario_extranjero (id, nombre, apellido_paterno, correo) VALUES ($1, $2, $3, $4)`;
        const response = await pool.query(query, datos);
        return response;
    } catch (e) {
        throw new Error(e.message);
    }
}