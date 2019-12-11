////require inquirer
// console.log("Hello");
const mysql = require("mysql");
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  ///////// .ENV EVENTUALLY
  password: "phish",
  database: "bamazon_db"
});
// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  console.log(connection);
  console.log("connected as id " + connection.threadId);
  connection.end();
  // run the start function after the connection is made to prompt the user
});



