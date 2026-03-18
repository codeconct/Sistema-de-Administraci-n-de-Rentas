// routes/rentalcontracts.routes.js
import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET all contracts
router.get('/rentalcontracts', async (req, res) => {
  try {
    const result = await pool.query("SELECT  c.id, a.name, t.name as tenantname, c.startdate, c.enddate, c.depositamount FROM rentalcontracts c INNER JOIN apartments a ON c.apartmentid = a.id INNER JOIN tenants t ON c.tenantid = t.id;");
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
      'SELECT * FROM rentalcontracts WHERE id = $1',
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

router.post('/rentalcontracts', async (req, res) => {
  const {
    apartmentid,
    tenant,
    guarantor,
    startdate,
    enddate,
    depositamount,
    status
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* -------- TENANT UPSERT -------- */

    const tenantResult = await client.query(
      `
      INSERT INTO tenants (name, email, phone)
      VALUES ($1, $2, $3)
      ON CONFLICT (name)
      DO UPDATE SET
        email = EXCLUDED.email,
        phone = EXCLUDED.phone
      RETURNING id
      `,
      [
        tenant.name,
        tenant.email,
        tenant.phone
      ]
    );

    const tenantId = tenantResult.rows[0].id;


    /* -------- GUARANTOR UPSERT -------- */

    let guarantorId = null;

    if (guarantor) {
      const guarantorResult = await client.query(
        `
        INSERT INTO guarantors (name, address, email, phone)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name)
        DO UPDATE SET
          address = EXCLUDED.address,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone
        RETURNING id
        `,
        [
          guarantor.name,
          guarantor.address,
          guarantor.email,
          guarantor.phone
        ]
      );

      guarantorId = guarantorResult.rows[0].id;
    }


    /* -------- CONTRACT INSERT -------- */

    const contractResult = await client.query(
      `
      INSERT INTO rentalcontracts
      (apartmentid, tenantid, guarantorid, startdate, enddate, depositamount, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        apartmentid,
        tenantId,
        guarantorId,
        startdate,
        enddate || null,
        depositamount || null,
        status || "ACTIVE"
      ]
    );

    await client.query("COMMIT");

    res.status(201).json(contractResult.rows[0]);

  } catch (err) {

    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: err.message });

  } finally {
    client.release();
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
       WHERE id = $8 RETURNING *`,
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
      'DELETE FROM rentalcontracts WHERE id = $1 RETURNING *',
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