var mysql = require("mysql");
var Table = require("cli-table");

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
      });

      
}
