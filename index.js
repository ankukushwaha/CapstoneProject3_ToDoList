import express from "express";
import bodyParser from "body-parser"; 
import mongoose from "mongoose";
import _ from "lodash";

const app = express();
var port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://ankurkushwaha7408:Kushwaha123@cluster0.8onnf8w.mongodb.net/toDoListDB",{useNewUrlParser: true});

const toDoSchema = new mongoose.Schema({
    name: String
})

const ToDoWork = mongoose.model('ToDoWork', toDoSchema);
const ToDoToday = mongoose.model('ToDoToday', toDoSchema);

const listSchema = new mongoose.Schema({
    name : String, 
    items: [toDoSchema]
})
const List = mongoose.model('List', listSchema);

let alertMessage = null;

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
var d = new Date();
var dayName = days[d.getDay()];
var monthName = month[d.getMonth()];
var date = d.getDate() + " " + monthName + " " + d.getFullYear() + " " + `(${dayName})`;

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/click", (req, res) => {
    ToDoWork.find({}).then((tasks1) => {
        res.render("partials/work.ejs", {DateName: date, addTask: tasks1, alertMsg: alertMessage, heading:"Work"});
    });
})

app.get("/today", (req, res) => {
    ToDoToday.find({}).then((tasks2) => {
        // console.log(tasks2); 
        res.render("partials/today.ejs", {DateName: date, addTask: tasks2, alertMsg: alertMessage, heading:"Today"});
    });
})


app.get("/:customListName", (req,res) => {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName}).then((foundList) => {
        if(foundList){
            // console.log(foundList);   
            res.render("partials/work.ejs", {DateName: date, addTask: foundList.items, alertMsg: alertMessage, heading: foundList.name});
        }
        else{
            const list = new List({
                name: customListName
            })
            list.save();
            res.redirect("/" + customListName);
            // console.log("not exists");
        }
    }).catch((err) => {console.log(err)});
})


app.post("/add1", (req, res) => {
    var task = req.body.text;
    const listName = req.body.list;
    // console.log(listName);

    const tasks = new ToDoWork({
        name: task
    });

    if(task === ""){
        alertMessage = "Please fill it first!";
        res.redirect("/click");
    }
    else{
        alertMessage = null;

        if(listName === "Work"){
            tasks.save();
            res.redirect("/click");
        }
        else{
            List.findOne({name: listName}).then((foundList) => {
                foundList.items.push(tasks);
                foundList.save();
                res.redirect("/"+listName);
            })
            .catch((err) => console.log(err));
        }
    }
})

app.post("/deleteWork", (req,res) => {
    const id = req.body.checkbox;
    const listName = req.body.listName;
    // console.log(listName); 

    if(listName === "Work"){
        ToDoWork.findByIdAndRemove(id).then(() => console.log("Successfully deleted"))
        .catch((err) => console.log(err));
        res.redirect("/click");
    }
    else{
        List.findOneAndUpdate({name:listName}, {$pull : {items: {_id: id}}}).then(() => {
            console.log("deleted sucessfully");
            res.redirect("/"+listName);
        })
    }
})

app.post("/add2", (req, res) => {
    var task = req.body.text;
    if(task === ""){
        alertMessage = "Please fill it first!";
    }
    else{
        const tasks = new ToDoToday({
            name: task
        })
        tasks.save();
        alertMessage = null;
    }
    res.redirect("/today");   
})


app.post("/deleteToday", (req,res) => {
    ToDoToday.findByIdAndRemove(req.body.checkbox).then(() => console.log("successfully deleted"))
    .catch((err) => console.log(err));
    res.redirect("/today");
})




app.listen(port, () => {
    console.log(`Server is successfully running at port ${port}.`);
})