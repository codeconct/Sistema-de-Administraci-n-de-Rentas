import { Router } from 'express';
import pool from '../db.js'; // adjust path if needed
import Openpay from 'openpay';

import { authMiddleware } from '../middlewares/auth.js'

const router = Router();

// --- NUEVA RUTA: INICIAR PAGO CON OPENPAY ---
router.post('/pagos/openpay', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const openpay = new Openpay(
        process.env.OPENPAY_MERCHANT_ID,
        process.env.OPENPAY_PRIVATE_KEY,
        false
    );

    const client = await pool.connect();

    try {
        /* -------- GET TENANT -------- */
        const tenantResult = await client.query(
            `
            SELECT id, name, email, phone
            FROM tenants
            WHERE id = $1
            `,
            [userId]
        );

        if (tenantResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tenant not found"
            });
        }

        const tenant = tenantResult.rows[0];

        /* -------- GET LAST UNPAID INVOICE -------- */
        const invoiceResult = await client.query(
            `
            SELECT i.*
            FROM invoices i
            JOIN rentalcontracts rc ON rc.id = i.contractid
            WHERE rc.tenantid = $1
              AND i.status = 'pending'  -- adjust if your status differs
            ORDER BY i.duedate ASC
            LIMIT 1
            `,
            [userId]
        );

        if (invoiceResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No unpaid invoices found"
            });
        }

        const invoice = invoiceResult.rows[0];

        /* -------- BUILD CUSTOMER -------- */
        const customerName = tenant.name || 'Inquilino';
        const customerLastName = ''; // adjust if you store it separately
        const customerPhone = tenant.phone || '';
        const customerEmail =
            tenant.email ||
            `${String(tenant.name || 'cliente').replace(/\s+/g, '.').toLowerCase()}@example.com`;

        /* -------- CREATE CHARGE -------- */
        const chargeRequest = {
            method: 'card',
            amount: invoice.amount, // <-- from invoice
            description: `Pago de renta - Factura #${invoice.id}`,
            order_id: `REC-${invoice.id}-${Date.now()}`,
            customer: {
                name: customerName,
                last_name: customerLastName,
                phone_number: customerPhone,
                email: customerEmail
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

            console.log("✅ Link de Openpay generado");
            res.status(200).json({
                success: true,
                payment_url: charge.payment_method.url,
                invoice_id: invoice.id
            });
        });

    } catch (err) {
        console.error("❌ Server error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    } finally {
        client.release();
    }
});

router.get('/dashboard-cliente', authMiddleware, async (req, res) => {
    try {
        const id = req.user.id;

        // 👉 MODIFICADO: Agregamos i.id as invoiceid
        const queryFactura = `
      SELECT i.id as invoiceid, i.amount, i.duedate, i.status, t.name, t.phone, t.email, a.street as address, a.division
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

router.post('/webhooks/openpay', async (req, res) => {
    console.log("🔔 Webhook recibido de Openpay. Evento:", req.body.type);

    try {
        const evento = req.body;
        console.log(evento);

        if (evento.type === 'charge.succeeded') {
            const transaccion = evento.transaction;
            const orderId = transaccion.order_id; // Ejemplo: "REC-5"
            const monto = transaccion.amount;

            // Verificamos que traiga nuestro identificador
            if (orderId && orderId.startsWith('REC-')) {
                const invoiceId = orderId.split('-')[1]; // Extraemos el "5"

                console.log(`✅ Pago detectado. Actualizando Recibo ID: ${invoiceId}...`);

                // Cambiamos el estado en la base de datos a PAGADO
                await pool.query("UPDATE invoices SET status = 'PAID' WHERE id = $1", [invoiceId]);

                // Guardamos el registro en la tabla de pagos
                await pool.query(
                    "INSERT INTO payments (invoiceid, paymentdate, amount, method) VALUES ($1, CURRENT_DATE, $2, 'TARJETA_OPENPAY')",
                    [invoiceId, monto]
                );

                console.log("💾 ¡Recibo procesado y actualizado con éxito!");
            }
        }

        // MANDATORIO: Responder 200 OK para que Openpay deje de insistir
        res.status(200).send('Webhook procesado');
    } catch (error) {
        console.error("❌ Error procesando el Webhook:", error.message);
        res.status(500).send('Error interno');
    }
});

export default router;
