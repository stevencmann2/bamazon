//TODO: LOOP THROUGH THE PRODUCT ITEM ID TO MAKE SURE IT IS ABLE TO BE PURCHASED






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
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    const data = res.map((products) => [products.item_id, products.product_name, products.department_name, products.price, products.stock_quantity]);
    const productsTable = [
      ['Item ID', 'Product Name', 'Department', 'Price', 'Left in Stock'],
      ...data
    ];
  inquirer
    .prompt([
      {
      name: "action",
      type: "input",
      message: "What would you like to buy from Bamazon? Please enter the [Item ID] of the product or [Q] to Quit",
      validate: function (value) {
        if (isNaN(value) === false && value>0 && value<res.length+1) {
          return true;
        }else if(value === 'Q') {
          connection.end();
        }else{
        console.log('\n\nOops, you did not enter a valid ID, please enter a valid [Item ID]\n')
        return false;
      }
    }
  },
  {
      name: "quantity",
      type: "input",
      message: "How many would you like to buy? or [Q] to Quit",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }else if(value === 'Q') {
          connection.end();
        }else{
        console.log('\n\nOops, you did not enter a valid amount, please enter a valid quantity\n')
        return false;
      }
    }
  }
  ]).then(function (answer) {
    let chosenProduct;
      for (let i = 0; i < res.length; i++) {
        if (res[i].item_id === parseInt(answer.action)) {
          chosenProduct = res[i];
        }
      }
    if(parseInt(chosenProduct.stock_quantity) < parseInt(answer.quantity)){
      console.log(`\n\nInsifficient stocked quantity of ${chosenProduct.product_name}`)
      productDisplay();
    }else {
      connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: (parseInt(chosenProduct.stock_quantity) - parseInt(answer.quantity))
          },
          {
            item_id: parseInt(answer.action)
          }
        ],
        function(error) {
          if (error) throw err;
    }
      
    );
};
});
  })
};

