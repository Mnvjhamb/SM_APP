const express = require('express');
const port = 8000;

const app = express();
const db = require("./config/mongoose")
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const passportLocal = require('./config/passport-local')
const bodyParser = require('body-parser')

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// setting up express session 
app.use(session({
    name: "SM-app",
    secret: "secretforSMAPP",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 60)
    },
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/SM_app' })

}))

// initializing passport 
app.use(passport.initialize());
app.use(passport.session()); 

app.use(passport.setAuthenticatedUser);

// Entry route for app
app.use('/', require('./routes/home'));

app.listen(port, (err)=>{
    if(err){
        console.log("ERROR", err);
        return;
    }

    console.log(`Server running at port ${port}`);
})