//Sajeel Malik
//Bamazon Manager Portal

//Dependencies
var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");
const chalk = require('chalk');
const chalkAnimation = require('chalk-animation');
const CFonts = require('cfonts');

//connect to database
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
    console.log(chalk.bgRedBright("connected as id " + connection.threadId + "\n"));
    CFonts.say('BAMAZON', {
        font: 'chrome',              // define the font face
        align: 'center',              // define text alignment
        colors: ['red','redBright','white'],         // define all colors
        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
        letterSpacing: 1.5,           // define letter spacing
        lineHeight: 2,              // define the line height
        space: true,                // define if the output text should have empty lines on top and on the bottom
        maxLength: '0',             // define how many character can be on one line
    });
    
    managerPrompt();
});

function managerPrompt() {
    console.log("----------------------------------------------")
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: chalk.bgBlackBright("What would you like to do?"),
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "QUIT"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    displayProducts();
                    setTimeout(managerPrompt, 1000); //add timeout to force synchronicity
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Inventory":
                    displayProducts();
                    setTimeout(addInventory, 1000); //add timeout to force synchronicity
                    break;

                case "Add New Product":
                    addProduct();
                    break;

                case "QUIT":
                    connection.end();
                    break;
            }
        });
}

function displayProducts() {
    var table = new Table({
        head: ['Item ID', 'Product Name', "Category", "Price", "Stock Quantity"]
        , colWidths: [10, 25, 15, 12, 20]
    });

    console.log(chalk.bold("\nDisplaying current storefront...\n"));

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

    console.log(chalk.bold("\nDisplaying low inventory items...\n"));

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
            console.log(chalk.green("There are no low inventory items! We have a healthy stock of goods.\n"));
        }
        managerPrompt();
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
            console.log(chalk.blue("\nUpdating " + product + " stock quantity...\n"));
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
                    console.log(chalk.green(res.affectedRows + " products had their stock replenished!\n"));
                    managerPrompt();
                }
            );
        });
    });
}

function addProduct() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the product you would like to add?",
        },
        {
            name: "category",
            type: "list",
            message: "What department does it fall under?",
            choices: [
                "Books",
                "Electronics",
                "Home",
                "Kitchen",
                "Sports"
            ]
        },
        {
            name: "cost",
            type: "input",
            message: "How much does it cost?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }

                return false;
            }
        },
        {
            name: "stock",
            type: "input",
            message: "How many units are we receiving?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }

                return false;
            }
        }
    ]).then(function (answer) {

        console.log(chalk.blue("\nInserting " + answer.name + " into database...\n"));
        // insert new item based on input data
        var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?";
        var values = [[answer.name, answer.category, parseFloat(answer.cost), parseFloat(answer.stock)]];

        connection.query(query, [values], function (err, res) {

            if (err) throw err;
            console.log("=================================");
            console.log("Product: " + answer.name);
            console.log("Category: " + answer.category);
            console.log("Price: " + parseFloat(answer.cost));
            console.log("Stock: " + parseFloat(answer.stock));
            console.log("=================================");


            console.log(chalk.green(res.affectedRows + " new product(s) successfully added!\n"));

            managerPrompt();

        });
    });
}