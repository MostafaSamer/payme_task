const md5 = require('md5');
const nodeCouchdb = require('node-couchdb');

var couch = new nodeCouchdb({
    auth: {
        user: 'admin',
        pass: 'root'
    }
})

const dbName = 'todo_payme'
const user_view = '_design/user_view/_view/user'
const todo_view = '_design/user_view/_view/todo'

// for the reg
var check_username = function(username, callback) {
    couch.get(dbName, user_view + "?key=\"" + username + "\"").then(
        function(data, header, status) {
            if (data.data.rows[0]) {
                callback(true);
                console.log("found");
            } else {
                callback(false)
                console.log("Not found");
            }
        },
        function(err) {
            console.log("Error in geting data");
        }
    )
}

// for the login
var check_login = function(username, pass, callback) {
    couch.get(dbName, user_view + "?key=\"" + username + "\"").then(
        function(data, header, status) {
            if (data.data.rows[0] && md5(pass) == data.data.rows[0].value) {
                callback(true)
                console.log("found");
            } else {
                callback(false)
                console.log("Not found");
            }
        },
        function(err) {
            console.log("Error in geting data");
        }
    )
}

// get todo for a user
var get_todo = function(username, callback) {
    couch.get(dbName, todo_view + "?key=\"" + username + "\"").then(
        function(data, header, status) {
            console.log(data.data.rows);
            callback(data.data.rows)
        },
        function(err) {
            console.log("Error in geting data");
        }
    )
}

// add a todo for a user
var add_todo = function(username, txt) {
    couch.uniqid().then(function(ids) {
        const id = ids[0];
        couch.insert(dbName, {
            txt: txt,
            owner: username
        }).then(
            function(data, header, status) {
                console.log("Data Saved!");
            },
            function(err) {
                console.log("Error!");
            }
        )
    })
}

// delete a todo
var del_todo = function(id, rev) {
    couch.del(dbName, id, rev).then(
        function(data, header, Static) {
            console.log("Deleted");
        },
        function(err) {
            console.log("Error in deleting a todo");
        }
    )
}

// to add a new user
var add_user = function(username, pass) {
    couch.uniqid().then(function(ids) {
        const id = ids[0];
        couch.insert(dbName, {
            username: username,
            pass: md5(pass)
        }).then(
            function(data, header, status) {
                console.log("new user Data Saved!");
            },
            function(err) {
                console.log("Error!");
            }
        )
    })
}

module.exports = {
    check_username: check_username,
    check_login: check_login,
    get_todo: get_todo,
    add_todo: add_todo,
    del_todo: del_todo,
    add_user: add_user
};
