// Package Dependencies
// actually we don't need express since this run on Node back end and SQL

const inquirer = require("inquirer");

// helper command
const {rawTable,myQuery, getAllEmployees} = require('./helpers/dbHandlers');




/* // working query
const qString2 = `
    SELECT  employee.id, 
            first_name,
            last_name,
            title,
            salary,
            name  
    FROM employee
    JOIN (
        role 
        JOIN department 
            ON role.department_id = department.id
        ) 
        ON employee.role_id = role.id
    ORDER BY employee.id
`;
myQuery(qString2); */



getAllEmployees()