const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');

const flash = require('connect-flash');
const session = require('express-session');
const ejs = require("ejs");
const path = require('path');
const cors = require("cors");
const PORT = process.env.PORT || 5002
const db = require("./models")

// create express server
const app = express();

// Passport authentication Config
require('./config/passport')(passport);

// let the app use cors
app.use(cors());
const bodyParser = require('body-parser');

// ...

// Parse JSON bodies for API requests
app.use(bodyParser.json());


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash messuages
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(express.static(path.join(__dirname,'./public')));


// Routes



app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/report', require('./routes/report'));
app.use('/rowmaterial', require('./routes/rowmaterial'));
app.use('/sales', require('./routes/sales'));
app.use('/inventory', require('./routes/inventory'));
app.use('/expense', require('./routes/expense'));
app.use('/customer', require('./routes/customer'));
app.use('/employee', require('./routes/employee'));
app.use('/salesmanager', require('./routes/salesmanager'));
app.use('/productionmanager', require('./routes/productionmanager'));
app.use('/inventorymanager', require('./routes/inventorymanager'));

app.use('/config', require('./routes/config'));

// initialize our app
// {force: true}
db.sequelize.sync().then(() => {
 
});


app.listen(PORT, () => {
  console.log(`listening at: http://localhost:${PORT}`)
});
