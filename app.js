const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

var app = express();

// socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server);

// POST req
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// View Enginee
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

// Routers
var routers = require('./router/api');
app.use('/', routers);

// localhost
server.listen(process.env.PORT || 3000, ()=> {
    console.log("app is running at port 3000");

    io.on('connection', (socket)=> {
        console.log("Connected");

        //handle a new todo
        socket.on('new:todo', function(todo_obj) {
            io.emit('new:todo', todo_obj);
        })

    })

})
