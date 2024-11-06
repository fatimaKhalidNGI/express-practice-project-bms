module.exports = ( sequelize, DataTypes ) => {
    const Book = sequelize.define('Book', {
        book_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
    
        title : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : true
        },
    
        author : {
            type : DataTypes.STRING,
            allowNull : false
        },

        dateBorrowed : {
            type : DataTypes.DATE,
            allowNull : true,
            default : null
        },
    
        returnDate : {
            type : DataTypes.DATE,
            allowNull : true,
            default : null
        }
    });
    
    Book.associate = (models) => {
        Book.belongsTo(models.User, {
            foreignKey : 'user_id',
            as : "borrowed by"
        });
    };

    return Book;
    
}
