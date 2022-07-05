require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path")

const app = express();
app.use(express.json());
app.use(cors());

// const PORT = process.env.PORT || 9000
// __dirname=path.resolve()
// if(pro)

mongoose.connect(process.env.DB_CONNECTION_STRING);
mongoose.connection.once("open", () =>{
    console.log("DB connection successful");
})

const multiTodoSchema = new mongoose.Schema({
    content: String,
})
const MultiTodo = new mongoose.model("MultiTodo", multiTodoSchema);


app.get("/decision/getTodos", (req, res) =>{
    
    MultiTodo.find({}, (err, foundTodos) =>{
        if(err){
            console.log(err);
        }
        if(foundTodos){
            res.json(foundTodos);
        }
    })
})
app.post("/decision/addTodos", (req, res)=>{
    const newTodo = new MultiTodo({
        content : req.body.todo
    })
    newTodo.save(err =>{
        if(err){
            console.log(err);
        }
    })
})
app.delete("/decision/deleteTodo/:id", (req, res)=>{
    const id = req.params.id;
    MultiTodo.findByIdAndRemove(id).exec(err =>{
        if(err){
            console.log(err);
        }
    })
})

app.put("/decision/updateTodo", (req, res)=>{
    const id = req.body.id;
    const newContent = req.body.newContent;
    MultiTodo.findById({_id: id}, (err, updateTodo) =>{
        if(err){
            console.log(err);
        }
        updateTodo.content = newContent;
        updateTodo.save();
    })
})

if (process.env.NODE_ENV == "production"){   
    app.use(express.static("self-grooming-frontend/build"));
}

app.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`);
})