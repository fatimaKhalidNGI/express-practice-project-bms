require('dotenv').config();
const express = require('express');
const {connectDB} = require('./config/dbConn');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/books', require('./routes/booksRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/lf', require('./routes/libFunRoutes'));
app.use('/ub', require('./routes/unavailableBooksRouter'));

app.listen(port, () => {
    console.log(`Server running on Port ${port}`);
})

