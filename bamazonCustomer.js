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

// Declares global variables to hold purchases, total cost, and product sales
var purchases = [];
var amounts = [];
var total = 0;
var sales = 0;

// Declares global variable to hold query string for updating database
var update;

// FUNCTIONS

// Function to Buy a Product
function buyThis() {
	inquirer.prompt([
	{
		message: "What is the Item ID of the product you would like to buy? (Please enter a number)",
		name: "id"
	}, 
	{
		message: "How many units would you like to buy? (Please enter a number)",
		name: "purchase"
	}
	]).then(function(answer) {
		var id = parseInt(answer.id);
		var quantity = parseInt(answer.purchase);

		// purchase logic
		if (isNaN(answer.id) == true || id <= 0 || id > resultArray.length) {
			console.log("ERROR: That item does not exist! Please select a valid item.");
		} else if (isNaN(answer.purchase) == true || quantity <= 0) {
			console.log("ERROR: You must order more than one unit to complete a purchase.");
		} else if (quantity > resultArray[id - 1].stock_quantity) {
			console.log("ERROR: Insufficient quantity of stock! We do not have " + quantity + " units of Item " + id + ". There are only " + resultArray[id - 1].stock_quantity + " units available for purchase. Please order fewer units or select a different item.");
		} else {
			// Adds product name and quantity to purchases
			purchases.push(resultArray[id - 1].product_name);
			amounts.push(quantity);

			// Calculates cost of current order and total order
			var orderCost = quantity * resultArray[id - 1].price;
			orderCost = parseFloat(orderCost.toFixed(2));
			total += orderCost;
			total = parseFloat(total.toFixed(2));

			sales = resultArray[id - 1].product_sales + orderCost;

			// Displays product selection, quantity, price, and cost of current order 
			console.log("You have selected Item " + id + ", " + resultArray[id - 1].product_name + ".");
			console.log("This item costs $" + resultArray[id - 1].price + " per unit. You have ordered " + quantity + " units.");
			console.log("This purchase costs $" + orderCost + ".");

			// Displays all products and quantities ordered as well as the total cost
			console.log("YOU HAVE ORDERED");
			for (var i = 0; i < purchases.length; i++) {
				console.log(amounts[i] + " | " + purchases[i]);
			}
			console.log("Your total cost is $" + total + ".");

			// Query to update the database
			update = "UPDATE products SET stock_quantity = " + (resultArray[id - 1].stock_quantity - quantity) + ", product_sales = " + sales + " WHERE item_id = " + id;

			// Updates the database
			connection.query(update, function (error) {
				if (error) {
					console.log(error);
				};
			});
		}

		// Asks if the user would like to purchase more items
		keepGoing();
	});
}

// Function to continue purchasing
function keepGoing() {
	inquirer.prompt([
	{
		message: "Would you like to purchase any more products?",
		type: "confirm",
		default: true,
		name: "keepgoing"
	}
	]).then(function(answer) {
		if(answer.keepgoing == true) {
			console.log("\n");
			loadQuery();
		} else {
			console.log("Thank you for your purchase! Please come again...");
			console.log("\n--------------------------------- \n");
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
		
		console.log("BAMAZON CURRENTLY OFFERS THE FOLLOWING ITEMS:")
		console.log("Item ID | Product Name | Department | Price | Stock Quantity");

		for (var i = 0; i < results.length; i++) {
			console.log(results[i].item_id + " | " + results[i].product_name + " | " + results[i].department_name + " | $" + results[i].price + " | " + results[i].stock_quantity);
		}

		console.log("\n--------------------------------- \n");

		buyThis();
	});
}