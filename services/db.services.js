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