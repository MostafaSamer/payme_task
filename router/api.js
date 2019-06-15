const express = require('express');
const router = express.Router();

const data = require('../data/data');

function render_home_page(req, res) {
    //console.log(req.session.user);
    //console.log("This is from the flash " + req.flash('user')[0]);
    const username = req.flash('user')[0];
    console.log("username +++++ " + username);
    //console.log("username out: " + username);
    req.flash('user', username);
    if (username) {
        // get user todo and render it with the user name
        console.log("username: " + username);
        data.get_todo(username, function(todo_user) {
            res.render('home', {
                user: username,
                data: todo_user
            })
            res.end();
        })
    } else {
        res.render('login')
        res.end();
    }
}

// Get the todo list of the user
router.get('/', (req, res)=> {
    render_home_page(req, res)
    res.end();
})


// to check login data
router.post('/user/login', (req, res)=> {
    var username = req.body.username
    var pass = req.body.pass
    data.check_login(username, pass, function(result) {
        if (result) {
            //req.session.user = username
            req.flash('user', username)
            render_home_page(req, res)
        } else {
            // someting else
        }
    })
})

router.get('/register', (req, res)=> {
    res.render('register');
})

router.post('/user/register', (req, res)=> {
    var username = req.body.username
    var pass = req.body.pass
    data.check_username(username, function(result) {
        if (!result) {
            data.add_user(username, pass);
            render_home_page(req, res);
        } else {
            console.log("Already exist");
            res.render('error', {
                mess: 'username is already exist'
            })
        }

    })
})

router.post('/user/logout', (req, res)=> {
    //req.session.destroy();
    req.flash('user', '');
    res.redirect('/');
})

router.post('/add', (req, res)=> {
    var owner = req.body.owner
    var txt = req.body.txt
    req.flash('user', owner)
    data.add_todo(owner, txt);
    render_home_page(req, res)
})

router.post('/delete', (req, res)=> {
    var owner = req.body.owner
    var id = req.body.id
    var rev = req.body.rev
    req.flash('user', owner)
    data.del_todo(id, rev);
    render_home_page(req, res)
})

module.exports = router;
