//Sajeel Malik
//Bamazon Manager Portal

var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "password",
    database: "bamazonDB"
});

//establish a connection with the database so that we can perform commands
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    managerPrompt();
});

function managerPrompt() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    displayProducts();
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Inventory":
                    displayProducts();
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;
            }
        });
}

function displayProducts() {
    var table = new Table({
        head: ['Item ID', 'Product Name', "Category", "Price", "Stock Quantity"]
        , colWidths: [10, 25, 15, 12, 20]
    });

    console.log("Displaying current storefront...\n");

    var query = "SELECT id, product_name, department_name, price, stock_quantity FROM products";

    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString() + "\n");
    });
}

function lowInventory() {
    var table = new Table({
        head: ['Item ID', 'Product Name', "Category", "Price", "Stock Quantity"]
        , colWidths: [10, 25, 15, 12, 20]
    });

    console.log("Displaying low inventory items...\n");

    var query = "SELECT id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity < 5";

    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString() + "\n");

        //compare empty array to false because [] is truthy
        if (res == false) {
            console.log("There are no low inventory items! We have a healthy stock of goods.");
        }
    });
}

function addInventory() {
    inquirer.prompt([
        {
            name: "item_id",
            type: "input",
            message: "What is the ID of the product you would like to restock?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "addedQuantity",
            type: "input",
            message: "How many units would you like to add?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }

                return false;
            }
        }
    ]).then(function (answer) {
        // console.log(answer.item_id);
        connection.query("SELECT * FROM products WHERE id = ?", [answer.item_id], function (err, res) {

            var stock = res[0].stock_quantity;
            var product = res[0].product_name;
            var numAdded = parseInt(answer.addedQuantity);
            if (err) throw err;


            //additional query to update stock accordingly
            console.log("Updating " + product + " stock quantity...\n");
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: stock + numAdded
                    },
                    {
                        id: answer.item_id
                    }
                ],
                function (err, res) {
                    console.log(res.affectedRows + " products had their stock replenished!\n");
                }
            );
        });
    });
}