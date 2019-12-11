////require inquirer
// console.log("Hello");
const mysql = require("mysql");
const inquirer = require('inquirer');
//////FOR TABLE
const {table} = require("table");

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
  // run the PRODUCT DISPLAY function after the connection is made to prompt the user
  productDisplay();
});


////// PRODUCT DISPLAY FROM TABLE 
function productDisplay(){
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    const data = res.map((products) => [products.item_id, products.product_name, products.department_name, products.price, products.stock_quantity]);
    // console.log(data);
    const productsTable = [
      ['Item ID', 'Product Name', 'Department', 'Price', 'Left in Stock'], 
      ...data
    ];
    ///////////////// UI DISPLAY/////////////////////////
    console.log('\n\n');
    console.log("-".repeat(122) + '\n');
    console.log('Welcome to the Bamazon Store!' + '\n')
    console.log("-".repeat(122) + '\n');
    console.log('Here is what is in stock currently: ' + '\n')
    console.log("-".repeat(122) + '\n');
    console.log(table(productsTable));
  });
}

////////// INQUIRER PROMPT 