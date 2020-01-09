const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const passport = require('passport');

const _DB = require('./db');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// express session middleware setup
app.use(session({
    secret: 'W$q4=25*8%v-}UV',
    resave: true,
    saveUninitialized: true
}));
// passport middleware setup ( it is mandatory to put it after session middleware setup)
app.use(passport.initialize());
app.use(passport.session());

app.set('port', process.env.PORT || 3000);

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next() } else { res.send(401) }
}

app.use('/data', require('./controllers/data_plain'));

app.get('/', function(req, res) {
    // res.sendFile(__dirname + '/login.html');
    res.sendFile(__dirname + '/login.html');
});
app.get('/products', function(req, res) {
    res.sendFile(__dirname + '/graph.html');
});
app.get('/qt', function(req, res) {
    res.sendFile(__dirname + '/qt.html');
});
app.get('/sales-focust', function(req, res) {
    res.sendFile(__dirname + '/sf.html');
});
if (!module.parent) {
    app.listen(app.get('port'));
    console.log("server listening on port " + app.get('port'));
}


/*  PASSPORT SETUP  */



app.get('/success', (req, res) => res.send("Welcome " + req.query.username + "!!"));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {

    console.log(user.id);
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    /*User.findById(id, function(err, user) {
        cb(err, user);
    });*/
    cb({ id });
    /*_DB.findModelById("User", id, function( user) {
        console.log("=================================================oooooooooooooooooooooooooooo=========================");
        console.log(user);
        console.log("=================================================oooooooooooooooooooooooooooo=========================");
        cb(user);
    });*/
});

/* PASSPORT LOCAL AUTHENTICATION */

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {

        let qry = { where: { email: username } };
        _DB.findModelAll("User", qry,
            function(user) {
                /*if (err) {
                    return done(err);
                }*/

                if (!user || user.length == 0) {
                    return done(null, false);
                }

                if (!user[0] || !user[0].dataValues || user[0].dataValues.password != password) {
                    return done(null, false);
                }
                console.log(user[0].dataValues);
                return done(null, user[0].dataValues);
            });
    }
));

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/error' }),
    function(req, res) {
        console.log(req.isAuthenticated());
        res.redirect('/success?username=' + req.user.email);
        //res.redirect('/sales-focust');
    });

/*app.post('/login', passport.authenticate('local', {
    failureRedirect: '/error',
    successRedirect: '/sales-focust'
}));*/

function isLoggedIn(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/');
    }
}