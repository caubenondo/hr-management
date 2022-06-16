// Package Dependencies
// actually we don't need express since this run on Node back end and SQL


const inquirer = require("inquirer");
const { mainMenu } = require("./helpers/controlHandler");

// helper command
const { getAllEmployees, myQuery, retrieveData } = require("./helpers/dbHandlers");

// getAllEmployees();

mainMenu();




