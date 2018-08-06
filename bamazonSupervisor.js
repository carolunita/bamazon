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

// Declares global variables to hold query results
var productArray;
var departmentArray;

// Declares global variables to hold product sales and profit
var productSales = [];
var profits = [];

// Declares global variable to help deal with product sales and profit calculations
var departmentNames = ["Department Names"];

// Declares global variable to hold query string for updating database
var update;

// FUNCTIONS

// Function to add a new department to the database
function addDepartment() {
	inquirer.prompt([
	{
		message: "What is the name of your new department?",
		name: "department_name"
	},
	{
		message: "What is the overhead cost of this department? (enter a number)",
		name: "overhead_costs"
	}
	]).then(function(answer) {
		var cost = parseFloat(answer.overhead_costs)
		cost = cost.toFixed(2);

		// Checks if user input is valid
		if (isNaN(answer.overhead_costs) == true || cost <= 0) {
			console.log("ERROR: Please enter a overhead cost.");
		} else {
			// Query to update the database
			update = "INSERT INTO departments (department_name, overhead_costs) VALUES ('" + answer.department_name + "', " + cost +")";

			// Updates the database
			connection.query(update, function (error) {
				if (error) {
					console.log(error);
				};
			});

			// Notifies the user that the new product has been added and displays new product information
			console.log("NEW DEPARTMENT ADDED!");
			console.log("Department | Overhead Cost");
			console.log(answer.department_name + " | $" + cost);
		}

		console.log("\n");
		keepGoing();
	});
}

// Function to calculate display product sales and profit of each department
function calculateSales() {
	// Initialize productSales array
	for (var i = 0; i < departmentNames.length - 1; i++) {
		productSales[i] = 0;
	}

	// Calculate product sales by department
	for (var i = 0; i < productArray.length; i++) {
		for (var j = 0; j < departmentNames.length; j++) {
			// Determine which department the product belongs to and add its sales to the department's total product sales
			if (departmentNames[j] == productArray[i].department_name) {
				productSales[j - 1] += productArray[i].product_sales;
			}
		}
	}

	// Shows product sales and profits of each department
	console.log("BAMAZON PRODUCT SALES BY DEPARTMENT")
	console.log("Department ID | Department | Overhead Costs | Product Sales | Total Profit");

	for (var i = 0; i < departmentArray.length; i++) {
		profits[i] = productSales[i] - departmentArray[i].overhead_costs;

		if (profits[i] < 0) {
			console.log(departmentArray[i].department_id + " | " + departmentArray[i].department_name + " | $" + departmentArray[i].overhead_costs + " | $" + productSales[i].toFixed(2) + " | " + Math.abs(profits[i]).toFixed(2));
		} else {
			console.log(departmentArray[i].department_id + " | " + departmentArray[i].department_name + " | $" + departmentArray[i].overhead_costs + " | $" + productSales[i].toFixed(2) + " | " + profits[i].toFixed(2));
		}
	}
	console.log("\n------------------------------------ \n");
	keepGoing();
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
	// Acquires all department information 
	connection.query("SELECT * FROM departments", function (error, results) {
		if (error) {
			console.log(error);
		};

		// Updates departmentArray with query results
		departmentArray = results;

		// Flag for determining uniqueness
		var flag = false;

		for (var i = 0; i < departmentArray.length; i++) {
			for (var j = 0; j < departmentNames.length; j++) {
				if (departmentNames[j] == departmentArray[i].department_name) {
					flag = true;
					break;
				}
			}

			// Add unique department names to departmentNames array
			if (flag == false) {
			departmentNames.push(departmentArray[i].department_name);
			} else {
				flag = false;
			}
		}

		// Acquires all product information 
		connection.query("SELECT * FROM products", function (error, results) {
			if (error) {
				console.log(error);
			};

			productArray = results;

			inquirer.prompt([
			{
				message: "What would you like to do?",
				type: "list",
				choices: ["View Product Sales by Department.", "Create New Department."],
				name: "dothis"
			}
			]).then(function(answer) {
				if (answer.dothis == "View Product Sales by Department.") {
					calculateSales();
				} else if (answer.dothis == "Create New Department.") {
					addDepartment();
				} else {
					console.log("ERROR!");
				}
			});
		});
	});	
}