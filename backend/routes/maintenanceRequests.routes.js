// routes/maintenancerequests.routes.js
import { Router } from 'express';
import pool from '../db.js'; // adjust path if needed

const router = Router();

// GET all maintenance requests
router.get('/maintenancerequests', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM maintenancerequests');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET maintenance request by ID
router.get('/maintenancerequests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM maintenancerequests WHERE requestid = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE maintenance request
router.post('/maintenancerequests', async (req, res) => {
  const { apartmentid, tenantid, requestdate, description, status, completiondate } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO maintenancerequests (apartmentid, tenantid, requestdate, description, status, completiondate)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [apartmentid, tenantid || null, requestdate, description, status || 'PENDING', completiondate || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE maintenance request
router.put('/maintenancerequests/:id', async (req, res) => {
  const { id } = req.params;
  const { apartmentid, tenantid, requestdate, description, status, completiondate } = req.body;
  try {
    const result = await pool.query(
      `UPDATE maintenancerequests
       SET apartmentid = $1, tenantid = $2, requestdate = $3, description = $4, status = $5, completiondate = $6
       WHERE requestid = $7 RETURNING *`,
      [apartmentid, tenantid || null, requestdate, description, status, completiondate || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE maintenance request
router.delete('/maintenancerequests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM maintenancerequests WHERE requestid = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json({ message: `Request ${id} deleted`, request: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
