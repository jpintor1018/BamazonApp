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
})

productList();

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

function start(){
    inquirer
    .prompt([
    {
        name:"input",
        type:"input",
        message:"Enter ID of the product you would like to buy"        
    },
    {
        name:"stock",
        type:"input",
        message:"How much would you like to purchase?"
    }
])
        .then(function(answer){
            connection.query("SELECT * FROM PRODUCTS WHERE ?",
            {
                item_id: answer.input
            },
            function (err,res){
                if(err) throw err
                var productID = answer.input;
                var inStock = parseInt(answer.stock);
                var Total = parseFloat(inStock*(res[0].price)).toFixed(2);
    // console.log(inStock < res[0].stock_quantity);
    // console.log(inStock)
    // console.log(res[0].price)
    // console.log(res[0].stock_quantity)
    // console.log(answer.stock)
    
                if(inStock <= res[0].stock_quantity){
                    connection.query("UPDATE Products SET ? WHERE ?", [
                    {stock_quantity: (res[0].stock_quantity - inStock)},
                    {item_id: answer.input}
                    ], function(err, res){
                        if(err) throw err;
                        console.log(" Your Total is $ " + Total);
                    });
                }
                else{
                    console.log("Not enough in stock. Please come back later");
                }
                connection.end()
        }
        )
    })
}

