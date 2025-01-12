const { DataTypes } = require("sequelize");
const sequelize = require('../config/database');

const BidInfo = sequelize.define(
    'BidInfo',
    {
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        month: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        week: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        count: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }
    },
    {
        timestamps: false
    }    
);

module.exports = BidInfo;
