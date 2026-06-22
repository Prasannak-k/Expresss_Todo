// Get updated To do Lists 
// Create a Todo task 
// View Todo Lists 
// Delete Todo Lists 


// To print the mockdata in table , to add / delete / change a task through a button the page 

require('dotenv').config();
const express = require('express');
const path = require("node:path")
const app = express();
const PORT = 3000;
const taskRoutes = require('./routes/tasks');
const mongoose = require('mongoose')


app.use(express.json()); 

app.use(express.static(path.join(__dirname,'public')));

app.use('/tasks', taskRoutes);

app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname,'public','index.html')); 
});

mongoose.connect(process.env.MONGO_URI)
     .then(() => {
        console.log("Connected to MongoDB!");

        app.listen(PORT,()=>{
            console.log(`Server is running on http://localhost:${PORT}/`);
        });
     })
     .catch((error) => {
        console.error("MongoDB COnnection Failed: ", error);
     });    