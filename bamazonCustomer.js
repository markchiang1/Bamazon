var mysql = require('mysql');
var inquirer = require('inquirer');
var pmpt = inquirer.createPromptModule()

var questions = [
  {
    type: 'input',
    name: 'idNum',
    message: "Type the ID # of the item you would like to purchase: "
  },
  {
    type: 'input',
    name: 'quantity',
    message: "How many quantities would you like to purchase?",
    default: function () {
      return 1;
    },
    validate: function (value) {
      var pass = value.match(
        /^[0-9]+$/
      );
      if (pass) {
        return true;
      }
      return 'Please enter a valid quantity!';
    }
  }
]

// var options = [
//   {
//     type: 'input',
//     name: 'leaveStore',
//     message: 'Would you like to continue shopping?',
//     default: function(){
//       return 'Y/N'
//     },
//     validate: function (value) {
//       var pass = value.match(

//       )
//     }
//   }
// ]

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bamazon',
  port: '3308'
});

connection.connect();

var inStore = true

while (inStore) {
  connection.query('SELECT * FROM items;', function (error, results, fields) {
    if (error) throw error;
    // printInventory(results)
    for (i = 0; i < results.length; i++) {
      var id = results[i].id
      var product = results[i].product_name
      var department = results[i].depart_name
      var price = results[i].price
      var stock = results[i].stock
      console.log('Welcome to BAMAZON! ')     
      console.log(' id# ' + id + ' | ' + department + ' | ' + product + ' -- $' + price + ' -- Stock(' + stock + ')')
    }

    pmpt(questions).then(function (r) {
      console.log(r) //{idNum:'7', quntity: '3'}
      console.log(r.idNum)

      connection.query(
        `SELECT stock FROM items
        WHERE id =`+ r.idNum + `;`, function (err, results, fields) {
          if (err) throw err;
          quantity = parseInt(r.quantity)

          if (results[0].stock >= quantity) {
            currentStock = results[0].stock - quantity
            connection.query(
              `UPDATE items 
              SET stock = ` + currentStock + `
              WHERE id=`+ r.idNum + `;`, function (err, results, fields) {
                if (err) throw err
                console.log('success!')
                console.log(results)
                // put how much the transaction cost!
                
              }
            )
          } else {
            console.log('Insufficient Stock! There are ' + results[0].stock + ' left.')
          }
          connection.end()
        }
      )

    })


  })
}