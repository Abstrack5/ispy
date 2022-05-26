const cTable = require('console.table');
const inquirer = require('inquirer');
const db = require('./db/connection');



const promptUser = () => {
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        choices: [`'View all Departments', 'View all Roles', 'View all Employees', 'Add a Department','Add a Role','Add an Employee','Update an Employee's Role'`]
    })
    .then(() => {

    });


}; 




db.connect((err) => {
    if (err) throw err;
    console.log("Database connected");
    // app.listen(PORT, () => {
    //   console.log(`Server is up and running on port ${PORT}`);
    // });

    // promptUser(); maybe?

  });
  
const {} = require('./lib/department');
const {} = require('./lib/employee');
const {} = require('./lib/roles');