const { Router } = require("express");
const { taskModel } = require("../db");
const { z } = require("zod");
const taskRouter = Router();

// Get tasks for logged-in user
taskRouter.get('/get-task', async function (req, res) {
    const getUserId = req.userId; //the userId is coming from auth middleware

    const tasks = await taskModel.find({
        creatorId: getUserId
    }) 

    res.json({
        message: "List of all tasks",
        tasks
    })
})

// Create new user
taskRouter.post("/new-task", async function (req, res) {
    const createTaskId =req.userId

    const requireBody = z.object({
        title: z.string().min(2),
        description: z.string().min(2),
        dueDate: z.string()
    })

    const parseDataWithSuccess = requireBody.safeParse(req.body)

    if(!parseDataWithSuccess.success) {
        res.json({
            message: "Incorrect format",
            error: parseDataWithSuccess.error
        })
        return
    }

    const {title, description, dueDate} = req.body;

    const createTask = await taskModel.create({
        title,
        description,
        dueDate,
        creatorId: createTaskId
    })
    res.json({
        message: "Task Created",
        taskId: createTask._id
    })
})

    // edit task
taskRouter.put("/new-task", async function (req, res) {
    const createTaskId =req.userId

    const {title, description, dueDate, userId} = req.body;

    const createTask = await taskModel.updateOne({
        _id: userId, // the userid will go in the json body(postman)
        creatorId: createTaskId

    },{
        title,
        description,
        dueDate
    })
    res.json({
        message: "Task updated",
        taskId: createTask._id
    })
})

    // delete task
taskRouter.delete("/new-task/:id", async function (req, res) {
    await taskModel.findByIdAndDelete(req.params.id)
    res.json({
        message: "Task deleted"
    })
})

module.exports = {
    taskRouter: taskRouter
}