const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');


app.use(cors());
const fs = require('fs');
var json = require('./myBudget.json');
var budget = JSON.parse(fs.readFileSync('./myBudget.json'));

/*app.get('/hello',(req,res) => {
    res.send('Hello World!');

});*/

app.get('/budget',(req,res) => {
    res.json(budget);

});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});
