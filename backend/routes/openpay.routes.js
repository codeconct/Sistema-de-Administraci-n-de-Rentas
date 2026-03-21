import { Router } from 'express';
import pool from '../db.js'; // adjust path if needed

import { authMiddleware } from '../middlewares/auth.js'

const router = Router();

// --- NUEVA RUTA: INICIAR PAGO CON OPENPAY ---
router.post('/pagos/openpay', authMiddleware, (req, res) => {
    const { monto, descripcion } = req.body;
    const openpay = new Openpay(process.env.OPENPAY_MERCHANT_ID, process.env.OPENPAY_PRIVATE_KEY, false);
    const cliente = req.user.name;

    const chargeRequest = {
        method: 'card',
        amount: monto,
        description: descripcion,
        order_id: `REC-${Date.now()}`,
        customer: {
            name: cliente.nombre,
            last_name: cliente.apellidos,
            phone_number: cliente.telefono,
            email: cliente.correo
        },
        send_email: true,
        confirm: false,
        redirect_url: 'http://localhost:3000/Home?pago=exitoso'
    };

    openpay.charges.create(chargeRequest, (error, charge) => {
        if (error) {
            console.error("❌ Error de Openpay:", error);
            return res.status(400).json({
                success: false,
                message: "No se pudo generar el cobro",
                detalles: error.description
            });
        }

        console.log("✅ Link de Openpay generado exitosamente");
        res.status(200).json({
            success: true,
            payment_url: charge.payment_method.url
        });
    });
});

router.get('/dashboard-cliente', authMiddleware, async (req, res) => {
    try {
        const id = req.user.id;

        // 👉 MODIFICADO: Agregamos i.id as invoiceid
        const queryFactura = `
      SELECT i.id as invoiceid, i.amount, i.duedate, i.status, t.name, t.phone, t.email, a.address
      FROM invoices i
      JOIN rentalcontracts rc ON i.contractid = rc.id
      JOIN tenants t ON rc.tenantid = t.id
      JOIN apartments a ON rc.apartmentid = a.id
      WHERE t.id = $1
      ORDER BY i.duedate DESC LIMIT 1
    `;
        const resFactura = await pool.query(queryFactura, [id]);

        const queryRecibos = `
      SELECT i.id, i.duedate, i.amount 
      FROM invoices i
      JOIN rentalcontracts rc ON i.contractid = rc.id
      WHERE rc.tenantid = $1 AND i.status = 'PAID'
      ORDER BY i.duedate DESC
    `;
        const resRecibos = await pool.query(queryRecibos, [id]);

        res.json({
            datosVivienda: resFactura.rows[0] || null,
            historialRecibos: resRecibos.rows || []
        });
    } catch (err) {
        console.error("❌ Error en dashboard:", err.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
