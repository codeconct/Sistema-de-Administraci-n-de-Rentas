-- ===============================
-- Users and Roles
-- ===============================
CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    passwordhash TEXT NOT NULL
);

-- ===============================
-- Owners
-- ===============================
CREATE TABLE owners (
    ownerid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    governmentid VARCHAR(30) NOT NULL,
    passwordhash TEXT NOT NULL
);

-- ===============================
-- Tenants
-- ===============================
CREATE TABLE tenants (
    tenantid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    governmentid VARCHAR(30) NOT NULL,
    passwordhash TEXT NOT NULL
);

-- ===============================
-- Guarantors (Aval)
-- ===============================
CREATE TABLE guarantors (
    guarantorid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    governmentid VARCHAR(30) NOT NULL
);

-- ===============================
-- Apartments
-- ===============================
CREATE TABLE apartments (
    apartmentid SERIAL PRIMARY KEY,
    ownerid INT NOT NULL,
    address TEXT NOT NULL,
    monthlyrent NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('AVAILABLE','OCCUPIED')) DEFAULT 'AVAILABLE',
    FOREIGN KEY (ownerid) REFERENCES owners(ownerid)
);

-- ===============================
-- Rental Contracts
-- ===============================
CREATE TABLE rentalcontracts (
    contractid SERIAL PRIMARY KEY,
    apartmentid INT NOT NULL,
    tenantid INT NOT NULL,
    guarantorid INT,
    startdate DATE NOT NULL,
    enddate DATE,
    depositamount NUMERIC(10,2),
    status VARCHAR(20) CHECK (status IN ('ACTIVE','EXPIRED','CANCELLED')) DEFAULT 'ACTIVE',
    FOREIGN KEY (apartmentid) REFERENCES apartments(apartmentid),
    FOREIGN KEY (tenantid) REFERENCES tenants(tenantid),
    FOREIGN KEY (guarantorid) REFERENCES guarantors(guarantorid)
);

-- ===============================
-- Invoices
-- ===============================
CREATE TABLE invoices (
    invoiceid SERIAL PRIMARY KEY,
    contractid INT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    duedate DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('PENDING','PAID','OVERDUE')) DEFAULT 'PENDING',
    FOREIGN KEY (contractid) REFERENCES rentalcontracts(contractid)
);

-- ===============================
-- Payments
-- ===============================
CREATE TABLE payments (
    paymentid SERIAL PRIMARY KEY,
    invoiceid INT NOT NULL,
    paymentdate DATE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    method VARCHAR(20) CHECK (method IN ('CASH','TRANSFER','CARD','AUTOMATIC')) NOT NULL,
    FOREIGN KEY (invoiceid) REFERENCES invoices(invoiceid)
);

-- ===============================
-- Documents
-- ===============================
CREATE TABLE documents (
    documentid SERIAL PRIMARY KEY,
    contractid INT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('CONTRACT','PROMISSORY_NOTE','RECEIPT')) NOT NULL,
    filepath TEXT NOT NULL,
    FOREIGN KEY (contractid) REFERENCES rentalcontracts(contractid)
);

-- ===============================
-- Maintenance Requests
-- ===============================
CREATE TABLE maintenancerequests (
    requestid SERIAL PRIMARY KEY,
    apartmentid INT NOT NULL,
    tenantid INT,
    requestdate DATE NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('PENDING','IN_PROGRESS','COMPLETED')) DEFAULT 'PENDING',
    completiondate DATE,
    FOREIGN KEY (apartmentid) REFERENCES apartments(apartmentid),
    FOREIGN KEY (tenantid) REFERENCES tenants(tenantid)
);

-- ===============================
-- Mora Settings
-- ===============================
CREATE TABLE morasettings (
    id INT PRIMARY KEY DEFAULT 1,
    tipo VARCHAR(20) CHECK (tipo IN ('PORCENTAJE','FIJO')) NOT NULL DEFAULT 'PORCENTAJE',
    valor NUMERIC(10,2) NOT NULL DEFAULT 10,
    updatedat TIMESTAMP NOT NULL DEFAULT NOW()
);
