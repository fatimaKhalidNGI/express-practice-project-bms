require('dotenv').config();
const express = require('express');
const {connectDB} = require('./config/dbConn');

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({extended : false}));
app.use(express.json());

connectDB();

app.use('/books', require('./routes/booksRoutes'));

app.listen(port, () => {
    console.log(`Server running on Port ${port}`);
})

