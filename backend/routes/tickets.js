const express = require("express");
const router = express.Router();

const ticketStore = require("../models/ticketStore");

// Crear ticket
router.post("/", (req, res) => {
    const { descripcion, apartamento } = req.body;

    if (!descripcion || !apartamento) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    const ticket = ticketStore.crearTicket({ descripcion, apartamento });
    res.status(201).json(ticket);
});

// Ver todos los tickets
router.get("/", (req, res) => {
    res.json(ticketStore.obtenerTickets());
});

// Asignar ticket a técnico
router.put("/:id/asignar", (req, res) => {
    const id = parseInt(req.params.id);
    const { tecnico } = req.body;

    const ticket = ticketStore.asignarTicket(id, tecnico);

    if (!ticket) {
        return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(ticket);
});

// Cambiar estatus
router.put("/:id/estatus", (req, res) => {
    const id = parseInt(req.params.id);
    const { estatus } = req.body;

    const ticket = ticketStore.cambiarEstatus(id, estatus);

    if (!ticket) {
        return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(ticket);
});

module.exports = router;