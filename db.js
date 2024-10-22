const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId

const userSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String,
    userId: ObjectId
});

const taskSchema = new Schema({
    title: String,
    description: String,
    dueDate: Date,
    // completed: {type: Boolean, default: false},
    creatorId: ObjectId
})

const userModel = mongoose.model("user", userSchema);
const taskModel = mongoose.model("tasks", taskSchema)

module.exports = {
    userModel,
    taskModel
}