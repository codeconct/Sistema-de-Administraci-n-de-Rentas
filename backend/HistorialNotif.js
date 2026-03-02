const historial = [];

function guardarNotificacion(data) {
    historial.push({
        id: historial.length + 1,
        arrendatario: data.nombre,
        apartamento: data.apartamento,
        tipo: data.tipo,
        mensaje: data.mensaje,
        fechaEnvio: new Date()
    });
}

function obtenerHistorial() {
    return historial;
}

function obtenerPorArrendatario(nombre) {
    return historial.filter(n => n.arrendatario === nombre);
}

module.exports = {
    guardarNotificacion,
    obtenerHistorial,
    obtenerPorArrendatario
};
