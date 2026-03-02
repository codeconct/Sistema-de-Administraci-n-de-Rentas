function verPagos(pagos, diasAviso =10){
    const hoy= new Date();
    hoy.setHours(0,0,0,0);

    const resultados =[];

    for (const pago of pagos){
        const [mes, dia, año] = pago.vencimiento.split("-");
        const fechaVen = new Date(año, mes -1, dia);

        const diasRes = Math.floor(
            (fechaVen - hoy) / (1000 * 60 * 60 *24)
        );

        let estado, mensaje;

        if (diasRes < 0 ){
            estado = "Vencido";
            mensaje = "PAGO VENCIDO";
        }else if (diasRes === 0){
            estado= "Hoy";
            mensaje = "Su pago vence hoy";
        }else if (diasRes <= diasAviso){
            estado = "Aviso";
            mensaje = `Su pago vence en ${diasRes} dias`;
        } else{
            continue;
        }
        resultados.push({
            apartamento: pago.Apartamento,
            monto: pago.monto,
            estado: estado,
            dias_restantes: diasRes,
        });
    }

    return resultados;
}
module.exports = verPagos;