const { DataTypes } = require("sequelize");
const sequelize = require('../config/database');

const User = sequelize.define(
    'User',
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        paranoid: true,
        defaultScope: {
            attributes: { exclude: ['password'] }, // Exclude password by default
        },
        scopes: {
            withPassword: {
                attributes: {}, // Include all attributes, including password IE: User.scope('withPassword').findByPk(userId);
            },
        }, 
    }    
);

sequelize.sync();

module.exports = User;
