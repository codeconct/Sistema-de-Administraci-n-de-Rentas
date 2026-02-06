import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';

const app = express();
const PORT = 5000;

// Habilitar CORS y lectura de JSON (Esto permite recibir los datos del Dashboard)
app.use(cors());
app.use(express.json());

// --- CONEXIÓN A BASE DE DATOS ---
const pool = new Pool({
  connectionString: "postgresql://postgres:orozco24@localhost:5432/postgres",
  ssl: false 
});

// --- RUTAS API ---

// 1. Obtener Facturas para el Dashboard
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
    console.error("❌ Error en API:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. Generar Facturas Masivas (ACTUALIZADO CON LÓGICA DE MORA)
app.post('/api/generar-facturas', async (req, res) => {
  try {
    // 1. Recibimos la configuración del Frontend
    const { moraType, moraValue } = req.body;
    
    // Convertimos el valor a número (por seguridad)
    const valorMora = parseFloat(moraValue) || 0;

    console.log(`📡 Solicitud recibida: Mora ${moraType} de ${valorMora}`);

    const contratos = await pool.query("SELECT * FROM rentalcontracts WHERE status = 'ACTIVE'");
    const periodo = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    // Fecha de vencimiento (ej. 10 días después de hoy)
    const vto = new Date(); vto.setDate(vto.getDate() + 10);
    const vtoStr = vto.toISOString().slice(0, 10);

    let creadas = 0;

    for (const contrato of contratos.rows) {
      // Verificar si ya existe factura este mes
      const existe = await pool.query(
        "SELECT * FROM invoices WHERE contractid = $1 AND TO_CHAR(duedate, 'YYYY-MM') = $2",
        [contrato.id, periodo]
      );

      if (existe.rows.length === 0) {
        // Obtenemos la renta base del apartamento
        const apto = await pool.query("SELECT monthlyrent FROM apartments WHERE id = $1", [contrato.apartmentid]);
        
        if (apto.rows.length > 0) {
          let rentaBase = parseFloat(apto.rows[0].monthlyrent);
          let totalAPagar = rentaBase;

          // --- AQUÍ APLICAMOS LA MATEMÁTICA DE LA MORA ---
          if (valorMora > 0) {
            if (moraType === 'FIJO') {
              totalAPagar += valorMora;
            } else if (moraType === 'PORCENTAJE') {
              totalAPagar += (rentaBase * (valorMora / 100));
            }
          }

          // Insertamos la factura con el TOTAL calculado
          await pool.query(
            "INSERT INTO invoices (contractid, amount, duedate, status) VALUES ($1, $2, $3, 'PENDING')",
            [contrato.id, totalAPagar, vtoStr]
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

// 4. Crear Nueva Propiedad
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
    console.error("Error al guardar propiedad:", err.message);
    res.status(500).send("Error del servidor");
  }
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => console.log(`🚀 API Backend lista en http://localhost:${PORT}`));