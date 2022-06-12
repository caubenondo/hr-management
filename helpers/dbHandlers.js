const mysql = require("mysql2");
const cTable = require('console.table')
// Connect to database
const db = mysql.createConnection({
    host: "localhost",
    // MySQL username
    user: "root",
    // MySQL password
    password: "rootroot",
    database: "employees",
});

// CRAFTED QUERIES
const qStringViewAllEmployees = `
    SELECT
        e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, 
        CONCAT(m.first_name, ' ', m.last_name) AS 'manager'
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
    ORDER BY e.id
`;

const rawTable = async (table) => {
    db.query(`SELECT * FROM ${table}`, async (err, res) => {
        if (err) throw err;
        console.log(`=========== ${table} TABLE =============`);
        console.table(await res);
    });
};

const myQuery = async (qString) => {
    db.query(qString, async (err, res) => {
        if (err) throw err;
        console.table('fancy', await res);
    });
};
const retrieveData = async (qString) => {
    db.query(qString, async (err,res)=>{
        if(err) throw err;
        return await res
    })
}

const getAllEmployees = async () => {
    myQuery(qStringViewAllEmployees);
};

module.exports = { rawTable, myQuery, getAllEmployees };
