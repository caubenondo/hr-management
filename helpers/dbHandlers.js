const mysql = require("mysql2");
const cTable = require("console.table"); 
const express = require("express");

// Connect to database
const db = mysql.createConnection(
    {
        host: "localhost",
        // MySQL username
        user: "root",
        // MySQL password
        password: "rootroot",
        database: "employees",
    },
    console.log(`Connected to the employee database.`)
);

// CRAFTED QUERIES
const qStringViewAllEmployees = `
    SELECT
        e.id AS ID, 
        e.first_name AS 'FIRST NAME', 
        e.last_name AS 'LAST NAME', 
        role.title AS 'JOB TITLE', 
        department.name AS DEPARTMENT, 
        role.salary AS 'SALARY', 
        IFNULL(CONCAT(m.first_name, ' ', m.last_name), '') AS 'MANAGER'
    FROM
        employee m
    RIGHT JOIN employee e ON
        m.id = e.manager_id
    JOIN (
        role 
        JOIN department 
            ON role.department_id = department.id
        ) 
        ON e.role_id = role.id
    ORDER BY e.id;
`;
// for debug purpose
const rawTable = async (table) => {
    db.query(`SELECT * FROM ${table}`, async (err, res) => {
        if (err) throw err;
        console.log(`=========== ${table} TABLE =============`);
        console.table(await res);
    });
};

// use this function for adding role,dept,employee
const addQuery =  (qString) =>{
    db.query(qString,(err,res)=>{
        if (err) throw err;
        console.log('Success added!');
    });
};

// use this table for general view purpose since it will clear the console view and display the main table
const myQuery = (qString) => {
    db.query(qString, (err, res) => {
        if (err) throw err;
        console.clear();
        console.table(res);
    });
};

// Will return result as promise for data handling on the front end
const retrieveData = (qString) => {
    return (data = db
        .promise()
        .query(qString)
        .then(([rows]) => {
            return rows;
        }));
};

// simple select view all role query
const viewAllRoles = () => {
    myQuery(
        "select salary as SALARY, title as TITLE , department.name as DEPARTMENT from role join department on role.department_id = department.id order by salary"
    );
};

// show me the Big picture
const getAllEmployees = () => {
    myQuery(qStringViewAllEmployees);
};

// not much different from other query but it will show update console
const updateQuery = (qString) =>{
    db.query(qString,(err,res)=>{
        if(err) throw err;
        console.log('Sucessful update the record!');
    });
};

// delete query
const delRecord = (qString) =>{
    db.query(qString,(err,res)=>{
        if(err) throw err;
        console.log('Sucessful remove the record!');
    });
};


// export functions
module.exports = {
    rawTable,
    myQuery,
    getAllEmployees,
    viewAllRoles,
    retrieveData,
    addQuery,
    updateQuery,
    delRecord
};
