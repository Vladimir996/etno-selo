require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  });

  const dbName = process.env.DB_NAME || "etno_selo_raonica";

  console.log("Kreiranje šeme...");
  const schemaSql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await connection.query(schemaSql);

  await connection.changeUser({ database: dbName });

  const [rows] = await connection.query("SELECT COUNT(*) AS count FROM cabins");
  if (rows[0].count > 0) {
    console.log("Tabela `cabins` već ima podatke — preskačem seed.");
  } else {
    console.log("Ubacivanje početnih podataka (seed)...");
    const seedSql = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8");
    await connection.query(seedSql);
    console.log("Seed završen.");
  }

  await connection.end();
  console.log("Migracija završena.");
}

run().catch((err) => {
  console.error("Migracija neuspešna:", err.message);
  process.exit(1);
});
