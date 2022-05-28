const db = require('../db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

const { promptUser } = require('../server')

// view all departments,  viewDept()
//         presents tables with department names and department ids


const viewDept = () => {
    const sql = `SELECT * FROM department`

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err.message)
            return;
        }
        console.table(results);
        promptUser();
    })
}

module.exports ={viewDept};