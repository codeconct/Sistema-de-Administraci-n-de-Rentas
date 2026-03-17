import { Router } from 'express';
import pool from '../db.js'; // adjust path if needed

const router = Router();

// --- NUEVA RUTA: INICIAR PAGO CON OPENPAY ---
router.post('/api/pagos/openpay', (req, res) => {
    const { monto, descripcion, cliente } = req.body;
    const openpay = new Openpay(process.env.OPENPAY_MERCHANT_ID, process.env.OPENPAY_PRIVATE_KEY, false);

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

export default router;
