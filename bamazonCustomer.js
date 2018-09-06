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
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();
  });   

function displayProducts() {
    var table = new Table({
        head: ['Item ID', 'Product Name', "Category", "Price", "Stock Quantity"]
      , colWidths: [10, 25, 15, 12, 20]
    });

    console.log("Displaying current storefront...\n");
    // connection.query("SELECT * FROM products", function(err, res) {
    //     if (err) throw err;
    //     // Log all results of the SELECT statement
    //     // console.log(res);
    //     connection.end();
    // });

    var query = "SELECT id, product_name, department_name, price, stock_quantity FROM products";

      connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
          table.push(
              [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        buyItem();
      });

      
}

//prompt the user to choose an item to buy
function buyItem(){
    inquirer.prompt([
        {
            name: "item_id",
            type: "input",
            message: "What is the ID of the product you would like to buy?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }

                return false;
            }
        },
        {
            name: "desiredQuantity",
            type: "input",
            message: "How many would you like to buy?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }

                return false;
            }
        }
    ]).then(function(answer){
        console.log(answer.item_id);
        connection.query("SELECT * FROM products WHERE id = ?", [answer.item_id], function(err,res){

            var stock = res[0].stock_quantity;
            if(err) throw err;
            

            //check if the specific searched item is still in stock
            if(stock > 0){
                if(answer.desiredQuantity <= stock){
                    var total = res[0].price * answer.desiredQuantity;
                    // console.log(total);
                    console.log("The total cost of your purchase is $" + total + ". Have a great day!")  
                }
                else{
                    console.log("\nThat's more than we have available. Try again:")
                    buyItem();
                }
                
            }
            else{
                console.log("Insufficient quantity!");
            }
          });
      
    });
}