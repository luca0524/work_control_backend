const sequelize = require("../config/database.js");
const url = require('url');
const BidInfo = require("../models/bidInfo.js");
const { getDateWeek } = require('../utils.js');

exports.getAllBidInfos = (req, res) => {
    const parsedUrl = url.parse(req.url, true); // Parse the URL
    const userId = parsedUrl.query.userId;     // Extract userId from the query parameters
    const monthReq = parsedUrl.query.month;

    const month = new Date().getMonth() + 1;
    const date = new Date().getDate();
    const week = getDateWeek(new Date());

    if (!userId && !monthReq) {
        BidInfo.findAll()
        .then((bidInfos) => {
            return res.json(bidInfos.filter(item => item.userId === userId && item.month === monthReq));
        }).catch(error => res.status(500).json({
            message: 'Internal server error',
            error: error,
        }));
    }

    BidInfo.findAll()
    .then((bidInfos) => {
        if (!userId) {
            bidInfos.forEach(bidInfo => {
                if (bidInfo.userId == userId && bidInfo.month == month && bidInfo.date == date && bidInfo.week == week) {
                    return res.json(bidInfo);
                }
            })
        }
        res.json(bidInfos);
    })
    .catch(error => res.status(500).json({
        message: 'Internal server error',
        error: error,
    }));
};

exports.getBidInfoByUserId = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const month = new Date().getMonth() + 1;
    const date = new Date().getDate();
    const week = getDateWeek(new Date());

    const query = `SELECT count FROM bidInfos WHERE 
        userId = '${userId}' AND
        month = '${month}' AND
        date = '${date}' AND
        week = '${week}'
        `;

    const [result] = await sequelize.query(query);
    res.send(result);
};

exports.getTodayBidInfo = async (req, res) => {
    const userId = req.query.userId;
    const date = new Date().getDate();

    const result = await this.getBidInfoByDate(userId, date);

    if (result.length == 0) { // create new bid row
        const newBid = await this.createBid(userId);
        return res.json({
            message: "Today Bid Info Created.",
            newBid: newBid
        });
    }

    res.send(result);
};

exports.getLastBidInfo = async (req, res) => {
    const userId = req.query.userId;
    const date = new Date().getDate();

    const result = await this.getBidInfoByDate(userId, date - 1);

    res.send(result);
};

exports.getBidInfoByDate = async (userId, date) => {
    const month = new Date().getMonth() + 1;
    const week = getDateWeek(new Date());

    const query = `SELECT count FROM bidInfos WHERE 
        userId = '${userId}' AND
        month = '${month}' AND
        date = '${date}' AND
        week = '${week}'
    `;

    const [result] = await sequelize.query(query);

    return result;
}

exports.getLastWeekBidInfos = async (req, res) => {
    const userId = req.query.userId;
    const week = getDateWeek(new Date());

    const query = `SELECT count FROM bidInfos WHERE 
        userId = '${userId}' AND
        week = '${week - 1}'
    `;

    const [result] = await sequelize.query(query);

    res.send(result);
}

exports.getThisWeekBidInfos = async (req, res) => {
    const userId = req.query.userId;
    const week = getDateWeek(new Date());

    const query = `SELECT count FROM bidInfos WHERE 
        userId = '${userId}' AND
        week = '${week}'
    `;

    const [result] = await sequelize.query(query);

    res.send(result);
}

exports.getBidInfoById = async (req, res) => {
    const id = parseInt(req.params.id);

    try{
        const bidInfo = await BidInfo.findByPk(id);
        
        if (!bidInfo) {
            return res.status(400).send({
                message: "BIdInfo not found"
            })
        }

        res.status(201).json({
            bidInfo
        });
    } catch(error) {
        res.status(500).json({
            message: 'Internal server error',
            error
        });
    }
};

exports.updateBidInfoById = async (req, res) => {
    const id = parseInt(req.params.id);
    const { userId, count } = req.body;
    
    try{
        const bidInfo = await BidInfo.findByPk(id);
        
        if (!bidInfo) {
            return res.status(400).send({
                message: "BidInfo not found"
            })
        } else {
            bidInfo.count = count;
            await bidInfo.save();

            res.status(201).json({
                message: 'BidInfo updated successfully',
                UpdatedBidInfo: bidInfo
            });
        }
    } catch(error) {
        res.status(500).json({
            message: 'Internal server error',
            error
        });
    }
};

exports.updateBidInfo = async (req, res) => {
    const { userId, count } = req.body;

    const month = new Date().getMonth() + 1;
    const date = new Date().getDate();
    const week = getDateWeek(new Date());

    const query = `SELECT id FROM bidInfos WHERE 
        userId = '${userId}' AND
        month = '${month}' AND
        date = '${date}' AND
        week = '${week}'
        `;

    const [result] = await sequelize.query(query);
    const id = result[0].id;


    try{
        const bidInfo = await BidInfo.findByPk(id);
        
        if (!bidInfo) {
            return res.status(400).send({
                message: "BidInfo not found"
            })
        } else {
            bidInfo.count = count;
            await bidInfo.save();

            res.status(201).json({
                message: 'BidInfo updated successfully',
                UpdatedBidInfo: bidInfo
            });
        }
    } catch(error) {
        res.status(500).json({
            message: 'Internal server error',
            error
        });
    }
};

exports.deleteBidInfoById = async (req, res) => {
    const id = parseInt(req.params.id);

    try{
        const bidInfo = await BidInfo.findByPk(id);
        
        if (!bidInfo) {
            return res.status(400).send({
                message: "BidInfo not found"
            })
        } 
        await bidInfo.destroy();

        res.status(201).json({
            message: 'BidInfo deleted',
        });
    } catch(error) {
        res.status(500).json({
            message: 'Internal server error',
            error
        });
    }
};

exports.createBidInfo = async (req, res) => {
    const { userId, count } = req.body;
    
    if (!userId) {
        return res.status(400).send({
            message: "userId connot be empty!"
        });
    }

    try{
        const newBid = await this.createBid(userId);
    
        res.status(201).json({
            message: 'New Bid create.',
            newBid: newBid
        });
    } catch(error) {
        res.status(500).json({
            message: 'An error occured while registering the user',
            error
        });
    }
};

exports.createBid = async (userId) => {
    const month = new Date().getMonth() + 1;
    const date = new Date().getDate();
    const week = getDateWeek(new Date());

    const newBid = await BidInfo.create({
        userId,
        month,
        date,
        week,
    });

    return newBid;
}