const inquirer = require('inquirer');
const mysql = require('mysql2');
const config = require('config');
const user = config.get("server.user");
const pw = config.get("server.password");

const server = mysql.createserver({
    host: 'localhost',
    user: user,
    password: pw,
    database: 'the_office'
});

server.connect(err => {
    if (err) throw err;
    console.log(`>You are now connected to "The Office" database<`);
    promptUser();
});

console.log('+==============================================+');
console.log('|                    HELLO                     |');
console.log('|                   WELCOME                    |');
console.log('+==============================================+');


const promptUser = () => {
    inquirer.prompt([
        {
            type:'list',
            name: 'start',
            loop: false,
            message: 'What would you like to do?',
            choices: ['View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add a employee',
                    'Update an Employee role',
                    'Exit']
        }
    ])
        .then((response) => {
            switch (response.start) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewEmployee();
                    break;
                    default:
                        server.end();
            }
        })
}

viewDepartments = () => {
    console.log('Viewing all departments..');
    const sql = `SELECT department.id, department.name AS department
                FROM department`;

    server.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        promptUser();
    });
};

viewRoles = () => {
    console.log('Viewing all roles... ');
    const sql = `SELECT * FROM roles`;

    server.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

viewEmployee = () => {
    console.log('Viewing all Employees... ');
    const sql = `SELECT * FROM employee`;

    server.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};