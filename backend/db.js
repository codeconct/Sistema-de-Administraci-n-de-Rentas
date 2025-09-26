import pg from 'pg'

export const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    password: "213097",
    database: "RentasDatabase",
    port: "5432"
})