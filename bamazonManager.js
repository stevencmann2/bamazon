TODO:
    //List a set of menu options:

    // View Low Inventory ------------- DEBUG WHERE ?????????
    // Add New Product
    // Quit

    var mysql = require("mysql");
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
    // run manager function as prompt
    manager();
});


function manager() {
    inquirer
        .prompt([{
                type: 'list',
                name: 'action',
                message: 'Welcome to Bamazon Manager, what would you like to do?',
                choices: [
                    'View Products For Sale',
                    'View Low Inventory',
                    'Add to Inventory',
                    'Add New Product',
                    'Leave Manager Mode'
                ]
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Are you sure that is what you would like to do Mr. Manager?'
            }
        ])
        .then(answers => {
            if (answers.confirm === true) {
                switch (answers.action) {
                    case ('View Products For Sale'):
                        viewProducts();

                        break;
                    case ('View Low Inventory'):
                        lowInventory();

                        break;
                    case ('Add to Inventory'):
                        addInventory()

                        break;
                    case ('Add New Product'):
                        // addProduct()
                        // manager();
                        break;
                    case ('Leave Manager Mode'):
                        quit();
                        break;
                    default:

                }
            } else {
                manager();
            }
        });
};


/// VIEW PRODUCTS FOR SALE 

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        const data = res.map((products) => [products.item_id, products.product_name, products.department_name, products.price, products.stock_quantity]);
        // console.log(data);
        const productsTable = [
            ['Item ID', 'Product Name', 'Department', 'Price', 'Left in Stock'],
            ...data
        ];
        ///////////////// MANAGER STOCK DISPLAY/////////////////////////
        console.log('\n\n');
        console.log("-".repeat(122) + '\n');
        console.log('Bamazon Manager Portal' + '\n');
        console.log("-".repeat(122) + '\n');
        console.log('Here is what is in stock currently: ' + '\n');
        console.log("-".repeat(122) + '\n');
        console.log(table(productsTable));
        manager();
    })

};

// LEAVE FUNCTION
function quit() {
    console.log('\n\n' + "-".repeat(122) + '\n\n' + 'Signing out of Manager Mode......' + '\n\n' + "-".repeat(122) + '\n\n')
    connection.end();
}

// ["stock_quantity < 6"]
//// LOW INVENTORY 
function lowInventory() {
    //     search = "stock_quantity < 6"
    connection.query("SELECT * FROM products WHERE stock_quantity < 6", function (err, res) {
        if (err) throw err;
        const data = res.map((products) => [products.item_id, products.product_name, products.department_name, products.price, products.stock_quantity]);
        const productsTable = [
            ['Item ID', 'Product Name', 'Department', 'Price', 'Left in Stock'],
            ...data
        ];
        console.log('\n\n'+"-".repeat(122) + '\n\nATTENTION: Low Inventory Detected For The Following Items\n\n'+ "-".repeat(122) +'\n\n'+ table(productsTable) + '\n\n');
        manager();
    })

};

// ///////ADD INVENTORY
function addInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        const data = results.map((products) => [products.item_id, products.product_name, products.department_name, products.price, products.stock_quantity]);
        const productsTable = [
          ['Item ID', 'Product Name', 'Department', 'Price', 'Left in Stock'],
          ...data
        ];
        console.log('\n\n'+"-".repeat(122) + '\n\nWelcome to Add Inventory Mode\n\n'+ "-".repeat(122));
        console.log('\n\n' + table(productsTable) + '\n\n');
        inquirer
            .prompt([{
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        const choiceArray = [];
                        for (let i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "Which item would you like to add more of?"
                },
                {
                    name: "amount",
                    type: "input",
                    message: "How much would you like to add to the stocked quantity ?",
                    validate: function (value) {
                        if (isNaN(value) === false && value > 0) {
                            return true;
                        } else {
                            console.log('\n\nOops, you did not enter a valid number, please enter a valid [number]\n')
                            return false;
                        }
                    }

                }
            ])
            .then(function (answer) {
                // get the information of the chosen item
                let chosenItem;

                for (let i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenItem = results[i];
                    }

                }
                if (chosenItem.product_name === answer.choice) {
                    let newstock;
                    connection.query(
                        `UPDATE products SET ? WHERE ?`,
                        [{
                                stock_quantity: newstock = (parseInt(answer.amount) + parseInt(chosenItem.stock_quantity))
                            },
                            {
                                product_name: answer.choice
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("-".repeat(122) + '\n');
                            console.log("\n\nStock Updated Succesfully, " + chosenItem.product_name + ' now has ' + '(' + newstock + ')' + ' in stock\n\n');
                            console.log("-".repeat(122) + '\n');
                            manager();
                        }
                    );
                } else {
                    console.log("-".repeat(122) + '\n\n');
                    console.log("something didnt go right, please try again\n\n");
                    console.log("-".repeat(122) + '\n');
                    manager();
                }
            });
    });
}

//add PRODUCT