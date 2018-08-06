// Initializes "inquirer" and "mysql" packages
var inquirer = require("inquirer");
var mysql = require("mysql");

// Creates mysql server connection
var connection = mysql.createConnection({
	host: "localhost",
	port: 8889,
	user: "root",
	password: "root",
	database: "bamazon"
});

// Connects to mysql server
connection.connect();
 
loadQuery();

// Declares global variable to hold query results
var resultArray;

// Declares global variable to hold query string for updating database
var update;

// FUNCTIONS

// Function to add items to inventory
function addInventory() {
	console.log("BAMAZON CURRENTLY OFFERS THE FOLLOWING ITEMS:")
	console.log("Item ID | Product Name | Department | Price | Stock Quantity");

	for (var i = 0; i < resultArray.length; i++) {
		console.log(resultArray[i].item_id + " | " + resultArray[i].product_name + " | " + resultArray[i].department_name + " | $" + resultArray[i].price + " | " + resultArray[i].stock_quantity);
	}

	console.log("\n--------------------------------- \n");

	// Adds to inventory
	inquirer.prompt([
	{
		message: "For which item would you like to add inventory? (Please enter an existing item id)",
		name: "id"
	},
	{
		message: "How many more units are you adding? (Please enter a number)",
		name: "quantity"
	}
	]).then(function(answer) {
		var id = parseInt(answer.id);
		var quantity = parseInt(answer.quantity);

		// checks if user input is valid
		if (isNaN(answer.id) == true || id <= 0 || id > resultArray.length) {
			console.log("ERROR: That item does not exist! Please select a valid item.");
		} else if (isNaN(answer.quantity) == true || quantity <= 0) {
			console.log("ERROR: You must add more than one unit.");
		} else {
			// Query to update the database
			update = "UPDATE products SET stock_quantity = " + (resultArray[id - 1].stock_quantity + quantity) + " WHERE item_id = " + id;

			// Updates the database
			connection.query(update, function (error) {
				if (error) {
					console.log(error);
				};
			});

			// Notifies the user that the inventory has been added and displays updated product information
			console.log("INVENTORY ADDED!");
			console.log("Quantity Added | Item ID | Product Name | Department | Price | Stock Quantity");
			console.log(quantity + " | " + resultArray[id - 1].item_id + " | " + resultArray[id - 1].product_name + " | " + resultArray[id - 1].department_name + " | $" + resultArray[id - 1].price + " | " + (resultArray[id - 1].stock_quantity + quantity));
		}

		console.log("\n");
		keepGoing();
	});
}

// Function to add a new product to inventory
function addProduct() {
	inquirer.prompt([
	{
		message: "What is the name of your new product?",
		name: "product_name"
	},
	{
		message: "What department is this product from?",
		name: "department_name"
	},
	{
		message: "How much does this product cost per unit? (Please enter a number)",
		name: "price"
	},
	{
		message: "How many units of this product do you have? (Please enter a number)",
		name: "stock_quantity"
	}
	]).then(function(answer) {
		var price = parseFloat(answer.price)
		price = price.toFixed(2);
		var stock_quantity = parseInt(answer.stock_quantity);

		// Checks if user input is valid
		if (isNaN(answer.price) == true || price <= 0) {
			console.log("ERROR: Please enter a valid price.");
		} else if (isNaN(answer.stock_quantity) || stock_quantity <= 0) {
			console.log("ERROR: Please enter a valid stock quantity.");
		} else {
			// Query to update the database
			update = "INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) VALUES ('" + answer.product_name + "', '" + answer.department_name + "', " + price + ", " + stock_quantity + ", 0)";

			// Updates the database
			connection.query(update, function (error) {
				if (error) {
					console.log(error);
				};
			});

			// Notifies the user that the new product has been added and displays new product information
			console.log("NEW PRODUCT ADDED!");
			console.log("Product Name | Department | Price | Stock Quantity");
			console.log(answer.product_name + " | " + answer.department_name + " | $" + price + " | " + stock_quantity);
		}

		console.log("\n");
		keepGoing();
	});
}

// Function to continue
function keepGoing() {
	inquirer.prompt([
	{
		message: "Would you like to return to the main menu?",
		type: "confirm",
		default: true,
		name: "keepgoing"
	}
	]).then(function(answer) {
		if(answer.keepgoing == true) {
			console.log("\n");
			loadQuery();
		} else {
			console.log("Goodbye!");
			connection.end();
		}
	});
}

// Function to load query
function loadQuery() {
	// Displays all product information 
	connection.query("SELECT * FROM products", function (error, results) {
		if (error) {
			console.log(error);
		};

		// Updates resultArray with query results
		resultArray = results;

		// Asks what the user would like to do
		inquirer.prompt([
		{
			message: "What would you like to do?",
			type: "list",
			choices: ["View Products for Sale.", "View Low Inventory.", "Add to Inventory.", "Add New Product."],
			name: "dothis"
		}
		]).then(function(answer) {
			if (answer.dothis == "View Products for Sale.") {
				// Shows current inventory
				console.log("BAMAZON CURRENTLY OFFERS THE FOLLOWING ITEMS:")
				console.log("Item ID | Product Name | Department | Price | Stock Quantity");
		
				for (var i = 0; i < results.length; i++) {
					console.log(results[i].item_id + " | " + results[i].product_name + " | " + results[i].department_name + " | $" + results[i].price + " | " + results[i].stock_quantity);
				}
				console.log("\n--------------------------------- \n");
				keepGoing();
			} else if (answer.dothis == "View Low Inventory.") {
				//Shows items which have fewer than 10 units remaining
				console.log("BAMAZON IS RUNNING LOW ON THE FOLLOWING ITEMS:")
				console.log("Item ID | Product Name | Department | Price | Stock Quantity");

				for (var i = 0; i < results.length; i++) {
					if (results[i].stock_quantity <= 10) {
						console.log(results[i].item_id + " | " + results[i].product_name + " | " + results[i].department_name + " | $" + results[i].price + " | " + results[i].stock_quantity);
					}
				}
				console.log("\n------------------------------------ \n");
				keepGoing();
			} else if (answer.dothis == "Add to Inventory.") {
				// Allows user to add items to the inventory
				addInventory();
			} else if (answer.dothis == "Add New Product.") {
				// Allows user to add a new product to the database
				addProduct();
			} else {
				console.log("ERROR!");
			}
		});
	});
}