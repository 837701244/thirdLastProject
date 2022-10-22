const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("./config/db");

const indexRoute = require('./routes/indexRoute');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
let categoryRoute = require("./routes/categoryRoute");

const app = express();




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const cors = require("./util/corsUtil");
app.use(cors);


const {noFilter,errHandler} = require("./util/jwtUtil");
app.use(noFilter(["/login"]));


app.use('/', indexRoute);
app.use('/personal', userRoute);
app.use('/product',productRoute);
app.use('/category',categoryRoute);


// error handler
app.use(errHandler);

module.exports = app;
