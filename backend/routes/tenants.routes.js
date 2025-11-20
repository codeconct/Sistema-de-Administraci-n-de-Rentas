// routes/tenants.routes.js
import { Router } from 'express';
import pool from '../db.js';  // adjust path if needed

const router = Router();

// GET all tenants
router.get('/tenants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tenants');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET tenant by ID
router.get('/tenants/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tenants WHERE tenantid = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE tenant
router.post('/tenants', async (req, res) => {
  const { name, phone, email, governmentid, passwordhash } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tenants (name, phone, email, governmentid, passwordhash)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userid, name, phone, email, governmentid, passwordhash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE tenant
router.put('/tenants/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, governmentid, passwordhash } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tenants
       SET name = $1, phone = $2, email = $3, governmentid = $4, passwordhash = $5
       WHERE tenantid = $6 RETURNING *`,
      [userid, name, phone, email, governmentid, passwordhash, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE tenant
router.delete('/tenants/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM tenants WHERE tenantid = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json({ message: `Tenant ${id} deleted`, tenant: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
