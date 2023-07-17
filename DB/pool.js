const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "1.226.248.99",
  port: "3306",
  user: "ento",
  password: "gnHo0vjkgVXCiJr",
  database: "hnintegratedserver",
  connectionLimit: 500,
});

module.exports = pool;
