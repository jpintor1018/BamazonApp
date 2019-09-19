var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "bootcamp19",
  database: "bamazon_db"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("connection as id: " + connection.threadId);
    start();
})
//Function to start Prompt
function start(){
    inquirer
    .prompt([
        {
            name: "mgrChoice",
            type: " list",
            message: "What would you like to do?",
            choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product"]
        }
    ]).then(function(choices){
        if(choices.mgrChoice === "View Products For Sale"){
            productList();
        }
        else if (choices.mgrChoice === "View Low Inventory"){
            lowInvent();
        }
        else if (choices.mgrChoice === "Add To Inventory"){
            addInvent();
        }
        else{
            newProduct();
        }
    });
}
//Function to Show Current Product List
function productList(){
    connection.query("SELECT * FROM PRODUCTS",
        function(err,res){
        if(err) throw err;

        for(var i = 0;i<res.length;i++){

            console.log("ID: ".green + res[i].item_id + " | ".blue + "Product: ".red + res[i].product_name + " | ".blue + "Department: ".yellow + res[i].department_name + " | ".blue + "Price: ".cyan + res[i].price + " | ".blue + "Stock: ".magenta +  res[i].stock_quantity)
            console.log("---------------------------------------------------------------------------")
        }
        start();
    }
    )}
//Function to Show inventory with stock_quantity < 5
function lowInvent(){
    connection.query("SELECT* FROM PRODUCTS",
    function(err,res){
        if(err) throw err;
        for(var j = 0;j<res.length;j++){
            if(res[j].stock_quantity<=5)
            {
                console.log("ID: ".green + res[j].item_id + " | ".blue + "Product: ".red + res[j].product_name + " | ".blue + "Department: ".yellow + res[j].department_name + " | ".blue + "Price: ".cyan + res[j].price + " | ".blue + "Stock: ".magenta +  res[j].stock_quantity)
                console.log("---------------------------------------------------------------------------")
    
            }
        }
        start();
    })
}
//Function to add into stock_quantity
function addInvent(){
    inquirer
    .prompt([
        {
            name: "productID",
            type: "input",
            message: "Enter ID of the product you would like to add inventory to"
        },
        {
            name: "stockInput",
            type: "input",
            message: "How Many Would You Like To Add?"
        }
    ]).then(function(addStock){
        connection.query("UPDATE PRODUCTS SET ? WHERE ?",[
            {
                stock_quantity: (addStock.stockInput)
            },
            {
                item_id: addStock.productID
            }], function(err,res){
                if(err) throw err;
            }
            )
            
            
        start();
    })
}
//Function to add a new product
function newProduct(){
    inquirer
    .prompt([
        {
            name: "productName",
            type: "input",
            message: "Enter product you would like to add"
        },
        {
            name: "departmentName",
            type: "input",
            message: "Enter which department your product belongs to"
        },
        {
            name: "stock",
            type: "input",
            message: "Enter the amount of stock of the new product"
        },
        {
            name: "newPrice",
            type: "input",
            message: "What is the price of the new product?"
        }
    ]).then(function(addProd){
            connection.query("INSERT INTO PRODUCTS(product_name, department_name, stock_quantity, price) VALUES (?,?,?,?)",[
                 addProd.productName,
                 addProd.departmentName,
                 addProd.stock,
                 addProd.newPrice
            ], function(err,res){
                if(err) throw err;
            }
            )
            start();
        })
    }
