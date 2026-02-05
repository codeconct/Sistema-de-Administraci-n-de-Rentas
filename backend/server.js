import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors'; // Importamos CORS

const app = express();
const PORT = 5000; // Cambiamos a 5000 para no chocar con React

// Habilitar CORS para que React pueda pedir datos
app.use(cors());
app.use(express.json());

// Tu conexión a Supabase
const pool = new Pool({
  connectionString: "postgresql://postgres.ckxadrogfdgzlsrpwmvt:TU_PASSWORD_AQUI@aws-1-us-east-2.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

// --- RUTAS API (Devuelven JSON) ---

// 1. Obtener Facturas para el Dashboard
app.get('/api/facturas', async (req, res) => {
  try {
    // Agregué t.phone y a.apartment_number (o similar) si existen en tu BD
    // Si no tienes columna 'phone' en tenants, bórrala de este SELECT
    const sql = `
      SELECT i.id AS invoiceid, i.amount, i.duedate, i.status,
             t.name AS tenant_name, t.phone AS tenant_phone,
             a.address AS apartment_address
      FROM invoices i
      JOIN rentalcontracts rc ON i.contractid = rc.id
      JOIN tenants t ON rc.tenantid = t.tenantid
      JOIN apartments a ON rc.apartmentid = a.id
      ORDER BY i.duedate DESC
    `;
    const result = await pool.query(sql);
    
    // Enviamos JSON puro
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error en API:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. Generar Facturas Masivas
app.post('/api/generar-facturas', async (req, res) => {
  try {
    const contratos = await pool.query("SELECT * FROM rentalcontracts WHERE status = 'ACTIVE'");
    const periodo = new Date().toISOString().slice(0, 7); // YYYY-MM
    const vto = new Date(); vto.setDate(vto.getDate() + 10);
    const vtoStr = vto.toISOString().slice(0, 10);

    let creadas = 0;
    for (const contrato of contratos.rows) {
      const existe = await pool.query(
        "SELECT * FROM invoices WHERE contractid = $1 AND TO_CHAR(duedate, 'YYYY-MM') = $2",
        [contrato.id, periodo]
      );

      if (existe.rows.length === 0) {
        const apto = await pool.query("SELECT monthlyrent FROM apartments WHERE id = $1", [contrato.apartmentid]);
        if (apto.rows.length > 0) {
          await pool.query(
            "INSERT INTO invoices (contractid, amount, duedate, status) VALUES ($1, $2, $3, 'PENDING')",
            [contrato.id, apto.rows[0].monthlyrent, vtoStr]
          );
          creadas++;
        }
      }
    }
    res.json({ success: true, message: `Se generaron ${creadas} facturas nuevas.` });
  } catch (err) {
    console.error("❌ Error Generando:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Registrar Pago
app.post('/api/registrar-pago', async (req, res) => {
  const { invoiceid, amount, method } = req.body;
  try {
    await pool.query(
      "INSERT INTO payments (invoiceid, paymentdate, amount, method) VALUES ($1, CURRENT_DATE, $2, $3)",
      [invoiceid, amount, method]
    );
    await pool.query("UPDATE invoices SET status = 'PAID' WHERE id = $1", [invoiceid]);
    
    res.json({ success: true, message: "Pago registrado correctamente" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 API Backend lista en http://localhost:${PORT}`));