const plantillas = {
    aviso: ({nombre, monto, fecha, dias }) =>
        `Buenos dias sr/sra ${nombre},
    se le recuerda que su pago de $${monto}MX vence el ${fecha}.
    Faltan ${dias} día(s) para la fecha lmite. `,
    hoy: ({nombre, monto}) =>
    `Buenos dias Sr/Sra ${nombre}, 
    su pago de $${monto} MX vence hoy.
    Favor de realizar el pago para evitar cargos extra.`,
    vencido: ({nombre, monto, fecha}) =>
        `Buen dia Sr/Sra ${nombre},
    Se le avisa que su pago de $${monto} MX ha vencido el dia ${fecha}.
    Se le pide regularizar su situacion lo antes posible`
};
module.exports = plantillas; 