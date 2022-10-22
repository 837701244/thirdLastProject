const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require("./config/db");

const indexRouter = require('./routes/indexRouter');
const orderRouter = require('./routes/orderRouter');
let productRouter = require("./routes/productRouter");
let shopcartRouter = require("./routes/shopcartRouter");
let userRouter = require("./routes/userRouter");
let addressRouter = require("./routes/addressRouter");


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const cors = require("./util/corsUtil");
app.use(cors);

const {filter,errHandler} = require("./util/jwtUtil");
app.use(['/list',"/shopcart","/order/create","/order/one","/order/list","/personal","/address"],filter());




app.use('/', indexRouter);
app.use('/product', productRouter);
app.use('/shopcart',shopcartRouter);
app.use('/order', orderRouter);
app.use('/personal', userRouter);
app.use('/address', addressRouter);






app.use(errHandler)
module.exports = app;
