require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("./database");

const migrationPath = path.join(__dirname, "init.sql");
const sql = fs.readFileSync(migrationPath, "utf8");

pool.query(sql)
  .then(() => {
    console.log("Migration completed successfully");
    pool.end();
  })
  .catch((err) => {
    console.error("Migration failed:", err.message);
    pool.end();
    process.exit(1);
  });
