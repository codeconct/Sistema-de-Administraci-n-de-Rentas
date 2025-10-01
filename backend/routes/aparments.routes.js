// apartments.routes.js
import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET all apartments
router.get('/apartments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM apartments');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET apartment by ID
router.get('/apartments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM apartments WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST (create) a new apartment
router.post('/apartments', async (req, res) => {
  const { name, location, price } = req.body; // adapt fields to your table
  try {
    const result = await pool.query(
      'INSERT INTO apartments (name, location, price) VALUES ($1, $2, $3) RETURNING *',
      [name, location, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT (update) an apartment
router.put('/apartments/:id', async (req, res) => {
  const { id } = req.params;
  const { name, location, price } = req.body;
  try {
    const result = await pool.query(
      'UPDATE apartments SET name = $1, location = $2, price = $3 WHERE id = $4 RETURNING *',
      [name, location, price, id]
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

// DELETE an apartment
router.delete('/apartments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM apartments WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    res.json({ message: `Apartment ${id} deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
