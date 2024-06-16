const express = require('express');
const { itemCruds } = require('./tblItem/tblItemController');
const {studentCruds} = require('./tblStudent/tblStudentController')
var mysql = require('mysql');

const app = express();
const port = 3000;

app.use(express.json());

var con = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'root',
    database:'sample',
})

con.connect((err) => {
    if (err) throw err;
    console.log('connected successfully');
});

itemCruds(app,con);
studentCruds(app,con);

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});