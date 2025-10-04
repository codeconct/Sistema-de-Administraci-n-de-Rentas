// routes/rentalcontracts.routes.js
import { Router } from 'express';
import pool from '../db.js';  // adjust if needed

const router = Router();

// GET all contracts
router.get('/rentalcontracts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rentalcontracts');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET contract by ID
router.get('/rentalcontracts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM rentalcontracts WHERE contractid = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE contract
router.post('/rentalcontracts', async (req, res) => {
  const { apartmentid, tenantid, guarantorid, startdate, enddate, depositamount, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO rentalcontracts (apartmentid, tenantid, guarantorid, startdate, enddate, depositamount, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [apartmentid, tenantid, guarantorid || null, startdate, enddate || null, depositamount || null, status || 'ACTIVE']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE contract
router.put('/rentalcontracts/:id', async (req, res) => {
  const { id } = req.params;
  const { apartmentid, tenantid, guarantorid, startdate, enddate, depositamount, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE rentalcontracts
       SET apartmentid = $1, tenantid = $2, guarantorid = $3, startdate = $4, enddate = $5, depositamount = $6, status = $7
       WHERE contractid = $8 RETURNING *`,
      [apartmentid, tenantid, guarantorid || null, startdate, enddate || null, depositamount || null, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE contract
router.delete('/rentalcontracts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM rentalcontracts WHERE contractid = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.json({ message: `Contract ${id} deleted`, contract: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;