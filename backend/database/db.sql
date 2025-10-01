import { Router } from 'express';
import pool from './db.js';

const router = Router();

// ✅ GET all apartments
router.get('/apartments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM apartments');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ GET apartment by ID
router.get('/apartments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM apartments WHERE apartmentid = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ POST (create) new apartment
router.post('/apartments', async (req, res) => {
  const { ownerid, address, monthlyrent, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO apartments (ownerid, address, monthlyrent, status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [ownerid, address, monthlyrent, status || 'AVAILABLE']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ PUT (update apartment by ID)
router.put('/apartments/:id', async (req, res) => {
  const { id } = req.params;
  const { ownerid, address, monthlyrent, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE apartments
       SET ownerid = $1, address = $2, monthlyrent = $3, status = $4
       WHERE apartmentid = $5 RETURNING *`,
      [ownerid, address, monthlyrent, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ DELETE apartment
router.delete('/apartments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM apartments WHERE apartmentid = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    res.json({ message: `Apartment ${id} deleted`, apartment: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
