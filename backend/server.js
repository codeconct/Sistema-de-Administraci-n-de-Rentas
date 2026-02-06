import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';

const app = express();
const PORT = 5000;

// --- MIDDLEWARE ---
// 1. Allow Frontend to talk to Backend (CORS)
app.use(cors());
// 2. Allow Backend to read JSON data (CRITICAL for receiving Surcharge Config)
app.use(express.json());

// --- DATABASE CONNECTION ---
const pool = new Pool({
  connectionString: "postgresql://postgres:orozco24@localhost:5432/postgres",
  ssl: false 
});

// --- API ROUTES ---

// 1. Get Invoices (For Dashboard Table)
app.get('/api/facturas', async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (err) {
    console.error("❌ API Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. Generate Bulk Invoices (WITH SURCHARGE LOGIC)
app.post('/api/generar-facturas', async (req, res) => {
  try {
    // A. Receive Configuration from Frontend
    const { moraType, moraValue } = req.body;
    
    // Parse value to number (safety check)
    const valorMora = parseFloat(moraValue) || 0;

    console.log(`📡 Request Received: Generating invoices with Mora: ${moraType} | Value: ${valorMora}`);

    // B. Get Active Contracts
    const contratos = await pool.query("SELECT * FROM rentalcontracts WHERE status = 'ACTIVE'");
    const periodo = new Date().toISOString().slice(0, 7); // YYYY-MM Format
    
    // Set Due Date (e.g., 10 days from today)
    const vto = new Date(); 
    vto.setDate(vto.getDate() + 10);
    const vtoStr = vto.toISOString().slice(0, 10);

    let creadas = 0;

    // C. The Loop (Iterate through contracts)
    for (const contrato of contratos.rows) {
      
      // Check for Idempotency (Does invoice exist for this month?)
      const existe = await pool.query(
        "SELECT * FROM invoices WHERE contractid = $1 AND TO_CHAR(duedate, 'YYYY-MM') = $2",
        [contrato.id, periodo]
      );

      if (existe.rows.length === 0) {
        // Get Base Rent for this specific apartment
        const apto = await pool.query("SELECT monthlyrent FROM apartments WHERE id = $1", [contrato.apartmentid]);
        
        if (apto.rows.length > 0) {
          let rentaBase = parseFloat(apto.rows[0].monthlyrent);
          let totalAPagar = rentaBase;

          // --- BUSINESS LOGIC ENGINE (Point 2 of Documentation) ---
          if (valorMora > 0) {
            if (moraType === 'FIJO') {
              // Logic A: Add Fixed Amount
              totalAPagar += valorMora;
              console.log(`   -> Contract ${contrato.id}: Base ${rentaBase} + Fixed ${valorMora} = ${totalAPagar}`);
            } else if (moraType === 'PORCENTAJE') {
              // Logic B: Add Percentage
              const extra = (rentaBase * (valorMora / 100));
              totalAPagar += extra;
              console.log(`   -> Contract ${contrato.id}: Base ${rentaBase} + ${valorMora}% (${extra}) = ${totalAPagar}`);
            }
          }
          // -------------------------------------------------------

          // D. Persistence (Save to DB)
          await pool.query(
            "INSERT INTO invoices (contractid, amount, duedate, status) VALUES ($1, $2, $3, 'PENDING')",
            [contrato.id, totalAPagar, vtoStr]
          );
          creadas++;
        }
      }
    }
    res.json({ success: true, message: `Successfully generated ${creadas} new invoices.` });

  } catch (err) {
    console.error("❌ Generation Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Register Payment
app.post('/api/registrar-pago', async (req, res) => {
  const { invoiceid, amount, method } = req.body;
  try {
    await pool.query(
      "INSERT INTO payments (invoiceid, paymentdate, amount, method) VALUES ($1, CURRENT_DATE, $2, $3)",
      [invoiceid, amount, method]
    );
    await pool.query("UPDATE invoices SET status = 'PAID' WHERE id = $1", [invoiceid]);
    
    res.json({ success: true, message: "Payment registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Create New Property
app.post('/api/propiedades', async (req, res) => {
  try {
    const { nombre, direccion, renta, fecha_limite, tipo_mora, valor_mora } = req.body;
    const query = `
      INSERT INTO propiedades 
      (nombre, direccion, renta, fecha_limite, tipo_mora, valor_mora) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    const values = [nombre, direccion, renta, fecha_limite, tipo_mora, valor_mora];
    const newProperty = await pool.query(query, values);
    res.json(newProperty.rows[0]);
  } catch (err) {
    console.error("Error saving property:", err.message);
    res.status(500).send("Server Error");
  }
});

// --- START SERVER ---
app.listen(PORT, () => console.log(`🚀 API Backend Ready at http://localhost:${PORT}`));