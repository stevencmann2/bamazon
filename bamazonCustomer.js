////require inquirer
// console.log("Hello");
const mysql = require("mysql");
const inquirer = require('inquirer');
//////FOR TABLE
const {
  table
} = require("table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  ///////// .ENV EVENTUALLY
  password: "phish",
  database: "bamazon_db"
});
// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the PRODUCT DISPLAY function after the connection is made to prompt the user
  productDisplay();

});


////// PRODUCT DISPLAY FROM TABLE 
function productDisplay() {
  connection.query("SELECT * FROM products", function (err, res) {
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
    console.log('Welcome to the Bamazon Store!' + '\n');
    console.log("-".repeat(122) + '\n');
    console.log('Here is what is in stock currently: ' + '\n');
    console.log("-".repeat(122) + '\n');
    console.log(table(productsTable));
    //////////// ASK USER IF READY TO SHOP IF NOT QUIT////////////////
    inquirer
      .prompt({
        type: 'confirm',
        name: 'confirm',
        message: 'Ready to shop the Bamazon products?'

      }).then(function (answer) {
        if (answer.confirm === true) {
          // console.log(' THIS WAS A CONFIRMATION')
          userAction();
        } else {
          console.log('\n' + "-".repeat(122) + '\n\nThats ok, we hope to see you again!' + '\n\n' + "-".repeat(122) + '\n');
          connection.end();
        }
      });

  })
};



////////// INQUIRER PROMPT 
function userAction() {
  inquirer
    .prompt({
      name: "action",
      type: "input",
      message: "Would you like to buy from Bamazon? Please enter the [Item ID] of the product",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        console.log('\n\nOops, you did not enter a valid ID, please enter a valid [Item ID]\n')
        return false;
      }

    })
    .then(function (answer) {
      // // based on their answer, either call the bid or the post functions
      // if (answer.postOrBid === "POST") {
      //   postAuction();
      // }
      // else if(answer.postOrBid === "BID") {
      //   bidAuction();
      // } else{
      //   connection.end();
      // }
    });


}