import pkg from 'pg';
const { Pool } = pkg;

const {pool} = new pkg.Pool({
    user: "postgres",
    host: "localhost",
    password: "213097",
    database: "RentasDatabase",
    port: "5432"
})

export default pool;