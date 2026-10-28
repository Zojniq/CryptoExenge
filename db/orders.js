import { pool } from "./db.js";
import { randomBytes } from 'node:crypto';

export async function createOrder(order) {
  const publicCode = randomBytes(4).toString('hex');

  const rows = await pool.query(
    `INSERT INTO orders (public_code, branch_id, crypto_id, slot_id, visit_date,
                         fiat_amount, fiat_currency, rate, crypto_amount)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING public_code`,
    [publicCode, order.branch_id, order.crypto_id, order.slot_id, order.visit_date,
     order.fiat_amount, order.fiat_currency, order.rate, order.crypto_amount]
  );

  return rows[0].public_code;
}


export async function getOrderByCode(code) {
  const rows = await pool.query(
    `SELECT orders.*,
           branches.name AS branch_name,
           cryptos.code AS crypto_code,
           cryptos.network,
           time_slots.start_time,
           time_slots.end_time
     FROM orders
     JOIN branches ON branches.id = orders.branch_id
     JOIN cryptos ON cryptos.id = orders.crypto_id
     JOIN time_slots ON time_slots.id = orders.slot_id
     WHERE public_code = ?`,
     [code]);
  return rows[0];
}
