module.exports = ( sequelize, DataTypes ) => {
    const User = sequelize.define('User', {
        user_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
    
        email : {
            type : DataTypes.STRING,
            allowNull : false
        },
    
        password : {
            type : DataTypes.STRING,
            allowNull : false
        },
    
        role : {
            type : DataTypes.STRING,
            allowNull : false
        }
    });
        
    User.associate = (models) => {
        User.hasMany(models.Book, {
            foreignKey : 'user_id',
            as : "books"
        });
    };

    return User;
}