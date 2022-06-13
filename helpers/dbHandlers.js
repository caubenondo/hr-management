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

const rawTable = async (table) => {
    db.query(`SELECT * FROM ${table}`, async (err, res) => {
        if (err) throw err;
        console.log(`=========== ${table} TABLE =============`);
        console.table(await res);
    });
};

const addQuery =  (qString) =>{
    db.query(qString,(err,res)=>{
        if (err) throw err;
        console.log('Success added!');
    });
};


const myQuery = (qString) => {
    db.query(qString, (err, res) => {
        if (err) throw err;
        console.clear();
        console.table(res);
    });
};

const retrieveData = (qString) => {
    return (data = db
        .promise()
        .query(qString)
        .then(([rows]) => {
            return rows;
        }));
};

const viewAllRoles = () => {
    myQuery(
        "select salary as SALARY, title as TITLE , department.name as DEPARTMENT from role join department on role.department_id = department.id order by salary"
    );
};

const getAllEmployees = () => {
    myQuery(qStringViewAllEmployees);
};
const updateQuery = (qString) =>{
    db.query(qString,(err,res)=>{
        if(err) throw err;
        console.log('Sucessful update the record!');
    });
};

const delRecord = (qString) =>{
    db.query(qString,(err,res)=>{
        if(err) throw err;
        console.log('Sucessful remove the record!');
    });
};
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
