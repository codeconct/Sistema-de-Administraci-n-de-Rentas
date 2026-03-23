import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();
const UNDEFINED_COLUMN = '42703';

let maintenanceRequestsReadyPromise = null;

const ensureMaintenanceRequestsTable = async () => {
  if (!maintenanceRequestsReadyPromise) {
    maintenanceRequestsReadyPromise = pool.query(`
      CREATE TABLE IF NOT EXISTS maintenancerequests (
        requestid SERIAL PRIMARY KEY,
        apartmentid INT NOT NULL,
        tenantid INT,
        requestdate DATE NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING',
        completiondate DATE
      )
    `).catch((err) => {
      maintenanceRequestsReadyPromise = null;
      throw err;
    });
  }

  return maintenanceRequestsReadyPromise;
};

const normalizeStatus = (status) =>
  String(status || 'PENDING').toUpperCase() === 'COMPLETED' ? 'resuelta' : 'pendiente';

const mapRequestRow = (row) => ({
  id: row.request_id,
  apartmentid: row.apartment_id,
  tenantid: row.tenant_id,
  status: normalizeStatus(row.status),
  fecha: row.request_date,
  descripcion: row.description,
  completiondate: row.completion_date,
  ubicacion: row.apartment_address || 'Sin ubicacion',
  arrendatario: row.tenant_name || 'Sin asignar',
  avatar: null,
  img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'
});

const runRequestsQuery = async (role, userId) => {
  await ensureMaintenanceRequestsTable();

  const ownerFilter = role === 'owner';
  const whereClause = ownerFilter
    ? 'WHERE a.ownerid = $1'
    : 'WHERE mr.tenantid = $1';

  const queryWithCurrentColumns = `
    SELECT
      mr.requestid AS request_id,
      mr.apartmentid AS apartment_id,
      mr.tenantid AS tenant_id,
      mr.requestdate AS request_date,
      mr.description,
      mr.status,
      mr.completiondate AS completion_date,
      CONCAT_WS(', ', a.street, a.division, a.int_num, a.city, a.state, a.postal_code) AS apartment_address,
      t.name AS tenant_name
    FROM maintenancerequests mr
    JOIN apartments a ON a.id = mr.apartmentid
    LEFT JOIN tenants t ON t.id = mr.tenantid
    ${whereClause}
    ORDER BY mr.requestdate DESC, mr.requestid DESC
  `;

  const queryWithLegacyColumns = `
    SELECT
      mr.requestid AS request_id,
      mr.apartmentid AS apartment_id,
      mr.tenantid AS tenant_id,
      mr.requestdate AS request_date,
      mr.description,
      mr.status,
      mr.completiondate AS completion_date,
      a.address AS apartment_address,
      t.name AS tenant_name
    FROM maintenancerequests mr
    JOIN apartments a ON a.apartmentid = mr.apartmentid
    LEFT JOIN tenants t ON t.tenantid = mr.tenantid
    ${whereClause}
    ORDER BY mr.requestdate DESC, mr.requestid DESC
  `;

  try {
    return await pool.query(queryWithCurrentColumns, [userId]);
  } catch (err) {
    if (err?.code !== UNDEFINED_COLUMN) {
      throw err;
    }
    return pool.query(queryWithLegacyColumns, [userId]);
  }
};

const findTenantApartmentId = async (tenantId) => {
  const queryCurrent = `
    SELECT rc.apartmentid
    FROM rentalcontracts rc
    WHERE rc.tenantid = $1
    ORDER BY rc.startdate DESC NULLS LAST, rc.id DESC
    LIMIT 1
  `;

  const queryLegacy = `
    SELECT rc.apartmentid
    FROM rentalcontracts rc
    WHERE rc.tenantid = $1
    ORDER BY rc.startdate DESC NULLS LAST, rc.contractid DESC
    LIMIT 1
  `;

  try {
    const result = await pool.query(queryCurrent, [tenantId]);
    return result.rows[0]?.apartmentid ?? null;
  } catch (err) {
    if (err?.code !== UNDEFINED_COLUMN) {
      throw err;
    }
    const result = await pool.query(queryLegacy, [tenantId]);
    return result.rows[0]?.apartmentid ?? null;
  }
};

