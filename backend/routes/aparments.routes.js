// apartments.routes.js
import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middlewares/auth.js'

const router = Router();

// GET all apartments
router.get("/apartments", authMiddleware, async (req, res) => {
  try {
    const ownerId = req.user.id;

    const result = await pool.query(
      `
      SELECT
          a.*,
          rc.depositamount,
          t.name AS tenant_name,
          i.duedate AS latest_due_date
      FROM apartments a
      LEFT JOIN rentalcontracts rc
          ON rc.apartmentid = a.id
      LEFT JOIN tenants t
          ON rc.tenantid = t.id
      LEFT JOIN LATERAL (
          SELECT duedate
          FROM invoices
          WHERE contractid = rc.id
          ORDER BY duedate DESC
          LIMIT 1
      ) i ON true
      WHERE a.ownerid = $1;
      `,
      [ownerId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err); // important for debugging
    res.status(500).json({ error: "Error fetching apartments" });
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
router.post('/apartments', authMiddleware, async (req, res) => {
  const ownerId = req.user.id;
  const { address, name, city, state } = req.body; // adapt fields to your table
  try {
    const result = await pool.query(
      'INSERT INTO apartments (ownerid, address, name, city, state) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [ownerId, address, name, city, state]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err), $;
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT (update) an apartment
router.put('/apartments/:id', async (req, res) => {
  const { id } = req.params;
  const { ownerid, address, monthlyrent, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE apartments SET ownerid = $1, address = $2, monthlyrent = $3, status =$4  WHERE id = $5 RETURNING *',
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
