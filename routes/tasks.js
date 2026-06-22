const express = require('express');
const router = express.Router();
const Task = require ('../models/Task');


router.get('/', async (req,res)=> {
    try{
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (e) {
        res.status(500).json({error: "Server error while fetching tasks"});
    }
});


router.get("/:id", async (req,res) => {
    try{
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({error: 'To-do task does not exist!'});
        res.status(200).json(task);
    }catch (e){
        res.status(400).json({error: 'Invalid task ID'});
    }
});

router.post("/", async (req,res)=> {
    const { task } = req.body;
    if(!task) return res.status(400).json({error:"Task Description required" });

    try{
        const newTask = await Task.create({ task: task , completed: false});
        res.status(201).json(newTask);
    } catch(e) {
       res.status(500).json({error: " Failed to create task"});
    }
});

router.put("/:id", async (req,res)=> {
    const {task, completed} = req.body;
    try{
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {task, completed},
            {new: true}
        );
        if (!updatedTask) return res.status(404).json({error:"To-do Task does not exist"});
        res.status(200).json(updatedTask);
    } catch (error){
        res.status(400).json ({ error:" Invalid Task Id" });
    }
});

router.delete('/:id', async (req,res) => {
    try{
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if(!deletedTask) return res.status(404).json({error: " To-Do Task does not exist"});
        res.status(200).json({message: 'Task Deleted', deletedTask});
    } catch (e){
        res.status(400).json({error:"Invalid Task ID"});
    }
});

module.exports = router;
