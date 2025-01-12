const User = require("../models/bid.model.js");

exports.getAllBids = (req, res) => {
    User.findAll()
    .then(users => res.json(users))
    .catch(error => res.status(500).json({error: 'error'}));
};