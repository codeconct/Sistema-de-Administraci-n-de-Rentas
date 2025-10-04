// routes/owners.routes.js
import { Router } from 'express';
import pool from '../db.js';  // adjust path if needed

const router = Router();


// GET all owners
router.get('/owners', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM owners');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// GET owner by ID
router.get('/owners/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM owners WHERE ownerid = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// CREATE owner
router.post('/owners', async (req, res) => {
  const { name, phone, email, governmentid, passwordhash } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO owners (name, phone, email, governmentid, passwordhash)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userid, name, phone, email, governmentid, passwordhash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// UPDATE owner
router.put('/owners/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, governmentid, passwordhash } = req.body;
  try {
    const result = await pool.query(
      `UPDATE owners
       SET name = $1, phone = $2, email = $3, governmentid = $4, passwordhash = $5
       WHERE ownerid = $6 RETURNING *`,
      [name, phone, email, governmentid, passwordhash, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// DELETE owner
router.delete('/owners/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM owners WHERE ownerid = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    res.json({ message: `Owner ${id} deleted`, owner: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
