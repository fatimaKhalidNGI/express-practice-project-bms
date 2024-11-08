module.exports = ( sequelize, DataTypes ) => {
    const Request = sequelize.define("Request", {
        request_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },

        book_title : {
            type : DataTypes.STRING,
            allowNull : false
        },

        book_author : {
            type : DataTypes.STRING,
            allowNull : false
        },

        status : {
            type : DataTypes.STRING,
            allowNull : false
        },

        admin_response : {
            type : DataTypes.STRING,
            allowNull : true
        }
    });

    Request.associate = (models) => {
        Request.belongsTo(models.User, {
            foreignKey : 'user_id',
            as : "requested by"
        });
    };

    return Request;
}