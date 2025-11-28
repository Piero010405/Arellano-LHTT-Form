// lib/db/sqlserver.ts
import sql, { ConnectionPool, config as SQLConfig } from "mssql";

let connectionPool: ConnectionPool | null = null;

const sqlConfig: SQLConfig = {
  user: process.env.SQL_SERVER_USER!,
  password: process.env.SQL_SERVER_PASSWORD!,
  database: process.env.SQL_SERVER_DB!,
  server: process.env.SQL_SERVER_HOST!,
  port: process.env.SQL_SERVER_PORT ? Number(process.env.SQL_SERVER_PORT) : 1433,
  options: {
    encrypt: true, // recomendado
    trustServerCertificate: process.env.SQL_SERVER_TRUST_CERT === "true",
  },
};

export async function getSqlServerPool(): Promise<ConnectionPool> {
  if (connectionPool) {
    return connectionPool;
  }

  // Evitar múltiples pools en modo dev (hot reload)
  if (!(global as any)._sqlConnectionPool) {
    (global as any)._sqlConnectionPool = await sql.connect(sqlConfig);
  }

  connectionPool = (global as any)._sqlConnectionPool;
  return connectionPool;
}

// Reexportamos sql para usar tipos y constantes (sql.Int, sql.NVarChar, etc.)
export { sql };
