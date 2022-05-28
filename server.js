const cTable = require('console.table');
const inquirer = require('inquirer');
const db = require('./db/connection');

// imports of functions 
const {viewDept} = require('./lib/department');
const {} = require('./lib/employee');
const {} = require('./lib/roles');

console.log('+================================+');
console.log('|            WELCOME             |')
console.log('+================================+');

const promptUser = () => {
    inquirer
    .prompt([
        {
        type: 'list',
        name: 'start',
        message: 'What would you like to do?',
        choices: ['View all Departments', 
                'View all Roles', 
                'View all Employees', 
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Exit']
        }
    ])
    .then((data) => {
        switch (data['start']) {
            case "View all Departments":
                viewDept();
                break;
            case "View  all Roles":
                viewRoles();
                break;
            case "View all Employees":
                viewEmployees();
                break;
            case "Add a Department":
                addDept();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Add an Employee":
                addEmployee();
                break;
            case "Update an Employee Role":
                updateRole();
                break;
            case "Exit":
                console.log('+================================+');
                console.log('|              BYE               |')
                console.log('+================================+');
                break;
        }
    });
}; 


module.exports = { promptUser };

db.connect((err) => {
    if (err) throw err;
    // console.log("Database connected");
    // app.listen(PORT, () => {
    //   console.log(`Server is up and running on port ${PORT}`);
    // });

    promptUser();

  });
  
