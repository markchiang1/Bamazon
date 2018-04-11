var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'bamazon',
  port : '3308'
});
 
connection.connect(); 

connection.query('SELECT * FROM items;', function (error, results, fields) {
  if (error) throw error;
  printInventory(results)

});

connection.end();

function printInventory (results) {

    for (i=0; i<results.length; i++){
        var id = results[i].id
        var product = results[i].product_name
        var department = results[i].depart_name
        var price = results[i].price
        var stock = results[i].stock
        console.log(' Item id# '+id+ ' | ' + department + ' | '+ product  + ' -- $' +price + ' -- Stock('+stock +')')
    }
}