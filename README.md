# Bamazon
A marketplace storefront modeled after Amazon. Through the command line, customers and managers can interface with the application to purchase items or update the marketplace's inventory dynamically.

* Powered by Javascript, node.js, and SQL.

*Further functionality underway.*

## Getting Started and Prerequisites

Clone the repo and download [*node.js*](https://nodejs.org/en/) to get started!

### Preview 
<!-- take a picture of the image and add it into the readme  -->

![Bamazon Marketplace](assets/preview.gif  "Bamazon")
*An example of the manager interface in action*

## Technology Used

* **Javascript** - the primary scripting logic powering the game
* [**node.js**](https://nodejs.org/en/) - a versatile Javascript runtime environment that processes user inputs in terminal
* [**mySQL**](https://www.mysql.com/) - a comprehensive open-source relational database system

## Node Packages Employed

1. MySQL - ``` require("mysql"); ```
2. CLI-Table - ``` require("cli-table"); ```
3. Inquirer - ``` require("inquirer"); ```
4. Chalk - ``` require("chalk"); ```
5. CFonts - ``` require("cfonts"); ```

# Code Snippets
<!-- put snippets of code inside ``` ``` so it will look like code -->
<!-- if you want to put blockquotes use a > -->

Node.js allows a diversity of interactions in the backend. Here, I initialize and outline the interface that allows the user to directly alter a connected database of product items. Two node packages, *inquirer* and *mysql*, operate in unison to allow the user to input the desired ID and query an existing database for that ID's existence. Then, the user's input is related to the existing "stock_quantity" attribute of that ID's product object, and it is updated dynamically.

```
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

```

# Learning Points
<!-- Learning points where you would write what you thought was helpful -->
* MySQL provides a comprehensive set of accessible options that allows the user to create a database of new information and also connect to that database via node.js
    - querying this connection and pulling crucial data was a major part of this application, and the search query syntax is something that needs to be further investigated
* npm cli-table was a new node package that was very useful in segmenting data in a readable and accessible format

## Developers

* **Sajeel Malik** - *Initial work* - [GitHub](https://github.com/sajeelmalik)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


