const sequelize = require("../config/database.js");
const BidInfo = require("../models/bidInfo.js");
const { getDateWeek } = require('../utils.js');

const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'];

exports.getAllBidInfos = (req, res) => {
    BidInfo.findAll()
    .then(bidInfos => res.json(bidInfos))
    .catch(error => res.status(500).json({
        message: 'Internal server error',
        error: error,
    }));
};

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

    const monthIndex = new Date().getMonth();
    const month = monthArray[monthIndex];
    const date = new Date().getDay();
    const week = getDateWeek(new Date());

    const query = `SELECT id FROM bidInfos WHERE 
        userId = '${userId}' AND
        month = '${month}' AND
        date = '${date}' AND
        week = '${week}'
        `;

    const [result] = await sequelize.query(query);
    const id = result[0].id;

    console.log(id);

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

    const monthIndex = new Date().getMonth();
    const month = monthArray[monthIndex];
    const date = new Date().getDay();
    const week = getDateWeek(new Date());

    try{
        const newBid = await BidInfo.create({
            userId,
            month,
            date,
            week,
            count
        });
    
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