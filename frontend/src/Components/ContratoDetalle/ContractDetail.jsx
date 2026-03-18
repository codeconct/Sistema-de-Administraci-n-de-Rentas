import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { REACT_APP_API_URL } from "../../config";
export const token = localStorage.getItem("token");




const StatusBadge = ({ status }) => {


    let color = "secondary";
    let dotColor = "secondary";

    if (status === "PENDING") {
        color = "danger";
        dotColor = "danger";
    } else if (status === "PAID") {
        color = "success";
        dotColor = "success";
    } else if (status === "PENDING") {
        color = "warning";
        dotColor = "warning";
    }

    return (
        <span className={`badge bg-light text-dark border`}>
            <span
                className={`me-1 rounded-circle bg-${dotColor}`}
                style={{ width: 8, height: 8, display: "inline-block" }}
            ></span>
            {status}
        </span>
    );
};

export default function ContractDetails() {

    const { id } = useParams();
    const [contrato, setContrato] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invoices, setInvoices] = useState([]);

    function formatDate(dateString) {
        const date = new Date(dateString);

        return new Intl.DateTimeFormat('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    }

    // ⬇ Fetch data from backend on page load
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [contractRes, invoicesRes] = await Promise.all([
                    fetch(`${REACT_APP_API_URL}/rentalcontracts/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${REACT_APP_API_URL}/invoices?contract_id=${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                if (!contractRes.ok || !invoicesRes.ok) {
                    throw new Error("Error loading data");
                }

                const contractData = await contractRes.json();
                const invoicesData = await invoicesRes.json();

                setContrato(contractData);
                setInvoices(invoicesData);

            } catch (err) {
                console.error(err);
                setError("Error loading data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, token]);


    if (loading) return <div className="text-center py-5">Cargando datos...</div>;
    if (error) return <div className="text-center py-5 text-danger">{error}</div>;

    const contractId = contrato?.id ? String(contrato.id).padStart(4, "0") : "----";

    return (
        <div className="container-fluid px-5 py-4 bg-light min-vh-100">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold">Contratos</h3>
                    <p className="text-muted mb-1">
                        Consulta los contratos que han sido generados en el sistema.
                    </p>

                    <div className="mt-2">
                        <span className="text-muted">Todos los Contratos</span>
                        <span className="mx-2">{">"}</span>
                        <span className="text-primary fw-semibold">
                            Detalles del Contrato-{contractId}
                        </span>
                    </div>
                </div>

                <button className="btn btn-dark">
                    <i className="bi bi-download me-2"></i>
                    Descargar contrato en PDF
                </button>
            </div>

            <div className="row g-4">

                {/* LEFT SIDE - PAYMENT TABLE */}
                <div className="col-lg-8">
                    <div className="card w-100 shadow-sm border-0 rounded-4">
                        <div className="card-body">

                            <h6 className="fw-bold mb-3">
                                <i className="bi bi-credit-card me-2"></i>
                                Corrida de pagos de renta
                            </h6>

                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Fecha de pago</th>
                                            <th>Concepto</th>
                                            <th>Pago pendiente</th>
                                            <th>Pagado</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((p, index) => (
                                            <tr key={p.id}>
                                                <td>{formatDate(p.created_at)}</td>
                                                <td>Pago de renta</td>
                                                <td className="text-warning fw-semibold">
                                                    ${p.amount - p.total_paid}
                                                </td>
                                                <td className="text-success fw-semibold">
                                                    ${p.total_paid}
                                                </td>
                                                <td>
                                                    <StatusBadge status={p.status} />
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button title="Ver recivo" className="btn btn-sm btn-outline-secondary">
                                                            <i className="bi bi-receipt"></i>
                                                        </button>
                                                        <button title="Editar pago" className="btn btn-sm btn-outline-secondary">
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button title="Enviar recordatorio" className="btn btn-sm btn-outline-secondary">
                                                            <i className="bi bi-envelope"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex justify-content-between mt-3">
                                <small className="text-muted">Mostrando {invoices.length} pagos</small>
                                <small className="text-muted">
                                    Página 1 de 1
                                </small>
                            </div>

                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - CONTRACT INFO */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body">

                            <h6 className="fw-bold mb-3">
                                <i className="bi bi-info-circle me-2"></i>
                                Información del Contrato
                            </h6>

                            <div className="mb-3">
                                <small className="text-muted">Costo de Renta</small>
                                <div className="text-success fw-bold">${contrato.depositamount}</div>
                            </div>

                            <div className="mb-3">
                                <small className="text-muted">Arrendatario</small>
                                <div>{contrato.tenantname}</div>
                            </div>

                            <div>
                                <small className="text-muted">Duración del contrato</small>
                                <div>
                                    {formatDate(contrato.startdate)} al
                                    <br />
                                    {formatDate(contrato.enddate)}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
