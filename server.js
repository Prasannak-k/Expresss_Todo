// Get updated To do Lists 
// Create a Todo task 
// View Todo Lists 
// Delete Todo Lists 


// To print the mockdata in table , to add / delete / change a task through a button the page 


const express = require('express');
const path = require("node:path")
const app = express();
const PORT = 3000;
const taskRoutes = require('./routes/tasks');



app.use(express.json()); 

app.use(express.static(path.join(__dirname,'public')));

app.use('/tasks', taskRoutes);

app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname,'public','index.html')); 
});

//LISTEN 
app.listen (PORT , () =>{
    console.log ('Server is Running on http://localhost:3000/');
}

);