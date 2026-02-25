const express = require("express");
const router = express.Router();
const ticketsController = require("../ticketsController");

router.post("/", ticketsController.crearTicket);
router.get("/", ticketsController.obtenerTickets);
router.put("/:id", ticketsController.actualizarEstado);

module.exports = router;
