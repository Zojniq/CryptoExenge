import { pool } from "./db.js"

export async function getBranches() {
  try {
    return await pool.query("SELECT id , name FROM branches WHERE is_active = TRUE");
  } catch (err) {
    console.error("Error:", err);
  }
}

export async function getCryptos() {
  try {
    return await pool.query("SELECT id , code, network FROM cryptos ORDER BY id");
    } catch (err) {
    console.error("Error:", err);
  }
}

export async function getSlots() {
  try {
    return await pool.query("SELECT id, start_time, end_time FROM time_slots ORDER BY start_time");
  } catch (err) {
    console.error("Error:", err);
  }
}
