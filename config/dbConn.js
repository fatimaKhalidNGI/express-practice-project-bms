const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    'express_practice_project',
    'root',
    'fatima123',
    {
        host : 'localhost',
        dialect : 'mysql'
    }
);

const connectDB = async() => {
    try{
        await sequelize.authenticate();
        console.log("DB connected successfully");
    
    } catch(error){
        console.log("DB not connected. Error: ", error);
    }
};

const UserModel = require('../models/userModel');
const BookModel = require('../models/booksModel');
const RequestModel = require('../models/requestModel');

const User = UserModel( sequelize, DataTypes );
const Book = BookModel( sequelize, DataTypes );
const Request = RequestModel( sequelize, DataTypes );

const models = { User, Book, Request };
Object.keys(models).forEach((modelName) => {
    if(models[modelName].associate){
        models[modelName].associate(models);
    }
});

sequelize.sync()
    .then(() => {
        console.log("Models synced with DB");
    })
    .catch((error) => {
        console.log("Sync failed. Error: ", error);
    });

module.exports = { sequelize, connectDB, User, Book, Request };