router.get('/maintenancerequests', authMiddleware, async (req, res) => {
  try {
    await ensureMaintenanceRequestsTable();
    const result = await runRequestsQuery(req.user.role, req.user.id);
    res.json(result.rows.map(mapRequestRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/maintenancerequests', authMiddleware, async (req, res) => {
  if (req.user.role !== 'tenant') {
    return res.status(403).json({ message: 'Only tenants can create maintenance requests' });
  }

  const description = req.body.description?.trim();

  if (!description) {
    return res.status(400).json({ message: 'description is required' });
  }

  try {
    await ensureMaintenanceRequestsTable();
    const apartmentid = await findTenantApartmentId(req.user.id);

    if (!apartmentid) {
      return res.status(400).json({ message: 'No active apartment found for this tenant' });
    }

    const insertResult = await pool.query(
      `
      INSERT INTO maintenancerequests (apartmentid, tenantid, requestdate, description, status, completiondate)
      VALUES ($1, $2, CURRENT_DATE, $3, 'PENDING', NULL)
      RETURNING requestid
      `,
      [apartmentid, req.user.id, description]
    );

    const allRequests = await runRequestsQuery('tenant', req.user.id);
    const created = allRequests.rows.find(
      (row) => row.request_id === insertResult.rows[0].requestid
    );

    res.status(201).json(created ? mapRequestRow(created) : { id: insertResult.rows[0].requestid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.patch('/maintenancerequests/:id/status', authMiddleware, async (req, res) => {
  if (!['owner', 'tenant'].includes(req.user.role)) {
    return res.status(403).json({ message: 'User role not allowed to update request status' });
  }

  const { id } = req.params;
  const status = req.body.status === 'resuelta' ? 'COMPLETED' : req.body.status === 'pendiente' ? 'PENDING' : null;

  if (!status) {
    return res.status(400).json({ message: 'status must be resuelta or pendiente' });
  }

  const completionValue = status === 'COMPLETED' ? 'CURRENT_DATE' : 'NULL';

  try {
    await ensureMaintenanceRequestsTable();
    let result;

    if (req.user.role === 'tenant') {
      result = await pool.query(
        `
        UPDATE maintenancerequests
        SET status = $1, completiondate = ${completionValue}
        WHERE requestid = $2
          AND tenantid = $3
        RETURNING requestid
        `,
        [status, id, req.user.id]
      );
    } else {
      const updateCurrent = `
        UPDATE maintenancerequests mr
        SET status = $1, completiondate = ${completionValue}
        FROM apartments a
        WHERE mr.requestid = $2
          AND a.id = mr.apartmentid
          AND a.ownerid = $3
        RETURNING mr.requestid
      `;

      const updateLegacy = `
        UPDATE maintenancerequests mr
        SET status = $1, completiondate = ${completionValue}
        FROM apartments a
        WHERE mr.requestid = $2
          AND a.apartmentid = mr.apartmentid
          AND a.ownerid = $3
        RETURNING mr.requestid
      `;

      try {
        result = await pool.query(updateCurrent, [status, id, req.user.id]);
      } catch (err) {
        if (err?.code !== UNDEFINED_COLUMN) {
          throw err;
        }
        result = await pool.query(updateLegacy, [status, id, req.user.id]);
      }
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const allRequests = await runRequestsQuery(req.user.role, req.user.id);
    const updated = allRequests.rows.find(
      (row) => row.request_id === result.rows[0].requestid
    );

    res.json(updated ? mapRequestRow(updated) : { id: Number(id), status: normalizeStatus(status) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
