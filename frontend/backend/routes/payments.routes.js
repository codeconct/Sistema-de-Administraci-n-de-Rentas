// routes/payments.routes.js
import { Router } from 'express';
import pool from '../db.js';  // adjust path if needed

const router = Router();

// GET all payments
router.get('/payments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payments');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET payment by ID
router.get('/payments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM payments WHERE paymentid = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE payment
router.post('/payments', async (req, res) => {
  const { invoiceid, paymentdate, amount, method } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO payments (invoiceid, paymentdate, amount, method)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [invoiceid, paymentdate, amount, method]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE payment
router.put('/payments/:id', async (req, res) => {
  const { id } = req.params;
  const { invoiceid, paymentdate, amount, method } = req.body;
  try {
    const result = await pool.query(
      `UPDATE payments
       SET invoiceid = $1, paymentdate = $2, amount = $3, method = $4
       WHERE paymentid = $5 RETURNING *`,
      [invoiceid, paymentdate, amount, method, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE payment
router.delete('/payments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM payments WHERE paymentid = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: `Payment ${id} deleted`, payment: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
