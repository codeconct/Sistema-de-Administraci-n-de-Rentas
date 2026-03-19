import { Router } from "express";
import pool from "../db.js";

const router = Router();

const ESTATUS_VALIDOS = ["ABIERTO", "EN_PROCESO", "EN_ESPERA", "RESUELTO"];

const normalizarEstatus = (estatus) => {
  const upper = String(estatus || "").toUpperCase();
  return ESTATUS_VALIDOS.includes(upper) ? upper : null;
};

// Crear ticket
router.post("/tickets", async (req, res) => {
  try {
    const {
      descripcion,
      apartmentId,
      apartment_id,
      apartmentLabel,
      apartment_label,
      estatus,
      responsable,
    } = req.body || {};

    if (!descripcion) {
      return res.status(400).json({ error: "Descripcion requerida" });
    }

    const estatusFinal = normalizarEstatus(estatus) || "ABIERTO";

    const result = await pool.query(
      `
        INSERT INTO maintenance_tickets
          (apartment_id, apartment_label, descripcion, estatus, responsable, fecha_asignacion)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [
        apartmentId ?? apartment_id ?? null,
        apartmentLabel ?? apartment_label ?? null,
        descripcion,
        estatusFinal,
        responsable || null,
        responsable ? new Date() : null,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creando ticket:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Ver todos los tickets
router.get("/tickets", async (req, res) => {
  try {
    const { estatus } = req.query;
    const estatusNormalizado = estatus ? normalizarEstatus(estatus) : null;

    if (estatus && !estatusNormalizado) {
      return res.status(400).json({ error: "Estatus invalido" });
    }

    const filtros = [];
    const valores = [];

    if (estatusNormalizado) {
      valores.push(estatusNormalizado);
      filtros.push(`estatus = $${valores.length}`);
    }

    const whereClause = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";

    const result = await pool.query(
      `
        SELECT *
        FROM maintenance_tickets
        ${whereClause}
        ORDER BY fecha_creacion DESC
      `,
      valores
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("Error consultando tickets:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Ver ticket por ID
router.get("/tickets/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await pool.query(
      "SELECT * FROM maintenance_tickets WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Error consultando ticket:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Asignar ticket a tecnico/responsable
router.put("/tickets/:id/asignar", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { responsable, estatus } = req.body || {};

    if (!responsable) {
      return res.status(400).json({ error: "Responsable requerido" });
    }

    const estatusFinal = normalizarEstatus(estatus) || "EN_PROCESO";

    const result = await pool.query(
      `
        UPDATE maintenance_tickets
        SET responsable = $1,
            estatus = $2,
            fecha_asignacion = COALESCE(fecha_asignacion, NOW()),
            fecha_actualizacion = NOW()
        WHERE id = $3
        RETURNING *
      `,
      [responsable, estatusFinal, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Error asignando ticket:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Cambiar estatus
router.put("/tickets/:id/estatus", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const estatusFinal = normalizarEstatus(req.body?.estatus);

    if (!estatusFinal) {
      return res.status(400).json({ error: "Estatus invalido" });
    }

    const result = await pool.query(
      `
        UPDATE maintenance_tickets
        SET estatus = $1,
            fecha_actualizacion = NOW(),
            fecha_resolucion = CASE WHEN $1 = 'RESUELTO' THEN NOW() ELSE fecha_resolucion END
        WHERE id = $2
        RETURNING *
      `,
      [estatusFinal, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Error cambiando estatus:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
