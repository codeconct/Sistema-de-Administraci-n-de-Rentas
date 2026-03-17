export default function ArrendatarioForm({ data, update }) {
    return (
        <>
            <h6 className="fw-bold mb-3">Datos del Contrato de Venta</h6>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Fecha de inicio</label>
                    <input
                        className="form-control"
                        type="date" value={data.startDate}
                        onChange={(e) => update("startDate", e.target.value)} />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Fecha de fin</label>
                    <input
                        className="form-control"
                        type="date" value={data.endDate}
                        onChange={(e) => update("endDate", e.target.value)} />
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Deposito mensual</label>
                <input
                    type="number"
                    className="form-control"
                    value={data.price}
                    onChange={(e) => update("price", e.target.value)} />
            </div>
        </>
    );
}