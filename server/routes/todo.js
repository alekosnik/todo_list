const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express.Router();

let todoModel = require("./../models/todo");

// add todo
app.post("/add", (req, res) => {
    todoModel.findOne({ title: req.body.todoName, username:req.body.username }, (err, user) => {
      if (user) {
        res.send([1, "'Name' exist"]);
      } else {
        if (req.body.todoName == "" || req.body.todoPriority == "") {
          res.send([1, "Please fill the field"]);
        } else if (isNaN(req.body.todoPriority)) {
          res.send([1, "'Priority' must be a number"]);
        } else if (req.body.todoPriority <= 0 || req.body.todoPriority > 10) {
          res.send([1, "'Priority' must be between 1 to 10"]);
        } else {
          let newTodo = new todoModel();
          newTodo.title = req.body.todoName;
          newTodo.priority = req.body.todoPriority;
          newTodo.username = req.body.username
          newTodo.completed = false;
          newTodo.save((err) => {
            if (err) {
              console.log(err);
              res.send([1, "Error while adding Todo"]);
            } else {
              console.log(newTodo);
              res.send([0, "Todo added"]);
            }
          });
        }
      }
    });
  });
  
  // completed
  app.post("/completed", (req, res) => {
    todoModel.find({username: req.body.username, completed: true }, (err, todos) => {
      if (err) {
        res.send("Error while fetching Todos");
      } else {
        res.json(todos);
      }
    });
  });
  
  // uncompleted
  app.post("/uncompleted", (req, res) => {
    todoModel.find({ username: req.body.username, completed: false }, (err, todos) => {
      if (err) {
        res.send("Error while fetching Todos");
      } else {
        res.json(todos);
      }
    });
  });
  
  // update
  app.post("/complete/:id", (req, res) => {

    todoModel.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      (err, todo) => {
        if (err) {
          res.send([1, "Error while completing todo"]);
        } else {
          res.send([0, "Todo complete"]);
        }
      }
    );
  });
  
  app.post("/undo/:id", (req, res) => {
    todoModel.findByIdAndUpdate(
      req.params.id,
      { completed: false },
      (err, todo) => {
        if (err) {
          res.send([1, "Error while completing todo"]);
        } else {
          res.send([0, "Undo Action"]);
        }
      }
    );
  });
  
  // delete todo
  app.delete("/delete/:id", (req, res) => {
    let query = { _id: req.params.id };
    todoModel.deleteOne(query, (err) => {
      if (err) {
        res.send([1, "Error while deleting todo"]);
      } else {
        res.send([0, "Todo deleted"]);
      }
    });
  });

  module.exports = app