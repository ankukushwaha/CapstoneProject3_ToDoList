import express from "express";
import bodyParser from "body-parser"; 

const app = express();
var port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var tasks1 = [];
var tasks2 = [];
let alertMessage = null;

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/click", (req, res) => {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    var d = new Date();
    var dayName = days[d.getDay()];
    var monthName = month[d.getMonth()];
    var date = d.getDate() + " " + monthName + " " + d.getFullYear() + " " + `(${dayName})`;
    res.render("partials/work.ejs", {DateName: date, addTask: tasks1, alertMsg: alertMessage});
})

app.get("/today", (req, res) => {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    var d = new Date();
    var dayName = days[d.getDay()];
    var monthName = month[d.getMonth()];
    var date = d.getDate() + " " + monthName + " " + d.getFullYear() + " " + `(${dayName})`;
    res.render("partials/today.ejs", {DateName: date, addTask: tasks2, alertMsg: alertMessage});
})

app.post("/add1", (req, res) => {
    var task = req.body.text;
    if(task === ""){
        alertMessage = "Please fill it first!";
    }
    else{
        tasks1.push(task);
        alertMessage = null;
    }
    res.redirect("/click");
})

app.post("/add2", (req, res) => {
    var task = req.body.text;
    if(task === ""){
        alertMessage = "Please fill it first!";
    }
    else{
        tasks2.push(task);
        alertMessage = null;
    }
    res.redirect("/today");
    
})

app.listen(port, () => {
    console.log(`Server is successfully running at port ${port}.`);
})