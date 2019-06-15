const express = require('express');
const router = express.Router();

const data = require('../data/data');

function render_home_page(req, res) {
    console.log(req.session.user);
    if (req.session.user) {
        // get user todo and render it with the user name
        const username = req.session.user;
        data.get_todo(username, function(todo_user) {
            res.render('home', {
                user: username,
                data: todo_user
            })
        })
    } else {
        res.render('login')
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
            req.session.user = username
        }
        render_home_page(req, res)
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
        } else {
            console.log("Already exist");
        }
        render_home_page(req, res);
    })
})

router.post('/user/logout', (req, res)=> {
    req.session.destroy();
    res.redirect('/');
})

router.post('/add', (req, res)=> {
    var owner = req.body.owner
    var txt = req.body.txt
    data.add_todo(owner, txt);
    render_home_page(req, res);
})

router.post('/delete', (req, res)=> {
    var id = req.body.id
    var rev = req.body.rev
    data.del_todo(id, rev);
    render_home_page(req, res)
})

module.exports = router;
