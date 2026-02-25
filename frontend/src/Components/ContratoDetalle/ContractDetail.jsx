import React from "react";
import { useParams } from "react-router-dom";


const payments = [
    {
        date: "28-ene-2026",
        concept: "Pago de renta",
        pending: "$6,900 MXN",
        paid: "$6,900 MXN",
        status: "Atrasado",
    },
    {
        date: "13-feb-2026",
        concept: "Pago de renta",
        pending: "$6,900 MXN",
        paid: "$6,900 MXN",
        status: "A tiempo",
    },
    {
        date: "28-feb-2026",
        concept: "Pago de renta",
        pending: "$6,900 MXN",
        paid: "$6,900 MXN",
        status: "A tiempo",
    },
    {
        date: "14-mar-2026",
        concept: "Pago de renta",
        pending: "$6,900 MXN",
        paid: "$6,900 MXN",
        status: "A tiempo",
    },
    {
        date: "30-mar-2026",
        concept: "Pago de renta",
        pending: "$6,900 MXN",
        paid: "$6,900 MXN",
        status: "Pendiente",
    },
];

const StatusBadge = ({ status }) => {

    const { id } = useParams();
    const [contract, setContract] = useState(null);

    useEffect(() => {
        fetch(`/api/contracts.php?id=${id}`)
            .then(res => res.json())
            .then(data => setContract(data));
    }, [id]);


    let color = "secondary";
    let dotColor = "secondary";

    if (status === "Atrasado") {
        color = "danger";
        dotColor = "danger";
    } else if (status === "A tiempo") {
        color = "success";
        dotColor = "success";
    } else if (status === "Pendiente") {
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
                            Detalles del Contrato-000N
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
                    <div className="card shadow-sm border-0 rounded-4">
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
                                        {payments.map((p, index) => (
                                            <tr key={index}>
                                                <td>{p.date}</td>
                                                <td>{p.concept}</td>
                                                <td className="text-warning fw-semibold">
                                                    {p.pending}
                                                </td>
                                                <td className="text-success fw-semibold">
                                                    {p.paid}
                                                </td>
                                                <td>
                                                    <StatusBadge status={p.status} />
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-sm btn-outline-secondary">
                                                            <i className="bi bi-receipt"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-secondary">
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-secondary">
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
                                <small className="text-muted">Mostrando 4 pagos</small>
                                <small className="text-muted">
                                    Página 1 de 5
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
                                <div className="text-success fw-bold">$5,000</div>
                            </div>

                            <div className="mb-3">
                                <small className="text-muted">Arrendatario</small>
                                <div>José Eduardo Amaya</div>
                            </div>

                            <div>
                                <small className="text-muted">Duración del contrato</small>
                                <div>
                                    19 de diciembre, 2025 al
                                    <br />
                                    19 de diciembre, 2026
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}