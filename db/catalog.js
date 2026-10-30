import { pool } from "./db.js"

export async function getBranches() {
    return await pool.query("SELECT id , name FROM branches WHERE is_active = TRUE");
}

export async function getCryptos() {
    return await pool.query("SELECT id , code, network FROM cryptos ORDER BY id");
}

export async function getSlots() {
    return await pool.query("SELECT id, start_time, end_time FROM time_slots ORDER BY start_time");
}
