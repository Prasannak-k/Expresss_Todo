const express = require('express');
const { error } = require('node:console');
const fs = require('node:fs');
const path = require('node:path');
const router = express.Router();
const filePath = path.join(__dirname, '../mock_data.json');

// HElPER FUNCTION = is a small reusable function that is designed to perform a specific/single task to simplify code and reduce repetition

//used to read fresh form so restarts don't lose edits 
const readTasks = () => JSON.parse(fs.readFileSync(filePath, 'utf-8'));

//To write the new taks back to file 
const savetTasks = (tasks) => fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));

// To assign ID number to a new taks
const getNextId = (tasks) => {
    if (tasks.length === 0 ) return 1;
    let highestId = 0;
    for(let i = 0; i < tasks.length ; i++ ){
        if(tasks[i].id > highestId) highestId = tasks[i].id;
    }
    return highestId + 1;
};

//Show all Tasks 
router.get('/',(req, res) => {
    const tasks = readTasks();
    res.status(200).json(tasks);
});



//GET request to get a task through id 
router.get("/:id", (req, res)=>{
    const tasks = readTasks();
    const taskID = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskID);
    
    if(!task){
        return res.status(404).json({error: 'To-Do task does not exists !'});
    }
    res.status(200).json(task);
});




//Create a New task
router.post('/', (req,res) => {
    const tasks = readTasks();
    const {task} = req.body;

    if(!task){
        return res.status(400).json({error: 'Task Description required '});

    }
    const newTask = {id:getNextId(tasks), task: task, completed: false};

    tasks.push(newTask);
    savetTasks(tasks);

    res.status(201).json(newTask);
});




//To update a existing task
router.put('/:id',(req ,res ) =>{
    const tasks = readTasks();
    const taskId = parseInt(req.params.id); 
    const { task, completed } = req.body;

    const taskIndex = tasks.findIndex(t => t.id === taskId); 
    if(taskIndex === -1){
        return res.status(404).json({error: 'To-Do Task does not exist'});
    }
    if(task !== undefined) tasks[taskIndex].task = task;
    if(completed !== undefined) tasks[taskIndex].completed = completed;

    savetTasks(tasks);
    res.status(200).json(tasks[taskIndex]); 
});



//To Delete a task 
//To Delete a task 
router.delete('/:id',(req ,res ) =>{
    const tasks = readTasks();
    const taskId = parseInt(req.params.id); 

    const taskIndex = tasks.findIndex(t => t.id === taskId); 
    if(taskIndex === -1){
        return res.status(404).json({error: 'To-Do Task does not exist'});
    }
    
    const deletedTask = tasks.splice(taskIndex, 1);
    savetTasks(tasks);
    res.status(200).json({message:'Task Deleted!', deletedTask});
});

module.exports = router;